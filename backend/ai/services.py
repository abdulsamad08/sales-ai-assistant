import numpy as np
import re
from typing import List, Dict, Any
from documents.models import Chunk
from documents.services import generate_embedding, model
from .models import Conversation, ChatTurn
from .llm import call_llm
from django.conf import settings

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
        # Filter out very low similarity to avoid hallucinating context
        if sim < 0.2:
            continue
        results.append({
            "content": chunk.content,
            "source": chunk.document.title,
            "similarity": float(sim)
        })
    return results

def classify_intent(message: str) -> str:
    """
    Basic intent classification.
    """
    message = message.lower()
    if any(word in message for word in ["price", "cost", "how much", "quote", "$"]):
        return "pricing"
    if any(word in message for word in ["deliver", "texas", "where", "ship", "timeline", "days"]):
        return "availability"
    if any(word in message for word in ["buy", "order", "purchase", "sale", "interested", "ready"]):
        return "conversion"
    return "general"

def build_prompt(query: str, context: List[Dict[str, Any]]) -> str:
    """
    Construct system prompt for the LLM.
    """
    context_text = "\n---\n".join([f"Source: {c['source']}\n{c['content']}" for c in context])
    
    return (
        "You are an expert AI Sales Assistant for a shipping container company. "
        "Your goal is to answer questions based ONLY on the provided context below. "
        "If the answer isn't in the context, be polite, offer general helpful advice about shipping containers, and guide towards a conversion (e.g. asking for their delivery site or needs).\n\n"
        f"CONTEXT:\n{context_text}\n\n"
        "Remember: Cite your sources when possible. Answer like a professional sales advisor."
    )

def heuristic_llm_response(query: str, context: List[Dict[str, Any]], intent: str) -> str:
    """
    A smart context-aware placeholder that simulates an LLM by extracting the 
    most relevant sentences from the top retrieved chunks.
    """
    if not context:
        return "I'm sorry, I couldn't find specific information on that in our current documentation. Would you like to speak with a human sales representative for more details?"

    # Extract sentences from context
    sentences = []
    for c in context:
        # Simple sentence splitting
        content = c['content'].replace('\n', ' ')
        sents = re.split(r'(?<=[.!?]) +', content)
        sentences.extend([(s, c['source']) for s in sents if len(s.strip()) > 10])

    # Find the sentence with the most overlapping words with the query
    query_words = set(re.findall(r'\w+', query.lower()))
    best_sent = ""
    best_score = -1
    best_source = ""

    for sent, source in sentences:
        sent_words = set(re.findall(r'\w+', sent.lower()))
        score = len(query_words.intersection(sent_words))
        if score > best_score:
            best_score = score
            best_sent = sent
            best_source = source

    # Build response based on intent and the best sentence found
    if intent == "pricing":
        base = f"Regarding pricing: {best_sent}"
        suffix = " Our team can provide a volume discount if you need more than 5 units. Shall I prepare a formal quote for you?"
        return base + suffix if best_score > 0 else "Our baseline pricing for standard units varies by location. According to our specs: " + best_sent
    
    if intent == "availability":
        return f"To answer your delivery question: {best_sent} Where are you located? I can check our current shipping slots."
    
    if intent == "conversion":
        return f"Excellent! {best_sent} Since you're ready to move forward, what size are you looking for, and where is the delivery site?"

    # General fallback
    if best_score > 1:
        return f"Based on our {best_source} documentation: {best_sent} Does that answer your question?"
    
    return f"Here's what I found in our {context[0]['source']}: {context[0]['content'].split('.')[0]}... Would you like more specific details?"

def handle_message(lead_id: str, message: str) -> Dict[str, Any]:
    """
    Main entry point for handling chat messages.
    """
    conv, _ = Conversation.objects.get_or_create(lead_id=lead_id)
    intent = classify_intent(message)
    context = retrieve_context(message)
    
    # 1. Try real LLM (Gemini)
    system_prompt = build_prompt(message, context)
    response_text = call_llm(system_prompt, message)
    
    # 2. Fallback to heuristic mock if LLM fails
    if not response_text:
        response_text = heuristic_llm_response(message, context, intent)
    
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
        "sources": list(set([c['source'] for c in context]))
    }
