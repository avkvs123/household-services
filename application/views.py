from flask import current_app as app, jsonify
from flask_security import auth_required, roles_required
from .models import Service, db, User


@app.get('/')
def home():
    return "hello world"


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

    