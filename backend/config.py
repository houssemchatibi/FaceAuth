import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:houssem123@localhost/faceRecognition')
    SQLALCHEMY_TRACK_MODIFICATIONS = False