from rest_framework import serializers
from .models import Document, Chunk

class ChunkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chunk
        fields = ['id', 'content', 'chunk_index', 'metadata']

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'content', 'source_type', 'file_url', 'uploaded_at', 'processed']
        read_only_fields = ['processed']
