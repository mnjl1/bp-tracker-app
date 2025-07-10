from flask import request, jsonify, g, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

from .models import db, User, BloodPressureReading

# Create a Blueprint
api = Blueprint('api', __name__)

# We need a way to get the app's secret key for the token
# We will get it from the app's config when the blueprint is registered
def get_secret_key():
    from flask import current_app
    return current_app.config['SECRET_KEY']

def token_required(f):
    """Decorator to protect routes that require authentication."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, get_secret_key(), algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            g.current_user = current_user
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(*args, **kwargs)
    return decorated


@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Could not create user. Missing data.'}), 400

    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User with this email already exists.'}), 409

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(email=email, password_hash=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'New user created!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Could not create user. Error: {str(e)}'}), 500

@api.route('/login', methods=['POST'])
def login():
    auth = request.get_json()
    if not auth or not auth.get('email') or not auth.get('password'):
        return jsonify({'message': 'Could not verify'}), 401

    user = User.query.filter_by(email=auth.get('email')).first()
    if not user:
        return jsonify({'message': 'User not found!'}), 401

    if check_password_hash(user.password_hash, auth.get('password')):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, get_secret_key(), algorithm="HS256")
        return jsonify({'token': token})

    return jsonify({'message': 'Could not verify. Wrong password!'}), 401

@api.route('/readings', methods=['POST'])
@token_required
def add_reading():
    data = request.get_json()
    if not data or 'systolic' not in data or 'diastolic' not in data or 'date' not in data:
         return jsonify({'message': 'Missing data for reading.'}), 400

    try:
        user = g.current_user
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

@api.route('/readings', methods=['GET'])
@token_required
def get_readings():
    user = g.current_user
    readings = BloodPressureReading.query.filter_by(user_id=user.id).order_by(BloodPressureReading.date.desc()).all()
    return jsonify([reading.to_dict() for reading in readings])

@api.route('/readings/<int:reading_id>', methods=['DELETE'])
@token_required
def delete_reading(reading_id):
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
