# AI Chatbot with RAG

A conversational AI chatbot built with FastAPI and Google Gemini, featuring conversation memory and custom text chunking algorithms for document processing.

![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🤖 **Conversational AI** powered by Google Gemini 1.5 Flash
- 💬 **Conversation Memory** maintains context across messages
- 🎨 **Clean UI** with responsive design
- ✂️ **Custom Chunking** - 4 text splitting strategies (fixed-size, sentence-based, semantic, recursive)
- ⚡ **FastAPI Backend** with async support
- 🔒 **Secure** environment-based configuration

## Quick Start

### Prerequisites
- Python 3.8+
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation
```bash
# Clone repo
git clone https://github.com/Jayaprakash20/AI-Chatbot.git
cd AI-Chatbot

# Setup backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file with your API key
echo "GEMINI_API_KEY=your_key_here" > .env

# Run backend
uvicorn app:app --reload
```
```bash
# Run frontend (new terminal)
cd frontend
python -m http.server 3000
```

Open browser: http://localhost:3000

## Project Structure
```
AI-Chatbot/
├── backend/
│   ├── app.py              # FastAPI application
│   ├── chunking.py         # Text chunking algorithms
│   └── requirements.txt    # Dependencies
└── frontend/
    ├── index.html          # Chat interface
    ├── app.js             # Frontend logic
    └── style.css          # Styling
```

## Tech Stack

**Backend:** FastAPI, Google Gemini API, Uvicorn  
**Frontend:** HTML, CSS, JavaScript  
**Upcoming:** FAISS, Sentence-Transformers, RAG

## Usage

**Test conversation memory:**
```
You: "My name is Jay"
Bot: "Nice to meet you, Jay!"

You: "What's my name?"
Bot: "Your name is Jay"
```

**Test chunking:**
```bash
cd backend
python test_chunking.py
```

## API Endpoints

- `POST /chat` - Send message to chatbot
- `GET /health` - Health check
- Interactive docs: http://localhost:8000/docs

## Roadmap

- [x] Basic chatbot with Gemini API
- [x] Conversation memory
- [x] Custom chunking algorithms
- [ ] RAG with FAISS vector database
- [ ] Document upload (PDF, CSV)
- [ ] Semantic search
- [ ] Cloud deployment

## Technical Decisions

- **FastAPI**: Async support, auto-docs, type validation
- **Gemini 1.5 Flash**: Fast, 1M token context, generous free tier
- **Vanilla JS**: Lightweight, no build step
- **FAISS**: Free vector search for RAG (planned)

## Contributing

Pull requests welcome! Fork the repo, create a feature branch, and submit a PR.

## License

MIT License - see [LICENSE](LICENSE) file

## Author

**Jayaprakash** - [@Jayaprakash20](https://github.com/Jayaprakash20)

---

* Prototype demonstrating AI chatbot development.*
