from flask import Flask, request, jsonify
from models import User, db
import face_recognition_models
from flask_cors import CORS
import face_recognition
from flask_migrate import Migrate

import numpy as np

app = Flask(__name__)
app.config.from_object('config.Config')
CORS(app)
db.init_app(app)
migrate = Migrate(app, db)

print("hiiii")
import routes

if __name__ == '__main__':
    app.run(debug=True)