# AI-Image-Analyzer
This project explores the simple ideology of frontend and backend development by developing a web application tool that uses Google's Gemini-Flash-Latest model. The application provides descriptive feedback of an image uploaded with a text box to allow users to ask information about the image. The project also develops my skills in using APIs to devleop launchable applications through my localhost, which can be further developed into a mobile phone application or more. 


# Python Libraries
- **fastapi** : used to create the API and handle file uploads
    - 'pip install fastapi'
- **google** : used to interact with the Gemini API
    - 'pip install google-genai'
- **base64** : used to encode image data for sending to the Gemini API
    - built-in Python library, no installation needed
- **os** : used to access environment variables for API keys
    - built-in Python library, no installation needed
- **dotenv** : used to load API keys from a .env file
    - 'pip install python-dotenv'
- **requests** : used in test.py to send HTTP requests to the API
    - 'pip install requests'

# Extensions
- N/A


# Terminal 1: Running the Backend
- **cd backend** : changing directory to backend folder
- **venv\Scripts\activate** : running the environment
- **uvicorn main:app --reload** : running the main file that maintains the model

# Terminal 2: Running the Frontend
- **cd frontend** : changing directory to frontend folder
- **npm run dev** : running the development environment for 