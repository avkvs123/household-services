from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String, unique=False, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean(), default=False)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    role_id = db.Column(db.String, db.ForeignKey('role.id'))
    role = db.relationship('Role', backref='users') # Backref is -> If you have object of role, you can get list of  users with this role
    
    customer = db.relationship('Customer', uselist=False, back_populates="user")  # One-to-One 
    professional = db.relationship('Professional', uselist=False, back_populates="user")  # One-to-One


class Customer(db.Model):
    id = db.Column(db.Integer,autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to User
    address = db.Column(db.String(255))
    phone = db.Column(db.String(15))

    user = db.relationship('User', back_populates="customer")


class Professional(db.Model):
    id = db.Column(db.Integer,autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to User
    date_created = db.Column(db.Date, nullable=False)
    description = db.Column(db.String(255))
    service_type = db.Column(db.String(255))
    experience = db.Column(db.Integer)
    is_approved = db.Column(db.Boolean(), default=False)

    user = db.relationship('User', back_populates="professional")


class Role(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255))


class Service(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    price = db.Column(db.Integer)
    time_required = db.Column(db.Integer)
    description = db.Column(db.String(255))


class ServiceRequest(db.Model):
    id = db.Column(db.Integer,autoincrement=True, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'))
    professional_id = db.Column(db.Integer, db.ForeignKey('professional.id'))
    date_of_request = db.Column(db.Date, nullable=False)
    date_of_completion = db.Column(db.Date)
    service_status = db.Column(db.String(20), nullable=False, default="requested")  # requested/assigned/closed
    remarks = db.Column(db.String(255))

    service = db.relationship('Service')
    customer = db.relationship('Customer')
    professional = db.relationship('Professional')