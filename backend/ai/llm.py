import logging
from django.conf import settings
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)

_client = None

def get_client():
    global _client
    if _client is None:
        if not settings.GEMINI_API_KEY:
             print("DEBUG: GEMINI_API_KEY IS MISSING IN SETTINGS!")
             return None
        print(f"DEBUG: INITIALIZING GEMINI CLIENT WITH KEY STARTING WITH: {settings.GEMINI_API_KEY[:5]}...")
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client

def call_llm(system_prompt: str, user_query: str):
    """
    Call Google Gemini model for chat responses.
    """
    print(f"DEBUG: CALLING LLM FOR QUERY: {user_query}")
    if settings.LLM_BACKEND == "mock":
        print("DEBUG: LLM_BACKEND IS SET TO MOCK!")
        return None
    if not settings.GEMINI_API_KEY:
        print("DEBUG: NO GEMINI_API_KEY FOUND!")
        return None

    try:
        client = get_client()
        if not client: return None

        config = types.GenerateContentConfig(
            system_instruction=system_prompt
        )
        
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=user_query,
            config=config
        )
        return response.text

    except Exception as e:
        print(f"DEBUG: GEMINI CALL FAILED: {e}")
        logger.error(f"Gemini call failed: {e}")
        return None
