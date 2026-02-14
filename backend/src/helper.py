from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from typing import List
from langchain.schema import Document
import os
import re
from pathlib import Path


def download_hugging_face_embeddings():
    """
    Use multilingual embeddings to support both English and Hindi.
    Model: paraphrase-multilingual-MiniLM-L12-v2
    Returns 384-dimensional embeddings (compatible with Pinecone default)
    """
    embeddings = HuggingFaceEmbeddings(
        model_name='sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2'
    )
    print("✅ Loaded multilingual embeddings (384 dimensions, supports EN/HI)")
    return embeddings


def extract_metadata_from_folder(folder_name: str) -> dict:
    """
    Extract grade and subject from folder name.
    
    Supported patterns:
    - english_grade1 → subject: English, grade: 1
    - mathematics_grade2 → subject: Mathematics, grade: 2
    - hindi_3 → subject: Hindi, grade: 3
    - evs_grade4 → subject: EVS, grade: 4
    - maths_1 → subject: Mathematics, grade: 1
    """
    
    folder_lower = folder_name.lower()
    metadata = {
        "subject": "Unknown",
        "grade": 1,
        "textbook_name": "CBSE"
    }
    
    # Subject mapping (handle abbreviations)
    subject_patterns = {
        r'(math|maths)': 'Mathematics',
        r'english': 'English',
        r'hindi': 'Hindi',
        r'evs': 'EVS'
    }
    
    for pattern, subject_name in subject_patterns.items():
        if re.search(pattern, folder_lower):
            metadata["subject"] = subject_name
            break
    
    # Extract grade: look for "grade1", "grade_1", "_1", etc.
    grade_match = re.search(r'grade[_-]?([1-4])|_([1-4])$|_([1-4])[_-]', folder_lower)
    if grade_match:
        grade_str = grade_match.group(1) or grade_match.group(2) or grade_match.group(3)
        metadata["grade"] = int(grade_str)
    
    # Textbook name mapping
    subject = metadata["subject"].lower()
    grade = metadata["grade"]
    textbook_map = {
        "mathematics": f"Math Magic - Grade {grade}",
        "english": f"Marigold - Grade {grade}",
        "hindi": f"Rimjhim - Grade {grade}",
        "evs": f"Looking Around - Grade {grade}"
    }
    metadata["textbook_name"] = textbook_map.get(subject, f"CBSE Grade {grade}")
    
    return metadata


def extract_chapter_from_filename(filename: str) -> str:
    """
    Extract chapter number/name from PDF filename.
    
    Supported patterns:
    - chapter1.pdf → 1
    - ch2.pdf → 2
    - 3.pdf → 3
    - chapter_introduction.pdf → Introduction
    - ch_basic_concepts.pdf → Basic Concepts
    """
    
    filename_lower = filename.lower()
    
    # Try "chapter" pattern: chapter1, chapter_1, chapter_intro, etc.
    chapter_match = re.search(r'chapter[_-]?([a-zA-Z0-9]+)', filename_lower)
    if chapter_match:
        return chapter_match.group(1).capitalize()
    
    # Try "ch" pattern
    ch_match = re.search(r'^ch(?:apter)?[_-]?([a-zA-Z0-9]+)', filename_lower)
    if ch_match:
        return ch_match.group(1).capitalize()
    
    # Try just number at start: "1.pdf", "2.pdf"
    num_match = re.search(r'^(\d+)[_\.-]', filename_lower)
    if num_match:
        return num_match.group(1)
    
    # Fallback: return filename without extension
    return Path(filename).stem.capitalize()


def load_cbse_pdfs_from_folders(data_dir: str = "data") -> List[Document]:
    """
    Load all CBSE PDFs from organized folder structure.
    
    Expected structure:
    data/
      ├── english_grade1/
      │   ├── chapter1.pdf
      │   ├── chapter2.pdf
      │   └── chapter3.pdf
      ├── mathematics_grade1/
      │   ├── chapter1.pdf
      │   ├── chapter2.pdf
      │   └── chapter3.pdf
      ├── hindi_grade2/
      │   ├── chapter1.pdf
      │   └── chapter2.pdf
      └── evs_grade3/
          ├── chapter1.pdf
          └── chapter2.pdf
    
    Returns list of documents with grade/subject/chapter/page_number metadata.
    """
    
    if not os.path.exists(data_dir):
        print(f"⚠️ Data directory '{data_dir}' not found!")
        return []
    
    # Get all folders in data directory
    subject_folders = [d for d in Path(data_dir).iterdir() if d.is_dir()]
    
    if not subject_folders:
        print(f"⚠️ No subject folders found in '{data_dir}'")
        print(f"   Expected structure: data/english_grade1/, data/mathematics_grade2/, etc.")
        return []
    
    print(f"📦 Found {len(subject_folders)} subject folders")
    all_documents = []
    folder_count = 0
    total_chapters = 0
    
    for subject_folder in sorted(subject_folders):
        folder_name = subject_folder.name
        print(f"\n📁 Processing folder: {folder_name}")
        
        # Extract grade and subject from folder name
        folder_metadata = extract_metadata_from_folder(folder_name)
        print(f"   📍 Subject: {folder_metadata['subject']}, Grade: {folder_metadata['grade']}")
        
        # Get all PDFs in this folder
        pdf_files = list(subject_folder.glob("*.pdf"))
        
        if not pdf_files:
            print(f"   ⚠️ No PDFs found in this folder")
            continue
        
        print(f"   📚 Found {len(pdf_files)} chapter PDFs")
        folder_count += 1
        
        for pdf_path in sorted(pdf_files):
            filename = pdf_path.name
            
            # Extract chapter from filename
            chapter = extract_chapter_from_filename(filename)
            
            print(f"      📖 {filename} (Chapter {chapter})")
            
            try:
                # Load PDF
                loader = PyPDFLoader(str(pdf_path))
                documents = loader.load()
                
                print(f"         ✅ {len(documents)} pages loaded")
                total_chapters += 1
                
                # Add metadata to each page
                for i, doc in enumerate(documents):
                    doc.metadata.update({
                        "grade": folder_metadata["grade"],
                        "subject": folder_metadata["subject"].lower(),
                        "chapter": chapter,
                        "page_number": i + 1,
                        "textbook_name": folder_metadata["textbook_name"],
                        "source_file": filename,
                        "source_folder": folder_name
                    })
                
                all_documents.extend(documents)
                
            except Exception as e:
                print(f"         ❌ Error loading {filename}: {e}")
                continue
    
    print(f"\n{'='*60}")
    print(f"✅ Loaded {folder_count} subject folders")
    print(f"✅ Loaded {total_chapters} chapter PDFs")
    print(f"✅ Total pages indexed: {len(all_documents)}")
    print(f"{'='*60}")
    
    return all_documents


def text_split(extracted_data: List[Document]) -> List[Document]:
    """
    Split CBSE documents into chunks while preserving metadata.
    Chunk size optimized for CBSE curriculum content.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", " ", ""]
    )
    text_chunks = text_splitter.split_documents(extracted_data)
    
    print(f"✅ Split into {len(text_chunks)} chunks (avg 500 tokens each)")
    return text_chunks
