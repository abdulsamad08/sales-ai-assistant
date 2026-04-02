from django.db import models

class Document(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    source_type = models.CharField(max_length=50, default='markdown') # markdown, pdf, faq, etc.
    file_url = models.URLField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class Chunk(models.Model):
    document = models.ForeignKey(Document, related_name='chunks', on_delete=models.CASCADE)
    content = models.TextField()
    embedding = models.JSONField(null=True, blank=True)
    chunk_index = models.IntegerField()
    metadata = models.JSONField(default=dict)

    class Meta:
        ordering = ['chunk_index']

    def __str__(self):
        return f"Chunk {self.chunk_index} of {self.document.title}"
