"""
AI Image Analyzer - Backend
"""

from fastapi import FastAPI, UploadFile, Form 
from fastapi.middleware.cors import CORSMiddleware
from google import genai # google - used for genai.Client and genai.types.Part
from google.genai import types
import base64, os
from dotenv import load_dotenv

# Load API key from .env and initialize clients
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
app = FastAPI()

# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# API endpoint to handle image captioning requests
@app.post("/caption")
async def caption_image(file: UploadFile, prompt: str = Form(...)):
    image_data = base64.b64encode(await file.read()).decode("utf-8")

    image_part = types.Part.from_bytes(
        data=base64.b64decode(image_data), 
        mime_type=file.content_type
    )

    response = client.models.generate_content(
        model="gemini-flash-latest", 
        contents=[
            image_part, 
            prompt + " Reply with only the answer."
        ]
    )
    
    return {"caption": response.text.strip()}