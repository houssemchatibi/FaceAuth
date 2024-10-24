from app import app
import base64
from io import BytesIO
from PIL import Image
import face_recognition
from flask import Flask, request, jsonify
from models import db, User 
import numpy as np



@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    face_image_b64 = data.get('faceImage')

    # Check if user already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    try:
        if face_image_b64.startswith("data:image/jpeg;base64,"):
            face_image = base64.b64decode(face_image_b64.split(',')[1])
        else:
            return jsonify({"error": "Invalid image format"}), 400
    except (IndexError, ValueError):
        return jsonify({"error": "Invalid base64 string"}), 400

    try:
        image = Image.open(BytesIO(face_image)).convert("RGB")
        print(f"Loaded image size: {image.size}, mode: {image.mode}")  # Debugging line

        image_np = np.array(image)
        print("Image array shape:", image_np.shape)  # Should be (height, width, 3)
        print("Image array dtype:", image_np.dtype)  # Should be uint8

        # Try face encodings with the RGB image
        face_encodings = face_recognition.face_encodings(image_np)

        print("Face encodings found:", len(face_encodings))  # Debugging line

        if len(face_encodings) == 0:
            return jsonify({"error": "No face detected"}), 400

        face_encoding = face_encodings[0]
        new_user = User(username=username, face_encoding=face_encoding.tobytes())
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Registration successful"}), 201
    except Exception as e:
        import traceback
        traceback.print_exc()  # Print the full error traceback
        return jsonify({"error": str(e)}), 500

        
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    username = data.get('username')
    face_image_b64 = data.get('faceImage')
    
    if not username or not face_image_b64:
        return jsonify({"error": "Missing username or face image"}), 400

    user = User.query.filter_by(username=username).first()
    if user:
        try:
            # Décode l'image de la requête
            if face_image_b64.startswith("data:image/jpeg;base64,"):
                face_image = base64.b64decode(face_image_b64.split(',')[1])
            else:
                return jsonify({"error": "Invalid image format"}), 400
        except (IndexError, ValueError):
            return jsonify({"error": "Invalid base64 string"}), 400

        # Convertir l'image en tableau NumPy
        image = Image.open(BytesIO(face_image)).convert("RGB")
        image_np = np.array(image)
        
        # Extraire l'encodage du visage à partir de l'image fournie
        face_encodings = face_recognition.face_encodings(image_np)
        if len(face_encodings) == 0:
            return jsonify({"error": "No face detected"}), 400
        face_encoding_user = face_encodings[0]

        # Comparer l'encodage de l'utilisateur stocké avec l'encodage du visage fourni
        stored_encoding = np.frombuffer(user.face_encoding)  # Assure-toi que `user.face_encoding` est au format correct
        matches = face_recognition.compare_faces([stored_encoding], face_encoding_user)
        
        if matches[0]:
            user_info = {
                "username": user.username,
            }
            return jsonify(user_info), 200
        return jsonify({"error": "Face not recognized"}), 401
    
    return jsonify({"error": "Username does not exist"}), 400
    