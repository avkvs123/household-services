from flask_sqlalchemy import SQLAlchemy
from flask_security  import UserMixin, RoleMixin
from datetime import datetime

db = SQLAlchemy()


class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String, unique=False, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean(), default=False)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary = 'roles_users', backref=db.backref('users', lazy='dynamic')) # Backref is -> If you have object of role, you can get list of  users with this role

    customer = db.relationship('Customer', uselist=False, back_populates="user")  # One-to-One 
    professional = db.relationship('Professional', uselist=False, back_populates="user")  # One-to-One


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255))


class Customer(db.Model):
    id = db.Column(db.Integer,autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to User
    address = db.Column(db.String(255))
    phone = db.Column(db.String(15))
    user = db.relationship('User', back_populates="customer")


class Professional(db.Model):
    id = db.Column(db.Integer,autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to User
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)  # Foreign key to Service
    date_created = db.Column(db.Date,default=datetime.now(), nullable=False)
    address = db.Column(db.String(255))
    pincode = db.Column(db.Integer)
    experience = db.Column(db.Integer)

    user = db.relationship('User', back_populates="professional")
    service = db.relationship('Service', back_populates="professionals")  # Linking to Service
    
    

class Service(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    price = db.Column(db.Integer)
    time_required = db.Column(db.Integer)
    description = db.Column(db.String(255))

    
    professionals = db.relationship('Professional', back_populates="service", cascade="all, delete-orphan")


class ServiceRequest(db.Model):
    id = db.Column(db.Integer,autoincrement=True, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'))
    professional_id = db.Column(db.Integer, db.ForeignKey('professional.id'))
    date_of_request = db.Column(db.Date, default=datetime.now(), nullable=False)
    date_of_completion = db.Column(db.Date)
    service_status = db.Column(db.String(20), nullable=False, default="requested")  # requested/assigned/closed
    remarks = db.Column(db.String(255))

    service = db.relationship('Service')
    customer = db.relationship('Customer')
    professional = db.relationship('Professional')