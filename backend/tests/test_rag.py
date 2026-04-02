import pytest
import django
import os

# Set up Django environment for standalone tests
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from documents.models import Document, Chunk
from documents.services import chunk_text, generate_embedding
from ai.services import cosine_similarity, classify_intent

@pytest.mark.django_db
def test_chunk_creation():
    doc = Document.objects.create(
        title="Pricing", 
        content="40ft standard container: $3,850. 20ft: $2,100..."
    )
    chunks = chunk_text(doc.content, size=50) # Smaller size for quick test
    assert len(chunks) > 0
    # Each chunk is just text string initially
    assert all(isinstance(c, str) for c in chunks)

def test_embedding_similarity():
    emb1 = generate_embedding("shipping container prices")
    emb2 = generate_embedding("container pricing information")
    # Both should be close in meaning
    assert cosine_similarity(emb1, emb2) > 0.5

def test_intent_classification():
    assert classify_intent("How much is a 40ft container?") == "pricing"
    assert classify_intent("Do you deliver to Texas?") == "availability"
    assert classify_intent("I want to place an order") == "conversion"
    assert classify_intent("What are the dimensions?") == "general"
