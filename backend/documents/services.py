import numpy as np
from typing import List
from .models import Document, Chunk
from sentence_transformers import SentenceTransformer

# Load on startup
model = SentenceTransformer('all-MiniLM-L6-v2')

def chunk_text(text: str, size: int = 500, overlap: int = 50) -> List[str]:
    """
    Standard character-based chunking with overlap.
    We chose 500 characters because shipping container specs are usually 
    small, concise data blocks. Large chunks would dilute the context 
    with too much irrelevant spec data.
    """
    chunks = []
    if not text:
        return chunks
    
    start = 0
    while start < len(text):
        end = start + size
        chunk = text[start:end]
        chunks.append(chunk)
        if end >= len(text):
            break
        start += (size - overlap)
        
    return chunks

def generate_embedding(text: str) -> List[float]:
    """
    Generate embedding using SentenceTransformer.
    """
    return model.encode(text).tolist()

def ingest_document(document_id: int):
    """
    Process document: chunk it, embed chunks, and store.
    """
    doc = Document.objects.get(id=document_id)
    # Clear existing chunks to avoid duplicates on re-ingestion
    doc.chunks.all().delete()
    
    chunks_content = chunk_text(doc.content)
    
    for i, content in enumerate(chunks_content):
        embedding = generate_embedding(content)
        Chunk.objects.create(
            document=doc,
            content=content,
            embedding=embedding,
            chunk_index=i,
            metadata={"title": doc.title}
        )
    
    doc.processed = True
    doc.save()
    return True
