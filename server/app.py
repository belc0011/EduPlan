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

class Login(Resource):
    def post(self):
        request_dict = request.get_json()
        user = User.query.filter_by(username=request_dict['userName']).first()
        if user and user.authenticate(request_dict['password']):
            user_dict = user.to_dict()
            session['user_id'] = user.id
            response = make_response(user_dict, 200)
            return response
        else:
            return {'message': 'Incorrect username or password'}, 401

class CheckSession(Resource):
    def get(self):
        if session.get('user_id'):
            user = User.query.filter_by(id=session.get('user_id')).first()
            response = make_response(user.to_dict(), 200)
            return response
        else:
            return {'message': 'Error, unauthorized user'}, 401
   
class Logout(Resource):
    def delete(self):
        session.get('user_id')
        session['user_id'] = None
        return {}, 204

class Students(Resource):
    def get(self):
        if session.get('user_id'):
            user_id = session['user_id']
            students = Student.query.filter_by(user_id=user_id).all()
            if students:
                student_list = []
                for student in students:
                    student_found = student.to_dict()
                    student_list.append(student_found)
                response = make_response(student_list, 200)
                return response
            else:
                return {'message': 'No students found'}, 404
        else:
            return {'message': 'Unauthorized user'}, 401
    def post(self):
        request_json = request.get_json()
        if session.get('user_id'):
            user_id = session.get('user_id')
            new_student = Student(
                first_name=request_json['firstName'].title(),
                last_name=request_json['lastName'].title(),
                grade=request_json['grade'],
                user_id=user_id
            )
            if new_student:
                db.session.add(new_student)
                db.session.commit()
                new_student_dict = new_student.to_dict()
                response = make_response(new_student_dict, 201)
                return response
            else:
                return {'message': 'Error: unable to create new student'}, 404
        else:
            return 401