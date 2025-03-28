from flask import current_app as app, jsonify, request, render_template
from flask_security import auth_required, roles_required, current_user
from .models import Service, db, User, Professional, Customer, ServiceRequest
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
    prof = Professional.query.get(prof_id)
    if not prof:
        return jsonify({"message":"Professional not found"}), 404
    print(f"professional is {prof}")
    prof.user.active = True  # Set active attribute to True
    db.session.commit()  # Commit the change to the database
    return jsonify({"message": "Professional activated successfully"}), 200

@app.get('/deactivate_professional/<int:prof_id>')
@auth_required('token')
@roles_required("admin")
def deactivate_professional(prof_id):
    prof = Professional.query.get(prof_id)
    if not prof:
        return jsonify({"message":"Professional not found"}), 404
    print(f"professional is {prof}")
    prof.user.active = False  # Set active attribute to False
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
        experience=data.get('experience'),
        phone=data.get('phone')
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



@app.route('/api/professionals', methods=['GET'])
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


@app.route('/api/service-requests', methods=['GET'])
@auth_required('token')
def get_service_requests():
    # Check if the user is an admin
    if "admin" in [role.name for role in current_user.roles]:
        # Admins get all service requests
        service_requests = ServiceRequest.query.all()
    
    elif "professional" in [role.name for role in current_user.roles]:
        # Professionals get only their assigned service requests
        if current_user.professional:
            professional_id = current_user.professional.id
            service_requests = ServiceRequest.query.filter_by(professional_id=professional_id).all()
        else:
            return jsonify({"error": "No professional profile associated with this user"}), 403
        
    elif "customer" in [role.name for role in current_user.roles]:
        # Professionals get only their assigned service requests
        if current_user.customer:
            customer_id = current_user.customer.id
            service_requests = ServiceRequest.query.filter_by(customer_id=customer_id).all()
        else:
            return jsonify({"error": "No profile associated with this user"}), 403
    
    else:
        return jsonify({"error": "Unauthorized"}), 403
    
    # Serialize the service requests
    result = []
    for sr in service_requests:
        result.append({
            "id": sr.id,
            "service_id": sr.service_id,
            "service_name": sr.service.name if sr.service else None,  # Include service name
            "customer_id": sr.customer_id,
            "customer_username": sr.customer.user.username if sr.customer else None,
            "customer_address": sr.customer.address if sr.customer else None,
            "customer_phone": sr.customer.phone if sr.customer else None,
            "professional_id": sr.professional_id,
            "professional_username": sr.professional.user.username if sr.professional else None,
            "professional_pincode": sr.professional.pincode if sr.professional else None,
            "date_of_request": sr.date_of_request.strftime("%Y-%m-%d"),
            "date_of_completion": sr.date_of_completion.strftime("%Y-%m-%d") if sr.date_of_completion else None,
            "service_status": sr.service_status,
            "rating":sr.rating,
            "remarks": sr.remarks
        })

    return jsonify(result), 200




@app.post("/create-service-request")
@auth_required('token')
@roles_required("customer")
def create_service_request():
    try:
        
        data = request.get_json()
        service_id = data.get("service_id")
        customer_id = current_user.customer.id
        professional_id = data.get("professional_id")  # Optional field

        if not service_id or not customer_id or not professional_id:
            return jsonify({"error": "service_id, customer_id and professional_id are required"}), 400

        new_request = ServiceRequest(
            service_id=service_id,
            customer_id=customer_id,
            professional_id=professional_id
        )

        db.session.add(new_request)
        db.session.commit()

        return jsonify({"message": "Service request created successfully", "request_id": new_request.id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/api/customers', methods=['GET'])
@auth_required('token')
@roles_required("admin")
def get_customers():
    customers = db.session.query(
        Customer.id,
        Customer.address,
        Customer.phone,
        User.username.label('customer_name'),  # Fetch Customer's Name from User table
        User.email.label('email'),
        User.active.label('active')
    ).join(User, User.id == Customer.user_id) \
     .all()

    result = []
    for c in customers:
        result.append({
            "id": c.id,
            "name": c.customer_name,
            "email": c.email,
            "address": c.address,
            "phone": c.phone,
            "is_active": c.active
        })

    return jsonify(result), 200


@app.get('/activate_customer/<int:customer_id>')
@auth_required('token')
@roles_required("admin")
def activate_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({"message": "Customer not found"}), 404

    customer.user.active = True  # Set active attribute to True
    db.session.commit()
    return jsonify({"message": "Customer activated successfully"}), 200


@app.get('/deactivate_customer/<int:customer_id>')
@auth_required('token')
@roles_required("admin")
def deactivate_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({"message": "Customer not found"}), 404

    customer.user.active = False  # Set active attribute to False
    db.session.commit()
    return jsonify({"message": "Customer deactivated successfully"}), 200


@app.get('/service-professionals/<int:service_id>')
@auth_required('token')
@roles_required("customer")
def service_professionals(service_id):
    # Query to fetch professionals linked to the service and are active
    professionals = (
        db.session.query(Professional)
        .join(User, Professional.user_id == User.id)
        .filter(Professional.service_id == service_id, User.active == True)
        .all()
    )

    

    # Convert the results into a list of dictionaries
    result = [
        {
            "id": p.id,
            "name": p.user.username,  # Assuming 'username' is the professional's name
            "email":p.user.email,
            "date_created": p.date_created.strftime("%Y-%m-%d"),
            "phone":p.phone,
            "address": p.address,
            "pincode": p.pincode,
            "experience": p.experience
        }
        for p in professionals
    ]

    print(f"professional are: {professionals}")

    return jsonify(result), 200


@app.post('/customer/close_service')
@auth_required('token')
@roles_required("customer")
def close_service_request():
    try:
        data = request.get_json()
        request_id = data.get("request_id")
        remarks = data.get("remarks", "")  # Default to empty string if not provided
        rating = data.get("rating")

        if not request_id:
            return jsonify({"error": "Request ID is required"}), 400

        # Fetch the service request
        service_request = ServiceRequest.query.get(request_id)

        if not service_request:
            return jsonify({"error": "Service request not found"}), 404

        # if service_request.service_status == "closed":
        #     return jsonify({"message": "Service request is already closed"}), 400

        # Update the service request
        service_request.service_status = "closed"
        service_request.remarks = remarks
        service_request.rating = rating
        service_request.date_of_completion = datetime.date.today()

        db.session.commit()

        return jsonify({"message": "Service request closed successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        

@app.post('/professional/take-action')
@auth_required('token')
@roles_required("professional")
def service_request_action_by_professional():
    try:
        data = request.get_json()
        print(data)
        request_id = data.get("request_id")
        status = data.get("action") 


        
        if not request_id:
            return jsonify({"error": "Service Request ID is required"}), 400

        # Fetch the service request
        service_request = ServiceRequest.query.get(request_id)



        if not service_request:
            return jsonify({"error": "Service request not found"}), 404

        print(f"Status requested : {status} and type is {type(status)}")

        if str(status) != "accepted" and str(status) != 'rejected' and str(status) != 'completed':
            return jsonify({"error": "Service status provided is not correct"}), 404
        


        # Update the service request
        service_request.service_status = status
        service_request.date_of_completion = datetime.date.today()

        db.session.commit()

        return jsonify({"message": "Service request action taken successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

