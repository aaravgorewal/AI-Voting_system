from flask import Blueprint, request, jsonify
from app.services.face_service import FaceRecognitionService
import json
import numpy as np

api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "service": "Voting AI Face Recognition"}), 200

@api_bp.route('/verify-face', methods=['POST'])
def verify_face():
    """
    Endpoint to compare an uploaded live image with a stored face encoding.
    Expected form-data:
      - 'image': the live image file
      - 'stored_encoding': JSON string of the stored face encoding (list of floats)
    """
    if 'image' not in request.files:
        return jsonify({"success": False, "error": "No image part in the request"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400
        
    stored_encoding_str = request.form.get('stored_encoding')
    if not stored_encoding_str:
        return jsonify({"success": False, "error": "Missing stored_encoding parameter"}), 400
        
    if not FaceRecognitionService.allowed_file(file.filename):
        return jsonify({"success": False, "error": "File type not allowed"}), 400

    try:
        # Parse the stored encoding
        stored_encoding_list = json.loads(stored_encoding_str)
        if not isinstance(stored_encoding_list, list) or len(stored_encoding_list) != 128:
            raise ValueError("Invalid stored encoding format. Expected list of 128 floats.")
        
        known_encoding = np.array(stored_encoding_list)

        # Process the live image
        file_bytes = file.read()
        rgb_img = FaceRecognitionService.load_image_from_bytes(file_bytes)
        
        # Get live encoding
        unknown_encoding = FaceRecognitionService.get_face_encoding(rgb_img)
        
        # Compare
        result = FaceRecognitionService.compare_faces(known_encoding, unknown_encoding)
        
        return jsonify({
            "success": True,
            "data": result
        }), 200

    except ValueError as ve:
        return jsonify({"success": False, "error": str(ve)}), 400
    except Exception as e:
        return jsonify({"success": False, "error": "An internal error occurred during verification"}), 500


@api_bp.route('/extract-encoding', methods=['POST'])
def extract_encoding():
    """
    Endpoint to extract face encoding from an image (used during registration).
    Expected form-data:
      - 'image': the image file
    """
    if 'image' not in request.files:
        return jsonify({"success": False, "error": "No image part in the request"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400
        
    if not FaceRecognitionService.allowed_file(file.filename):
        return jsonify({"success": False, "error": "File type not allowed"}), 400

    try:
        file_bytes = file.read()
        rgb_img = FaceRecognitionService.load_image_from_bytes(file_bytes)
        encoding = FaceRecognitionService.get_face_encoding(rgb_img)
        
        return jsonify({
            "success": True,
            "data": {
                "encoding": encoding.tolist()
            }
        }), 200

    except ValueError as ve:
        return jsonify({"success": False, "error": str(ve)}), 400
    except Exception as e:
        return jsonify({"success": False, "error": "An internal error occurred during extraction"}), 500
