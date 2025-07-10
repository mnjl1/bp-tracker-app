# app.py
# Main Flask application file

from flask import Flask, request, jsonify, g
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
import os

# --- App Initialization ---
app = Flask(__name__)
CORS(app) # Enable Cross-Origin Resource Sharing

# --- Configuration ---
# Use an absolute path for the database file to avoid issues with the working directory.
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'bptracker.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_super_secret_key_change_this' # Change this in production!

# --- Database Setup ---
db = SQLAlchemy(app)

# --- Database Models ---
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


# --- Authentication Decorator ---
def token_required(f):
    """Decorator to protect routes that require authentication."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check for token in the 'x-access-token' header
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            # Decode the token
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            # Pass the user object to the route
            g.current_user = current_user
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(*args, **kwargs)
    return decorated

# --- API Routes ---

@app.route('/register', methods=['POST'])
def register():
    """Handles user registration."""
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Could not create user. Missing data.'}), 400

    email = data.get('email')
    password = data.get('password')

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User with this email already exists.'}), 409

    # Hash the password and create a new user
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(email=email, password_hash=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'New user created!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Could not create user. Error: {str(e)}'}), 500


@app.route('/login', methods=['POST'])
def login():
    """Handles user login and token generation."""
    auth = request.get_json()

    if not auth or not auth.get('email') or not auth.get('password'):
        return jsonify({'message': 'Could not verify'}), 401, {'WWW-Authenticate': 'Basic realm="Login required!"'}

    user = User.query.filter_by(email=auth.get('email')).first()

    if not user:
        return jsonify({'message': 'User not found!'}), 401

    if check_password_hash(user.password_hash, auth.get('password')):
        # Generate JWT token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")

        return jsonify({'token': token})

    return jsonify({'message': 'Could not verify. Wrong password!'}), 401


@app.route('/readings', methods=['POST'])
@token_required
def add_reading():
    """Adds a new blood pressure reading for the authenticated user."""
    data = request.get_json()
    if not data or 'systolic' not in data or 'diastolic' not in data or 'date' not in data:
         return jsonify({'message': 'Missing data for reading.'}), 400

    try:
        # The g object is available in the request context
        user = g.current_user

        # Parse date string from format 'YYYY-MM-DD'
        reading_date = datetime.datetime.strptime(data['date'], '%Y-%m-%d')

        new_reading = BloodPressureReading(
            systolic=int(data['systolic']),
            diastolic=int(data['diastolic']),
            date=reading_date,
            user_id=user.id
        )
        db.session.add(new_reading)
        db.session.commit()
        return jsonify({'message': 'New reading added!', 'reading': new_reading.to_dict()}), 201
    except (ValueError, TypeError):
        return jsonify({'message': 'Invalid data format.'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Could not add reading. Error: {str(e)}'}), 500


@app.route('/readings', methods=['GET'])
@token_required
def get_readings():
    """Gets all blood pressure readings for the authenticated user."""
    user = g.current_user
    readings = BloodPressureReading.query.filter_by(user_id=user.id).order_by(BloodPressureReading.date.desc()).all()
    return jsonify([reading.to_dict() for reading in readings])


@app.route('/readings/<int:reading_id>', methods=['DELETE'])
@token_required
def delete_reading(reading_id):
    """Deletes a specific blood pressure reading."""
    user = g.current_user
    reading = BloodPressureReading.query.filter_by(id=reading_id, user_id=user.id).first()

    if not reading:
        return jsonify({'message': 'No reading found or unauthorized!'}), 404

    try:
        db.session.delete(reading)
        db.session.commit()
        return jsonify({'message': 'Reading has been deleted!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Could not delete reading. Error: {str(e)}'}), 500

# --- Main Execution ---
if __name__ == '__main__':
    # Create the database and tables if they don't exist
    with app.app_context():
        db.create_all()
    # Run the app
    app.run(debug=True, port=5001) # Running on a different port to avoid conflict with React dev server
