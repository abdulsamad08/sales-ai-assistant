from django.urls import path
from .views import chat, history

urlpatterns = [
    path('chat/', chat),
    path('chat/history/<str:lead_id>/', history),
]
