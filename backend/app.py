from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from src.helper import download_hugging_face_embeddings
from src.prompt import system_prompt
from langchain_pinecone import PineconeVectorStore
from langchain_core.vectorstores import VectorStoreRetriever
from openai import OpenAI, APIError, RateLimitError
import google.generativeai as genai
from dotenv import load_dotenv
import os
from datetime import datetime

# Initialize Flask App
app = Flask(__name__)
CORS(app)
load_dotenv()

# API Keys
GROK_API_KEY = os.environ.get('GROK_API_KEY')
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY or ""


# Initialize Embeddings and Pinecone
embeddings = download_hugging_face_embeddings()
index_name = "cbse-academic-chatbot"

try:
    docsearch = PineconeVectorStore.from_existing_index(
        index_name=index_name,
        embedding=embeddings
    )
except Exception as e:
    print(f"Warning: Could not load Pinecone index '{index_name}': {e}")
    docsearch = None

# ═════════════════════════════════════════════════════════
# TOKEN TRACKER CLASS
# ═════════════════════════════════════════════════════════

class TokenTracker:
    """Track API token usage and manage provider exhaustion"""
    def __init__(self, grok_limit=50000, gemini_limit=1000000):
        self.grok_tokens = 0
        self.grok_limit = grok_limit
        self.gemini_tokens = 0
        self.gemini_limit = gemini_limit
        self.grok_exhausted = False
        self.gemini_exhausted = False
        self.active_provider = "grok"
        self.last_switched = None

    def add_grok_tokens(self, tokens):
        self.grok_tokens += tokens
        if self.grok_tokens >= self.grok_limit:
            self.grok_exhausted = True
            self.switch_provider("gemini")

    def add_gemini_tokens(self, tokens):
        self.gemini_tokens += tokens
        if self.gemini_tokens >= self.gemini_limit:
            self.gemini_exhausted = True

    def switch_provider(self, provider):
        if provider != self.active_provider:
            self.active_provider = provider
            self.last_switched = datetime.now().isoformat()
            print(f"✅ Switched to {provider.upper()} provider")

    def get_status(self):
        return {
            "active_provider": self.active_provider,
            "grok_tokens": self.grok_tokens,
            "grok_limit": self.grok_limit,
            "grok_exhausted": self.grok_exhausted,
            "gemini_tokens": self.gemini_tokens,
            "gemini_limit": self.gemini_limit,
            "gemini_exhausted": self.gemini_exhausted,
            "last_switched": self.last_switched
        }

    def can_use_grok(self):
        return GROK_API_KEY and not self.grok_exhausted

    def can_use_gemini(self):
        return GEMINI_API_KEY and not self.gemini_exhausted

token_tracker = TokenTracker()

# ═════════════════════════════════════════════════════════
# AI PROVIDER SETUP
# ═════════════════════════════════════════════════════════

# Initialize Grok (OpenAI-compatible)
grok_client = OpenAI(
    api_key=GROK_API_KEY,
    base_url="https://api.x.ai/v1"
) if GROK_API_KEY else None

# Initialize Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-2.5-flash')
else:
    gemini_model = None

def get_retriever_for_grade_subject(grade: int, subject: str) -> VectorStoreRetriever:
    """Get retriever filtered by grade and subject"""
    if not docsearch:
        return None
    
    filters = {"grade": grade, "subject": subject.lower()}
    return docsearch.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 4, "fetch_k": 16, "filter": filters}
    )

def call_grok(system_prompt_text: str, user_message: str) -> tuple:
    """Call Grok API with fallback logic"""
    if not token_tracker.can_use_grok():
        return None, None
    
    try:
        response = grok_client.chat.completions.create(
            model="grok-3-mini",
            messages=[
                {"role": "system", "content": system_prompt_text},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=300
        )
        content = response.choices[0].message.content
        tokens = response.usage.total_tokens if response.usage else 100
        token_tracker.add_grok_tokens(tokens)
        return content, "grok"
    except RateLimitError:
        print("⚠️ Grok Rate Limit Hit")
        token_tracker.grok_exhausted = True
        return None, None
    except APIError as e:
        if "quota" in str(e).lower():
            print("⚠️ Grok Quota Exceeded")
            token_tracker.grok_exhausted = True
        return None, None
    except Exception as e:
        print(f"⚠️ Grok Error: {e}")
        return None, None

def call_gemini(system_prompt_text: str, user_message: str) -> tuple:
    """Call Gemini API"""
    if not token_tracker.can_use_gemini():
        return None, None
    
    try:
        full_prompt = f"{system_prompt_text}\n\nUser: {user_message}"
        response = gemini_model.generate_content(full_prompt)
        content = response.text
        tokens = len(full_prompt.split()) + len(content.split())  # Rough estimation
        token_tracker.add_gemini_tokens(tokens)
        return content, "gemini"
    except Exception as e:
        print(f"⚠️ Gemini Error: {e}")
        if "quota" in str(e).lower() or "resource_exhausted" in str(e).lower():
            token_tracker.gemini_exhausted = True
        return None, None

def get_ai_response(system_prompt_text: str, user_message: str) -> tuple:
    """
    Intelligently route to Grok or Gemini with fallback logic.
    Returns (response_text, provider_name)
    """
    # Try Grok first
    if token_tracker.can_use_grok():
        response, provider = call_grok(system_prompt_text, user_message)
        if response:
            token_tracker.switch_provider("grok")
            return response, provider
        else:
            # Grok failed, try Gemini
            if token_tracker.can_use_gemini():
                response, provider = call_gemini(system_prompt_text, user_message)
                if response:
                    token_tracker.switch_provider("gemini")
                    return response, provider
    
    # If Grok disabled/exhausted, use Gemini
    elif token_tracker.can_use_gemini():
        response, provider = call_gemini(system_prompt_text, user_message)
        if response:
            token_tracker.switch_provider("gemini")
            return response, provider
    
    return "Sorry, I'm unable to respond right now. Please try again later! 🤔", None

# ═════════════════════════════════════════════════════════
# ACADEMIC ENDPOINTS
# ═════════════════════════════════════════════════════════

@app.route("/api/status", methods=["GET"])
def status():
    """Get current AI provider status and token usage"""
    return jsonify(token_tracker.get_status())

@app.route("/api/chat", methods=["POST"])
def chat():
    """Main learning chat endpoint"""
    try:
        data = request.json or {}
        message = data.get('message', '')
        grade = data.get('grade', 1)
        subject = data.get('subject', 'Mathematics')
        language = data.get('language', 'en')
        
        if not message:
            return jsonify({"error": "No message provided"}), 400
        
        # Validate grade
        if grade not in [1, 2, 3, 4]:
            return jsonify({"error": "Grade must be 1, 2, 3, or 4"}), 400
        
        # Get retriever for grade/subject
        retriever = get_retriever_for_grade_subject(grade, subject)
        
        context = ""
        sources = []
        if retriever:
            try:
                relevant_docs = retriever.get_relevant_documents(message)
                context = "\n".join([doc.page_content for doc in relevant_docs])
                sources = [
                    {
                        "chapter": doc.metadata.get("chapter", "N/A"),
                        "page": doc.metadata.get("page_number", "N/A"),
                        "textbook": doc.metadata.get("textbook_name", "CBSE")
                    }
                    for doc in relevant_docs
                ]
            except Exception as e:
                print(f"Retriever error: {e}")
        
        # Build system prompt with grade and subject
        filled_prompt = system_prompt.format(
            context=context,
            grade=grade,
            subject=subject,
            language=language
        )
        
        # Get AI response
        response, provider = get_ai_response(filled_prompt, message)
        
        return jsonify({
            "response": response,
            "provider": provider,
            "grade": grade,
            "subject": subject,
            "sources": sources
        })
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/quiz", methods=["POST"])
def quiz():
    """Generate quiz questions for a grade/subject/topic"""
    try:
        data = request.json or {}
        grade = data.get('grade', 1)
        subject = data.get('subject', 'Mathematics')
        topic = data.get('topic', '')
        difficulty = data.get('difficulty', 'medium')
        
        if not topic:
            return jsonify({"error": "Topic is required"}), 400
        
        quiz_prompt = f"""You are Vidya 🌟. Generate a multiple choice quiz question for a Grade {grade} {subject} student about '{topic}'.

Format your response EXACTLY as JSON (no markdown, just raw JSON):
{{
  "question": "Question text here?",
  "options": {{
    "A": "Option A",
    "B": "Option B",
    "C": "Option C",
    "D": "Option D"
  }},
  "correct_answer": "B",
  "explanation": "Explanation text",
  "points": 10,
  "textbook_reference": "Check [Textbook Name], Chapter [X], Page [Y]"
}}

Ensure:
- Question is age-appropriate for Grade {grade}
- One correct answer
- Indian context in options
- Difficulty level: {difficulty}
- All responses must be valid JSON"""
        
        response, provider = get_ai_response(
            "You are a helpful quiz generator for CBSE students.",
            quiz_prompt
        )
        
        # Try to parse JSON response
        import json
        try:
            quiz_data = json.loads(response)
        except:
            quiz_data = {
                "question": response,
                "options": {"A": "Option 1", "B": "Option 2", "C": "Option 3", "D": "Option 4"},
                "correct_answer": "A",
                "explanation": "Check textbook for details",
                "points": 10,
                "textbook_reference": "CBSE Curriculum"
            }
        
        return jsonify({
            "quiz": quiz_data,
            "provider": provider,
            "grade": grade,
            "subject": subject
        })
    except Exception as e:
        print(f"Quiz error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/doubt", methods=["POST"])
def doubt_solver():
    """Guided doubt-solving endpoint (never gives direct answers)"""
    try:
        data = request.json or {}
        question = data.get('question', '')
        grade = data.get('grade', 1)
        subject = data.get('subject', 'Mathematics')
        previous_attempts = data.get('previous_attempts', 0)
        
        if not question:
            return jsonify({"error": "Question is required"}), 400
        
        # Adjust approach based on attempts
        if previous_attempts == 0:
            approach = "Ask a guiding question first"
        elif previous_attempts == 1:
            approach = "Give a hint and ask them to try again"
        else:
            approach = "Use a completely different explanation method with step-by-step guide"
        
        doubt_system_prompt = f"""You are Vidya 🌟 — a patient doubt-solving buddy for Grade {grade} {subject} students.

IMPORTANT: NEVER give direct answers to student doubts!

Instead:
1. First ask a guiding question that helps them think
2. Give a small hint
3. Let them work it out
4. Support them step by step

Current approach (attempt {previous_attempts}): {approach}

Use simple words, emojis, and Indian examples. Max 100 words."""
        
        retriever = get_retriever_for_grade_subject(grade, subject)
        context = ""
        if retriever:
            try:
                relevant_docs = retriever.get_relevant_documents(question)
                context = "\n".join([doc.page_content for doc in relevant_docs])
            except:
                pass
        
        filled_prompt = doubt_system_prompt + f"\n\nContext from textbooks:\n{context}"
        response, provider = get_ai_response(filled_prompt, question)
        
        return jsonify({
            "response": response,
            "provider": provider,
            "approach": approach,
            "grade": grade,
            "subject": subject
        })
    except Exception as e:
        print(f"Doubt error: {e}")
        return jsonify({"error": str(e)}), 500

# ═════════════════════════════════════════════════════════
# HEALTH CHECK
# ═════════════════════════════════════════════════════════

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Vidya 🌟 Academic Chatbot",
        "ai_providers": {
            "grok": {"available": bool(grok_client), "exhausted": token_tracker.grok_exhausted},
            "gemini": {"available": bool(gemini_model), "exhausted": token_tracker.gemini_exhausted}
        }
    })

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)
