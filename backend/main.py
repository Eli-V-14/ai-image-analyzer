"""
AI Image Analyzer - Backend
"""

from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
import base64, os
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/analyze")
async def analyze_image(file: UploadFile, prompt: str = Form(...)):
    image_bytes = await file.read()

    # Pass raw bytes directly — no need to encode then decode
    image_part = types.Part.from_bytes(
        data=image_bytes,
        mime_type=file.content_type
    )

    response = client.models.generate_content(
        model="gemini-2.0-flash",  # free tier, fast, supports vision
        contents=[image_part, prompt]
    )

    print("RESPONSE:", response.text)  # visible in your uvicorn terminal for debugging

    return {"response": response.text.strip()}