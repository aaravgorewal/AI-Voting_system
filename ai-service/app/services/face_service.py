import cv2
import face_recognition
import numpy as np
from app.core.config import Config

class FaceRecognitionService:
    @staticmethod
    def allowed_file(filename: str) -> bool:
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

    @staticmethod
    def load_image_from_bytes(file_bytes) -> np.ndarray:
        """
        Convert raw bytes to an OpenCV image and then to RGB (which face_recognition expects)
        """
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Could not decode image.")
        # Convert BGR (OpenCV) to RGB (face_recognition)
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        return rgb_img

    @staticmethod
    def get_face_encoding(rgb_img: np.ndarray):
        """
        Extract the face encoding from an image.
        Returns the first face encoding found.
        """
        face_locations = face_recognition.face_locations(rgb_img)
        if not face_locations:
            raise ValueError("No face detected in the image.")
        
        if len(face_locations) > 1:
            raise ValueError("Multiple faces detected. Please ensure only one face is in the image.")

        face_encodings = face_recognition.face_encodings(rgb_img, face_locations)
        return face_encodings[0]

    @staticmethod
    def compare_faces(known_encoding, unknown_encoding) -> dict:
        """
        Compare two encodings and return match status and confidence percentage.
        """
        # Get face distance (lower means more similar)
        face_distances = face_recognition.face_distance([known_encoding], unknown_encoding)
        distance = face_distances[0]
        
        # Compare based on tolerance
        match = bool(distance <= Config.TOLERANCE)
        
        # Calculate percentage (simple linear mapping for visualization)
        # Assuming distance 0 = 100%, distance 1 = 0%
        percentage = max(0.0, min(100.0, (1.0 - distance) * 100.0))
        
        return {
            "match": match,
            "confidence_percentage": round(percentage, 2),
            "distance": round(distance, 4)
        }
