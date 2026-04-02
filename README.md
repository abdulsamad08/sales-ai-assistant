# 🚢 AI Sales Assistant (MEMOX AI)

A premium, RAG-powered sales assistant for shipping container companies. Built with **Django (Backend)** and **Next.js (Frontend)**, integrated with **Google Gemini 1.5 Flash**.

## 🚀 Quick Start

### 1. Backend Setup (Django)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

#### Environment Variables
Create a `.env` in the `backend/` folder (use `.env.example` as a template):
```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-1.5-flash
LLM_BACKEND=gemini
```

#### Run Database Migrations & Seed Data
```bash
python manage.py makemigrations documents ai
python manage.py migrate
python seed_docs.py  # Seeds the RAG documentation
```

#### Start Backend Server
```bash
python manage.py runserver 8000
```
*The backend uses Daphne for ASGI/WebSocket support.*

### 2. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🛠 Features
- **RAG-Powered Chat**: Natural responses using your company's own document context.
- **Real-time WebSockets**: Instant message delivery via Django Channels.
- **Admin Dashboard**: Categorize leads and manage documents at `http://localhost:3000/admin`.
- **Sleek UX**: Minimalist industrial design with smooth mouse-following spotlight and parallax animations.

## 📦 Tech Stack
- **AI**: Google Gemini 2.5 Flash, Sentence-Transformers (Local Embeddings).
- **Backend**: Django 5.0, Channels, Daphne, DRF.
- **Frontend**: Next.js 14, Framer Motion, Lucide React, Tailwind CSS (optional fallback).

---
*Built as a professional Proof of Concept for elite container logistics.*
