import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

print("\n=== AVAILABLE GEMINI MODELS ===\n")

for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(f"Model Name: {model.name}")
        print(f"  Display Name: {model.display_name}")
        print(f"  Description: {model.description}")
        print(f"  Supported Methods: {model.supported_generation_methods}")
        print("-" * 50)

print("\n================================\n")