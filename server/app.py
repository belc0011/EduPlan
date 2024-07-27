from flask import request, session, make_response, jsonify
from flask_restful import Resource
from sqlalchemy import select

from config import app, db, api
from models import User, Student, Accommodation, Classes

class Signup(Resource):
    def post(self):
        request_dict = request.get_json()
        new_user = User(
                first_name=request_dict['firstName'].title(),
                last_name=request_dict['lastName'].title(),
                username=request_dict['userName'])
        new_user.password_hash = request_dict['password']
        
        db.session.add(new_user)
        db.session.commit()
        new_user_dict = new_user.to_dict()
        session['user_id'] = new_user.id
        response = make_response(new_user_dict, 201)
        return response