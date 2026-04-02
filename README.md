# AI Sales Assistant Proof-of-Concept

This is a real-time AI sales assistant built for a shipping container company. It uses RAG (Retrieval-Augmented Generation) to ground AI responses in actual product documentation, pricing, and policies.

## Features
- **Real-time Chat**: Bidirectional communication via WebSockets with typing indicators.
- **RAG Pipeline**: Automated document ingestion, chunking, and vector search (using SentenceTransformers).
- **Admin Dashboard**: Manage and re-index document sources.
- **Intent-based Actions**: Automatically detects pricing queries or purchase intent for lead handoff.
- **Premium UI**: Modern, responsive Next.js interface with bespoke Vanilla CSS and Framer Motion animations.

## Tech Stack
- **Backend**: Django, Django Rest Framework, Django Channels (WebSockets)
- **Frontend**: Next.js 14, TypeScript, Framer Motion
- **AI/ML**: `sentence-transformers` for local embeddings, Numpy for cosine similarity.

## Getting Started

### Local Setup (Backend)
1. Navigate to `/backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Run migrations: `python manage.py migrate`
4. Seed sample docs: `python seed_docs.py`
5. Start server: `python manage.py runserver`

### Local Setup (Frontend)
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Visit `http://localhost:3000` for the chat and `http://localhost:3000/admin` for the dashboard.

## Tests
Run tests using pytest:
`pytest backend/tests/`
