from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    face_encoding = db.Column(db.LargeBinary, nullable=False)  # Store face encoding as a blob

    def __repr__(self):
        return f'<User {self.username}>'