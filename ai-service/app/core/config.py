import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-ai-key")
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB limit for uploads
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
    TOLERANCE = float(os.getenv("FACE_MATCH_TOLERANCE", "0.5"))  # Lower is stricter (default is usually 0.6)
