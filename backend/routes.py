from app import app, db
from flask import request, jsonify
from models import User



@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    face_image_b64 = data.get('faceImage')
 
    # Check if user already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400
    
    # Decode the base64 image
    face_image = base64.b64decode(face_image_b64.split(',')[1])
    image = Image.open(BytesIO(face_image))
    
    # Convert image to array and extract face encodings
    image_np = face_recognition.load_image_file(BytesIO(face_image))
    face_encodings = face_recognition.face_encodings(image_np)

    if len(face_encodings) == 0:
        return jsonify({"error": "No face detected"}), 400

    face_encoding = face_encodings[0]

    # Store the face encoding in the database
    new_user = User(username=username, face_encoding=face_encoding.tobytes())
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Registration successful"}), 201

