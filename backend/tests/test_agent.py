import pytest
from ai.services import classify_intent

def test_intent_classification():
    # pricing | availability | general | conversion
    assert classify_intent("How much is a 40ft container?") == "pricing"
    assert classify_intent("Do you deliver to Texas?") == "availability"
    assert classify_intent("I want to place an order") == "conversion"
    assert classify_intent("Is the container new or used?") == "general"
