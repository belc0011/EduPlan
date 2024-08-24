from sqlalchemy_serializer import SerializerMixin
from config import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property

class Student(db.Model, SerializerMixin):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    grade = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='students')
    accommodations = db.relationship('Accommodation', back_populates='student')

    serialize_rules = ('-accommodations.student', '-user.students')


class Accommodation(db.Model, SerializerMixin):
    __tablename__ = "accommodations"

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    comment = db.relationship('Comment', back_populates='accommodation')##add cascade=all and delete
    student = db.relationship('Student', back_populates='accommodations')
    category = db.relationship('Category', back_populates='accommodations')

    serialize_rules = ('-student.accommodations', '-category.accommodations', '-user.accommodations', '-comment.accommodations')

class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    username = db.Column(db.String)
    _password_hash = db.Column(db.String)

    students = db.relationship('Student', back_populates='user')
    
    serialize_rules = ('-students.user', '-accommodations.user')

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hash is not a readable attribute.")

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')
    
    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

class Category(db.Model, SerializerMixin):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String)

    accommodations = db.relationship("Accommodation", back_populates="category")

    serialize_rules = ('-accommodations.category',)

class Comment(db.Model, SerializerMixin):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String)
    accommodation_id = db.Column(db.Integer, db.ForeignKey("accommodations.id"))

    accommodation = db.relationship("Accommodation", back_populates="comment")

    serialize_rules = ('-accommodation.comment',)
