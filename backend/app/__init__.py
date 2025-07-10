from flask import Flask
from flask_cors import CORS
from config import DevelopmentConfig
from .models import db

def create_app(config_class=DevelopmentConfig):
    """
    Creates and configures an instance of the Flask application.
    """
    app = Flask(__name__)

    # Load configuration from the config object
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    CORS(app)

    # Import and register blueprints
    from .routes import api as api_blueprint
    app.register_blueprint(api_blueprint)

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    return app