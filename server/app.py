from flask import request, session, make_response, jsonify
from flask_restful import Resource
from sqlalchemy import select

from config import app, db, api
from models import User, Student, Accommodation, Category, Comment

class Signup(Resource):
    def post(self):
        request_dict = request.get_json()
        existing_user = User.query.filter_by(username=request_dict['userName']).first()
        if existing_user:
            return {'message': 'Username already exists'}, 400
        else:
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
            existing_student_first = request_json['firstName'].title()
            existing_student_last = request_json['lastName'].title()
            existing_student_grade = int(request_json['grade'])
            existing_student = Student.query.filter_by(user_id=user_id, first_name=existing_student_first, last_name=existing_student_last, grade=existing_student_grade).first()
            if existing_student:
                return {'message': 'Student already exists'}, 400
            else:
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
class StudentById(Resource):

    def get(self, id):
        if session.get('user_id'):
            student = Student.query.filter_by(id=id).first()
            if student:
                response = make_response(student.to_dict(), 200)
                return response
            else:
                return {'message': 'Student not found'}, 404
        else:
            return {'message': 'Error, unauthorized user'}, 401
    
    def post(self, id):
        pass
    
    def patch(self, id):
        if session.get('user_id'):
            request_dict = request.get_json()
            student = Student.query.filter_by(id=id).first()
            if student:
                if 'firstName' in request_dict:
                    student.first_name = request_dict.get('firstName', student.first_name).title()
                if 'lastName' in request_dict:
                    student.last_name = request_dict.get('lastName', student.last_name).title()
                if 'grade' in request_dict:
                    student.grade = request_dict.get('grade', student.grade)
                db.session.commit()
                response = make_response(student.to_dict(), 200)
                return response
            else:
                return {"error": "Student not found"}, 404
        else:
            return {"error": "Unauthorized"}, 401

    def delete(self, id):
        if session.get('user_id'):
            student = Student.query.filter_by(id=id).first()
            db.session.delete(student)
            db.session.commit()
            response = {'message': 'Successfully deleted'}, 200
            return response
        else:
            return {'error': 'Unauthorized'}, 401

class Accommodations(Resource):
    def get(self):
        if session.get('user_id'):
            user_id = session['user_id']
            accommodations = Accommodation.query.filter_by(user_id=user_id).all()
            if accommodations:
                accommodation_list = [accommodation.to_dict() for accommodation in accommodations]
                response = make_response(accommodation_list, 200)
                return response
            else:
                return {'message': 'No accommodations found'}, 404
        else:
            return {'message': 'Error, unauthorized user'}, 401
    
    def post(self):
        if session.get('user_id'):
            user_id = session['user_id']
            request_json = request.get_json()
            print(request_json)
            new_accommodation = Accommodation(
                description=request_json['description'].title(),
                student_id=request_json['student_id'],
                category_id=request_json['category_id'],
                user_id=user_id)
            if new_accommodation:
                db.session.add(new_accommodation)
                db.session.commit()
                response = make_response(new_accommodation.to_dict(), 201)
                return response
            else:
                return {'message': 'Error: unable to create new accommodation'}, 404
        else:
            return {'message': 'Error, unauthorized user'}, 401

class AccommodationById(Resource):
    def patch(self, id):
        if session.get('user_id'):
            request_dict = request.get_json()
            accommodation = Accommodation.query.filter_by(id=id).first()
            if accommodation:
                if 'description' in request_dict:
                    accommodation.description = request_dict['description']
                db.session.commit()
                response = make_response(accommodation.to_dict(), 200)
                return response
            else:
                return {"error": "Accommodation not found"}, 404
        else:
            return {"error": "Unauthorized"}, 401
    
    def delete(self, id):
        if session.get('user_id'):
            accommodation = Accommodation.query.filter_by(id=id).first()
            if accommodation:
                db.session.delete(accommodation)
                db.session.commit()
                response = {'message': 'Successfully deleted'}, 200
                return response
            else:
                return {"error": "Accommodation not found"}, 404
        else:
            return {"error": "Unauthorized"}, 401
        
class Categories(Resource):
    def get(self):
        if session.get('user_id'):
            user_id = session['user_id']
            categories = Category.query.all()
            category_list = {'categories': [category.to_dict() for category in categories]}
            response = make_response(category_list, 200)
            return response
        else:
            return {'message': 'Error, unauthorized user'}, 401
    
    def post(self):
        if session.get('user_id'):
            user_id = session['user_id']
            request_json = request.get_json()
            new_category = Category(
                description=request_json['description'])
            if new_category:
                db.session.add(new_category)
                db.session.commit()
                response = make_response(new_category.to_dict(), 201)
                return response
            else:
                return {'message': 'Error: unable to create new category'}, 404
        else:
            return {'message': 'Error, unauthorized user'}, 401

class Comments(Resource):
    def post(self):
        if session.get('user_id'):
            user_id = session['user_id']
            request_json = request.get_json()
            accommodation_id = request_json['accommodation_id']
            print(accommodation_id)
            comment_text = request_json['comment_text']
            existing_comment = Comment.query.filter_by(accommodation_id=accommodation_id).first()
            if existing_comment:
                return {'message': 'Error: comment already exists for this accommodation'}, 400  # This should be a conflict response, not a 400 Bad Request. However, Flask's built-in JSON responses will automatically set the HTTP status code to 409. 409 Conflict is not suitable for this use case.
            else:
                new_comment = Comment(
                    description=comment_text,
                    accommodation_id=accommodation_id
                )
                if new_comment:
                    db.session.add(new_comment)
                    db.session.commit()
                    response = make_response(new_comment.to_dict(), 201)
                    return response
                else:
                    return {'message': 'Error: unable to create new comment'}, 404
        else:
            return {'message': 'Error, unauthorized user'}, 401

class CommentsById(Resource):
    def patch(self, id):
        if session.get('user_id'):
            request_dict = request.get_json()
            comment = Comment.query.filter_by(id=id).first()
            if comment:
                if 'comment_text' in request_dict:
                    comment.description = request_dict['comment_text']
                db.session.commit()
                response = make_response(comment.to_dict(), 200)
                return response
            else:
                return {"error": "Comment not found"}, 404
        else:
            return {"error": "Unauthorized"}, 401
    
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Login, '/', endpoint='')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Students, '/students', endpoint='students')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(StudentById, '/students/<int:id>', endpoint='students/<int:id>')
api.add_resource(Accommodations, '/accommodations', endpoint='accommodations')
api.add_resource(AccommodationById, '/accommodations/<int:id>', endpoint='accommodations/<int:id>')
api.add_resource(Categories, '/categories', endpoint='categories')
api.add_resource(Comments, '/comments', endpoint='comments')
api.add_resource(CommentsById, '/comments/<int:id>', endpoint='comments/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=False)