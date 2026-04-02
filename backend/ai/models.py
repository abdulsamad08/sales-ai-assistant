from django.db import models

class Conversation(models.Model):
    lead_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Chat for {self.lead_id}"

class ChatTurn(models.Model):
    conversation = models.ForeignKey(Conversation, related_name='turns', on_delete=models.CASCADE)
    user_message = models.TextField()
    ai_response = models.TextField()
    intent = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Turn in {self.conversation.lead_id}"
