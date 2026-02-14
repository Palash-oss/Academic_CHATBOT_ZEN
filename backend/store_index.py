from dotenv import load_dotenv
import os
from src.helper import load_cbse_pdfs_from_folders, text_split, download_hugging_face_embeddings
from pinecone import Pinecone
from pinecone import ServerlessSpec 
from langchain_pinecone import PineconeVectorStore

load_dotenv()

PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY

# ═════════════════════════════════════════════════════════
# CBSE ACADEMIC CHATBOT — INDEX BUILDER (FOLDER-BASED)
# ═════════════════════════════════════════════════════════

print("🚀 Vidya 🌟 — Building CBSE Academic Index...")
print("=" * 60)

# Use repo-root data directory (one level up from backend/)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DATA_DIR = os.path.join(BASE_DIR, 'data')

print(f"📂 Loading CBSE PDFs from: {DATA_DIR}")
print("Expected folder structure:")
print("  data/")
print("  ├─ english_grade1/")
print("  │   ├─ chapter1.pdf")
print("  │   ├─ chapter2.pdf")
print("  │   └─ chapter3.pdf")
print("  ├─ mathematics_grade1/")
print("  │   ├─ chapter1.pdf")
print("  │   ├─ chapter2.pdf")
print("  │   └─ chapter3.pdf")
print("  ├─ hindi_grade2/")
print("  │   ├─ chapter1.pdf")
print("  │   └─ chapter2.pdf")
print("  └─ evs_grade3/")
print("      ├─ chapter1.pdf")
print("      └─ chapter2.pdf")
print()

# Step 1: Load CBSE PDFs from folders
print("Step 1️⃣ : Loading CBSE PDF folders...")
extracted_data = load_cbse_pdfs_from_folders(data_dir=DATA_DIR)

if not extracted_data:
    print("⚠️  WARNING: No PDFs found in data/ folders!")
    print("Please organize CBSE PDFs using folder structure above.")
    exit(1)

# Step 2: Split into chunks
print("\nStep 2️⃣ : Splitting into chunks...")
text_chunks = text_split(extracted_data)

# Step 3: Download multilingual embeddings
print("\nStep 3️⃣ : Downloading multilingual embeddings...")
embeddings = download_hugging_face_embeddings()

# Step 4: Setup Pinecone
print("\nStep 4️⃣ : Setting up Pinecone Vector Database...")
pinecone_api_key = PINECONE_API_KEY

if not pinecone_api_key:
    print("❌ ERROR: PINECONE_API_KEY not found in .env")
    exit(1)

pc = Pinecone(api_key=pinecone_api_key)

# Use new CBSE-specific index name
index_name = "cbse-academic-chatbot"

print(f"   Index name: {index_name}")
print(f"   Dimension: 384 (multilingual embeddings)")
print(f"   Chunks to upload: {len(text_chunks)}")

# Create index if it doesn't exist
if not pc.has_index(index_name):
    print(f"   Creating new index '{index_name}'...")
    pc.create_index(
        name=index_name,
        dimension=384,
        metric="cosine",
        spec=ServerlessSpec(),
    )
    print(f"   ✅ Index created!")
else:
    print(f"   ✅ Index '{index_name}' already exists")

# Step 5: Upload documents to Pinecone
print(f"\nStep 5️⃣ : Uploading {len(text_chunks)} chunks to Pinecone...")
print("   (This may take a minute...)")

docsearch = PineconeVectorStore.from_documents(
    documents=text_chunks,
    index_name=index_name,
    embedding=embeddings,
)

print("   ✅ Upload complete!")

# ═════════════════════════════════════════════════════════
# SUCCESS
# ═════════════════════════════════════════════════════════

print("\n" + "=" * 60)
print("🎉 SUCCESS! Vidya 🌟 Index Ready!")
print("=" * 60)
print("\n📊 Index Summary:")
print(f"   Total Chunks: {len(text_chunks)}")
print(f"   Embedding Dimension: 384")
print(f"   Supported Languages: English, Hindi")
print(f"   Supported Grades: 1, 2, 3, 4")
print(f"   Supported Subjects: Mathematics, English, Hindi, EVS")
print(f"\n✅ You can now start the backend with:")
print("   python backend/app.py")
print(f"\n   The API will use index: {index_name}")
print("=" * 60)

