from flask_sqlalchemy import SQLAlchemy
import datetime

# We will create the db instance in __init__.py
db = SQLAlchemy()

class User(db.Model):
    """User model for storing user details."""
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    readings = db.relationship('BloodPressureReading', backref='user', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<User {self.email}>'

class BloodPressureReading(db.Model):
    """BloodPressureReading model for storing readings."""
    id = db.Column(db.Integer, primary_key=True)
    systolic = db.Column(db.Integer, nullable=False)
    diastolic = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        """Converts the reading object to a dictionary."""
        return {
            'id': self.id,
            'systolic': self.systolic,
            'diastolic': self.diastolic,
            'date': self.date.isoformat()
        }

    def __repr__(self):
        return f'<Reading {self.id} for User {self.user_id}>'
