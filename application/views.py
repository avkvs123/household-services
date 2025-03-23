from flask import current_app as app, jsonify, request, render_template
from flask_security import auth_required, roles_required
from .models import Service, db, User, Professional, Customer
from .datastore import datastore
from werkzeug.security import check_password_hash, generate_password_hash 
import datetime


@app.get('/')
def home():
    return render_template("base.html")


@app.get('/admin')
@auth_required('token')
@roles_required("admin")
def admin():
    return "Welcome Admin"



@app.get('/activate_professional/<int:prof_id>')
@auth_required('token')
@roles_required("admin")
def activate_professional(prof_id):
    prof = User.query.get(prof_id)
    if not prof:
        return jsonify({"message":"Professional not found"}), 404
    if  "professional" not in prof.roles:
        return jsonify({"message":"USer is not Professional"}), 404
    prof.active = True  # Set active attribute to True
    db.session.commit()  # Commit the change to the database
    return jsonify({"message": "Professional activated successfully"}), 200

@app.get('/deactivate_professional/<int:prof_id>')
@auth_required('token')
@roles_required("admin")
def deactivate_professional(prof_id):
    prof = User.query.get(prof_id)
    if not prof:
        return jsonify({"message":"Professional not found"}), 404
    if  "professional" not in prof.roles:
        return jsonify({"message":"USer is not Professional"}), 404
    prof.active = False  # Set active attribute to True
    db.session.commit()  # Commit the change to the database
    return jsonify({"message": "Professional deactivated successfully"}), 200


@app.post("/user-login")
def user_login():
    login_data = request.get_json()
    email = login_data.get('email')
    if not email:
        return jsonify({"message":"email not provided"}), 400
    
    user = datastore.find_user(email=email)
    
    if not user:
        return jsonify({"message":"User not found"}), 404


    password = login_data.get('password')


    if check_password_hash(user.password, password):
        '''
        If you don't want to send cookie then it is used. 
        Otherwise the /login api will provide 
        cookie, authentication token and CSRF token.
        '''
        return jsonify({"token": user.get_auth_token(), "email":user.email, "role":user.roles[0].name})
    else:
        return jsonify({"message": "Password not matched"}), 400
    

@app.route("/register-professional", methods=["POST"])
def register_professional():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('full_name')

    user = datastore.find_user(email=email)
    
    if user:
        return jsonify({"message": "Email already exists"}), 400

        
    datastore.create_user(username= username, email=email, password=generate_password_hash(password), roles=["professional"], active = False)
    user = datastore.find_user(email=email)

    service_name= data.get('service_name')


    service = Service.query.filter_by(name=service_name).first()

    # Create Professional Entry
    new_professional = Professional(
        user_id=user.id,
        service_id = service.id,
        address=data.get('address'),
        pincode=data.get('pincode'),
        experience=data.get('experience')
    )

    db.session.add(new_professional)
    db.session.commit()

    return jsonify({"message": "Professional registered successfully!"}), 200




@app.route("/register-customer", methods=["POST"])
def register_customer():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('full_name')

    user = datastore.find_user(email=email)
    
    if user:
        return jsonify({"message": "Email already exists"}), 400

        
    datastore.create_user(username= username, email=email, password=generate_password_hash(password), roles=["customer"], active = True)
    user = datastore.find_user(email=email)


    new_customer = Customer(
        user_id=user.id,
        address=data.get('address'),
        phone=data.get('phone'),
    )

    db.session.add(new_customer)
    db.session.commit()

    return jsonify({"message": "Customer registered successfully!"}), 200



@app.route('/professionals', methods=['GET'])
@auth_required('token')
@roles_required("admin")
def get_professionals():
    professionals = db.session.query(
        Professional.id,
        Professional.date_created,
        Professional.address,
        Professional.pincode,
        Professional.experience,
        Service.name.label('service_name'),  # Fetch Service name
        User.username.label('professional_name'),  # Fetch Professional's Name from User table
        User.active.label('active')
    ).join(User, User.id == Professional.user_id) \
     .join(Service, Service.id == Professional.service_id) \
     .all()

    result = []
    for p in professionals:
        result.append({
            "id": p.id,
            "name": p.professional_name,
            "date_created": p.date_created.strftime("%Y-%m-%d"),
            "address": p.address,
            "pincode": p.pincode,
            "experience": p.experience,
            "service": p.service_name,
            "is_active":p.active
        })
    # print(result)

    return jsonify(result), 200