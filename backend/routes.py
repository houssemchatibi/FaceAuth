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

        
# @app.route('/api/register', methods=['GET'])
# def test_register():
#     return jsonify({"message": "GET request to /api/register is working"})


# @app.route('/api/test_face', methods=['GET'])
# def test_face():
#     try:
#         # Load and convert the image to RGB
#         image_path = 'pngtree.png'  # Replace with your image path
#         image = Image.open(image_path)
        
#         # Check and convert the image mode
#         print(f"Original image mode: {image.mode}")  # Debugging
        
#         if image.mode != 'RGB':
#             image = image.convert('RGB')  # Force convert to RGB
#             print(f"Converted image mode: {image.mode}")  # Debugging
        
#         # Resize to a more standard size for testing (optional)
#         image = image.resize((640, 480))  # Resize to a standard size for testing
#         print(f"Resized image size: {image.size}")  # Debugging
        
#         # Convert the image to a NumPy array
#         image_np = np.array(image)
#         print("Image array shape:", image_np.shape)  # Should be (height, width, 3)
#         print("Image array dtype:", image_np.dtype)  # Should be uint8
        
#         # Ensure the image array is of type uint8
#         if image_np.dtype != np.uint8:
#             image_np = image_np.astype(np.uint8)
        
#         # Re-save the image to ensure proper format
#         image.save('resaved_image.jpg', format='JPEG')  # Save as a clean RGB JPEG
#         image = Image.open('resaved_image.jpg')  # Re-load the image
#         print(f"Resaved image mode: {image.mode}")  # Ensure it's RGB
        
#         # Convert the re-saved image to a NumPy array
#         image_np = np.array(image)
        
#         # Detect face locations first (before encoding)
#         face_locations = face_recognition.face_locations(image_np)
#         print(f"Face locations: {face_locations}")
        
#         if len(face_locations) == 0:
#             return jsonify({"error": "No face detected in the image"}), 400
        
#         # Now, extract face encodings
#         face_encodings = face_recognition.face_encodings(image_np, known_face_locations=face_locations)
#         print("Face encodings found:", len(face_encodings))
        
#         if len(face_encodings) == 0:
#             return jsonify({"error": "No face encodings found"}), 400
        
#         # Return the first face encoding as a list
#         face_encoding = face_encodings[0].tolist()  # Convert to list for JSON serialization
#         return jsonify({"face_encoding": face_encoding}), 200

#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500

