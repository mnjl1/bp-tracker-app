import pytest
import sys
import os

from app import create_app
from app.models import db
from config import TestingConfig

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

@pytest.fixture(scope='module')
def test_client():
    """
    Creates a test client for the application.
    This fixture sets up the app with a testing configuration and an in-memory database.
    It yields the client to the tests and then tears down the database context.
    """
    # Create a Flask app configured for testing
    flask_app = create_app(config_class=TestingConfig)

    # Create a test client using the Flask application configured for testing
    with flask_app.test_client() as testing_client:
        # Establish an application context
        with flask_app.app_context():
            db.create_all()
            yield testing_client  # this is where the testing happens!
            db.session.remove()
            db.drop_all()
