import os

# Find the absolute path of the directory containing this file
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your_super_secret_key_change_this')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'bptracker.db')