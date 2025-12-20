from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Enable CORS - allows frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific domain during production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini AI with your API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('models/gemini-2.5-flash')

# Define the structure of incoming requests
class ChatRequest(BaseModel):
    message: str
    conversation_history: list = []

# Root endpoint - health check
@app.get("/")
async def root():
    return {"message": "Chatbot API is running!"}

# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "healthy"}

# Main chat endpoint
@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Send user's message to Gemini API
        response = model.generate_content(request.message)
        
        # Return the AI's response
        return {
            "response": response.text,
            "status": "success"
        }
    except Exception as e:
        # Log error for debugging
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))