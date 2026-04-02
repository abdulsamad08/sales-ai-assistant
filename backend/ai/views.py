from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services import handle_message
from .models import Conversation, ChatTurn
from rest_framework import serializers

class ChatTurnSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatTurn
        fields = ['id', 'user_message', 'ai_response', 'intent', 'created_at']

@api_view(['POST'])
def chat(request):
    """
    Main chat endpoint.
    """
    lead_id = request.data.get('lead_id')
    message = request.data.get('message')
    
    if not lead_id or not message:
        return Response({'error': 'lead_id and message are required'}, status=status.HTTP_400_BAD_MESSAGE)
    
    response_data = handle_message(lead_id, message)
    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['GET'])
def history(request, lead_id):
    """
    Get chat history for a lead.
    """
    try:
        conv = Conversation.objects.get(lead_id=lead_id)
        turns = conv.turns.all().order_by('created_at')
        serializer = ChatTurnSerializer(turns, many=True)
        return Response(serializer.data)
    except Conversation.DoesNotExist:
        return Response([])
