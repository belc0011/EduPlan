# EduPlan 504 Organizer

## About the Project

See the README file in the Client directory for a full demo and description of the project.

## Built with
* Flask
* Flask-Migrate
* Flask-CORS
* SQLAlchemy
* Alembic
* Gunicorn
* Psycopg2

## Local Installation

If you would like to install the project locally, follow the instructions below.

### Installation (back-end):

** These instructions assume you have already followed the front-end installation instructions. If not, please find the README file in the Client directory and follow those instructions first. **

1. Navigate to the Server directory

2. Set up a virtual environment:
    `python -m venv venv   # Create a virtual environment`
    `source venv/bin/activate  # Activate on macOS/Linux`
# OR
    `venv\Scripts\activate  # Activate on Windows`

3. Install dependencies
    `pip install -r requirements.txt`

4. Set up environment variables
    `touch .env  # Create a .env file`

5. Add environment variables to .env file
    `DATABASE_URL=sqlite:///app.db  # Example for SQLite`
    `SECRET_KEY=your_secret_key`

6. Run database migrations
    `flask db upgrade`

7. Update the entry point in app.py to run the application locally
    ```if __name__ == '__main__':
        app.run(debug=True, port=5555)

8. Update the Flask instance configuration (found in config.py) to point to the local static and template directories suitable for development

9. Start the flask server
    `python app.py`

## License

This project is proprietary and not licensed for public use, distribution, or modification. Unauthorized use, copying, or distribution of the code and associated content is prohibited.




