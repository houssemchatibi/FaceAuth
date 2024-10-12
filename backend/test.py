from PIL import Image
import face_recognition
import numpy as np

# Étape 1 : Charger l'image
try:
    image_path = 'cWMWwUYg.jpg'  # Replace with your image path
    image = Image.open(image_path)
    print(f"Original image mode: {image.mode}")
except Exception as e:
    print(f"Error loading image: {e}")

# Étape 2 : Convertir l'image en RGB
try:
    image_rgb = image.convert("RGB")
    print(f"Converted image mode: {image_rgb.mode}")
except Exception as e:
    print(f"Error converting image to RGB: {e}")

# Étape 3 : Convertir l'image en NumPy array
try:
    image_np = np.array(image_rgb)
    print(f"Image array shape: {image_np.shape}, dtype: {image_np.dtype}")
    
    # Vérifier le type de données
    if image_np.dtype != np.uint8:
        print(f"Converting image array to uint8...")
        image_np = image_np.astype(np.uint8)
    print(f"Image array dtype after conversion: {image_np.dtype}")

    # Vérifiez que l'image est bien 3 canaux (RGB)
    if image_np.ndim != 3 or image_np.shape[2] != 3:
        raise ValueError("Image must be in RGB format with 3 channels.")
except Exception as e:
    print(f"Error converting image to NumPy array: {e}")

# Étape 4 : Détection des visages avec face_recognition
try:
    print("Attempting face detection...")
    face_locations = face_recognition.face_locations(image_np)
    print(f"Face locations found: {len(face_locations)}")
    
    if len(face_locations) == 0:
        print("No faces detected.")
except Exception as e:
    print(f"Error during face detection: {e}")

# Étape 5 : Obtenir les encodages faciaux (si un visage est détecté)
try:
    face_encodings = face_recognition.face_encodings(image_np)
    print(f"Number of face encodings: {len(face_encodings)}")
except Exception as e:
    print(f"Error during face encoding: {e}")



