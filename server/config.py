from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate, upgrade
from flask_session import Session
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, create_engine, inspect
from flask_bcrypt import Bcrypt
import os
from datetime import timedelta
from dotenv import load_dotenv
import sqlalchemy as sa

load_dotenv()

app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build'
)

app.json.compact = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URI']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
app.config['SESSION_TYPE'] = 'filesystem'  
app.config['SESSION_COOKIE_SECURE'] = False 
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

app.secret_key = os.environ.get('SECRET_KEY')

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app, supports_credentials=True, origins=["https://eduplan.onrender.com"], send_wildcard=True)

bcrypt = Bcrypt(app)

engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
inspector = inspect(engine)

# Only initialize DB if the users table doesn't exist
if not inspector.has_table('users'):
    with app.app_context():
        
        upgrade()
        app.logger.info('Database migration applied!')
else:
    app.logger.info('Database already initialized.')