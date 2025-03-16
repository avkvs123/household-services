from flask import current_app as app, jsonify, request, render_template
from flask_security import auth_required, roles_required
from .models import Service, db, User
from .datastore import datastore
from werkzeug.security import check_password_hash


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
    

