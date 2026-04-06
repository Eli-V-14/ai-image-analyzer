"""
AI Image Captioner - Backend
Dependencies: pip install fastapi uvicorn google-genai python-multipart python-dotenv
"""

from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from google import genai
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

# Defining different prompts to the model
STYLE_PROMPTS = {
    "descriptive": "Write a clear, detailed caption describing this image.",
    "poetic":      "Write a poetic, lyrical caption for this image.",
    "funny":       "Write a witty and funny caption for this image.",
    "seo":         "Write an SEO-friendly alt-text caption with relevant keywords.",
    "minimal":     "Write a minimal caption under 10 words.",
}

# API endpoint to handle image captioning requests
@app.post("/caption")
async def caption_image(file: UploadFile, style: str = Form("descriptive")):
    image_data = base64.b64encode(await file.read()).decode("utf-8")
    prompt = STYLE_PROMPTS.get(style, STYLE_PROMPTS["descriptive"])
    image_part = types.Part.from_bytes(data=base64.b64decode(image_data), mime_type=file.content_type)
    response = client.models.generate_content(model="gemini-flash-latest", contents=[image_part, prompt + " Reply with only the caption."])
    
    return {"caption": response.text.strip()}