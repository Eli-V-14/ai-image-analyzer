# importing necessary libraries and modules for backend development

from fastapi import FastAPI, UploadFile, Form # pip install fastapi
# FastAPI - framework that creates APIs
# UploadFile - class for handling file uploads
# Form - class for handling form data

from fastapi.middleware.cors import CORSMiddleware
# CORS (Cross-Origin Resource Sharing) middleware to allow cross-origin requests from the frontend

from google import genai
from google.genai import types # pip install google-generativeai
# Google Generative AI library for interacting with Google's generative AI models

import base64, os
# base64 - library for encoding and decoding data in base64 format
# os - library for interacting with the operating system, used here to access environment variables

from dotenv import load_dotenv # pip install python-dotenv
# Load environment variables from a .env file


# Loading API key
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Inititialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"]
)

STYLE_PROMPTS = {
    "descriptive": "Write a clear, detailed caption describing this image.",
    "poetic":      "Write a poetic, lyrical caption for this image.",
    "funny":       "Write a witty and funny caption for this image.",
    "seo":         "Write an SEO-friendly alt-text caption with relevant keywords.",
    "minimal":     "Write a minimal caption under 10 words.",
}

@app.post("/caption")
async def caption_image(file: UploadFile, style: str = Form("descriptive")):
    image_data = base64.b64encode(await file.read()).decode("utf-8")
    prompt = STYLE_PROMPTS.get(style, STYLE_PROMPTS["descriptive"])

    image_part = types.Part.from_bytes(data=base64.b64decode(image_data), mime_type=file.content_type)
    response = client.models.generate_content(model="gemini-flash-latest", contents=[image_part, prompt + " Reply with only the caption."])

    return {"caption": response.text.strip()}