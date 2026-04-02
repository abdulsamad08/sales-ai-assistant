import numpy as np
from typing import List, Dict, Any
from documents.models import Chunk
from documents.services import generate_embedding, model
from .models import Conversation, ChatTurn

def cosine_similarity(v1, v2):
    v1 = np.array(v1)
    v2 = np.array(v2)
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

def retrieve_context(query: str, top_k: int = 3) -> List[Dict[str, Any]]:
    """
    Search for the most relevant chunks based on query embedding.
    """
    query_emb = generate_embedding(query)
    all_chunks = Chunk.objects.all()
    
    similarities = []
    for chunk in all_chunks:
        if chunk.embedding:
            sim = cosine_similarity(query_emb, chunk.embedding)
            similarities.append((sim, chunk))
            
    # Sort by similarity
    similarities.sort(key=lambda x: x[0], reverse=True)
    
    results = []
    for sim, chunk in similarities[:top_k]:
        results.append({
            "content": chunk.content,
            "source": chunk.document.title,
            "similarity": float(sim)
        })
    return results

def build_prompt(query: str, context: List[Dict[str, Any]]) -> str:
    """
    Construct prompt for the LLM.
    """
    context_text = "\n---\n".join([f"Source: {c['source']}\n{c['content']}" for c in context])
    
    system_message = (
        "You are an expert AI Sales Assistant for a shipping container company. "
        "Your goal is to answer questions based ONLY on the provided context. "
        "If the answer isn't in the context, say you don't know and offer to connect them with a human sales rep. "
        "Be professional, persuasive but helpful, and guide towards a conversion (e.g. asking for their delivery zip code or container size needs)."
    )
    
    return f"{system_message}\n\nContext:\n{context_text}\n\nUser Question: {query}\n\nAssistant Response:"

def classify_intent(message: str) -> str:
    """
    Basic intent classification.
    """
    message = message.lower()
    if any(word in message for word in ["price", "cost", "how much", "quote"]):
        return "pricing"
    if any(word in message for word in ["deliver", "texas", "where", "ship"]):
        return "availability"
    if any(word in message for word in ["buy", "order", "purchase", "sale"]):
        return "conversion"
    return "general"

def mock_llm_response(prompt: str, intent: str) -> str:
    """
    For POC: Mock LLM response if real one not hooked up.
    Includes special treatment for intents.
    """
    if "price" in prompt.lower() or intent == "pricing":
        return "Based on our specs, a 40ft standard container starts at $3,850. Would you like a formal quote for your location?"
    return "Thank you for asking! Based on our documentation, yes we can help with that. What's your delivery zip code so I can check availability?"

def handle_message(lead_id: str, message: str) -> Dict[str, Any]:
    """
    Main entry point for handling chat messages.
    """
    # 1. Get/Create conversation
    conv, _ = Conversation.objects.get_or_create(lead_id=lead_id)
    
    # 2. Classify intent
    intent = classify_intent(message)
    
    # 3. Retrieve context
    context = retrieve_context(message)
    
    # 4. Build prompt
    prompt = build_prompt(message, context)
    
    # 5. Call LLM (mocking for now)
    response_text = mock_llm_response(prompt, intent)
    
    # 6. Save turn
    turn = ChatTurn.objects.create(
        conversation=conv,
        user_message=message,
        ai_response=response_text,
        intent=intent
    )
    
    return {
        "turn_id": turn.id,
        "role": "assistant",
        "content": response_text,
        "intent": intent,
        "sources": [c['source'] for c in context]
    }
