import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from documents.models import Document
from documents.services import ingest_document

DOCS = [
    {
        "title": "Pricing & Sizes",
        "content": """
        40ft Standard Container: $3,850. Best for large household moves or general storage.
        20ft Standard Container: $2,100. Ideal for tight spaces or limited storage needs.
        High Cube (40ftHC): $4,200. Extra 1ft of height for taller items.
        Bulk Discounts: Save 10% on orders of 5+ containers. 15% on 10+ units.
        """,
        "source_type": "pricing"
    },
    {
        "title": "Delivery Policies",
        "content": """
        We deliver to all 50 US states.
        State of Texas: Flat rate of $450 for delivery within 100 miles of Houston or Dallas.
        Scheduling: Basic delivery takes 3-5 business days. Expedited (within 48h) is available for an extra $200.
        Access: Site must be level and firm. We use tilt-bed trailers that require at least 100ft of straight-line clearance for a 40ft box.
        """,
        "source_type": "policy"
    },
    {
        "title": "Container Condition Guide",
        "content": """
        New Containers (One-Trip): High-spec units used once to bring goods into the USA. Like-new condition with minimal wear.
        Used (Cargo Worthy): Certified wind and water tight. May have dents or surface rust but structural integrity is 100%. 
        AS-IS: Units with some holes or issues, sold as storage only, not for international shipping.
        """,
        "source_type": "faq"
    },
    {
        "title": "Customization Options",
        "content": """
        Basic Painting: $250. Choose from our standard 5 colors.
        Lock boxes: $75 installed. High-security steel shroud.
        Windows & Doors: Custom personnel doors ($400) and windows ($250) can be added to any unit.
        Insulation: Closed-cell spray foam insulation starts at $1,200 for a 20ft container.
        """,
        "source_type": "service"
    }
]

def seed():
    print("Seeding documents...")
    for doc_data in DOCS:
        doc, created = Document.objects.get_or_create(
            title=doc_data['title'],
            defaults={
                "content": doc_data['content'],
                "source_type": doc_data['source_type']
            }
        )
        if created:
            print(f"Created {doc.title}, processing...")
            ingest_document(doc.id)
        else:
            print(f"Document {doc.title} already exists.")

if __name__ == "__main__":
    seed()
