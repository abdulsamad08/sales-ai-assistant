from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Document, Chunk
from .serializers import DocumentSerializer, ChunkSerializer
from .services import ingest_document

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all().order_by('-uploaded_at')
    serializer_class = DocumentSerializer
    
    @action(detail=True, methods=['post'])
    def ingest(self, request, pk=None):
        try:
            success = ingest_document(pk)
            return Response({'status': 'ingested'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_MESSAGE)

    @action(detail=True, methods=['get'])
    def chunks(self, request, pk=None):
        doc = self.get_object()
        chunks = doc.chunks.all()
        serializer = ChunkSerializer(chunks, many=True)
        return Response(serializer.data)
