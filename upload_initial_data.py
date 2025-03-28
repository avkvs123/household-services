from main import app
from backend.application.models import db,  Service
from werkzeug.security import generate_password_hash 
from backend.application.datastore import datastore

with app.app_context():
    db.create_all()

    datastore.find_or_create_role(name='admin', description='Admin Role')
    datastore.find_or_create_role(name='customer', description='Customer Role')
    datastore.find_or_create_role(name='professional', description='Professional Role')
    

    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(username= "admin", email="admin@email.com", password=generate_password_hash("admin"), roles=["admin"])

    # if not datastore.find_user(email="customer1@email.com"):
    #     datastore.create_user(username= "customer1", email="customer1@email.com", password=generate_password_hash("customer1"), roles=["customer"])

    # if not datastore.find_user(email="professional1@email.com"):
    #     datastore.create_user(username= "professional1", email="professional1@email.com", password=generate_password_hash("professional1"), roles=["professional"], active = False)



    # Adding roles
    # roles = [
    #     # Role(id='admin', name='Admin', description='Admin Role'),
    #     # Role(id='customer', name='Customer', description='Customer Role'),
    #     # Role(id='professional', name='Professional', description='Professional Role')

    #     Role( name='Admin', description='Admin Role'),
    #     Role( name='Customer', description='Customer Role'),
    #     Role( name='Professional', description='Professional Role')
    # ]
    
    # for role in roles:
    #     db.session.merge(role)  # Ensures roles are added without duplication

    # Adding home services
    services = [
        Service(name="Plumbing", price=500, time_required=60, description="Fixing leaks and pipe fittings"),
        Service(name="Electrician", price=600, time_required=75, description="Electrical repairs and installations"),
        Service(name="Carpentry", price=700, time_required=90, description="Woodwork repairs and furniture making"),
        Service(name="House Cleaning", price=400, time_required=120, description="Full house deep cleaning"),
        Service(name="AC Repair", price=1000, time_required=90, description="AC servicing and repairs"),
        Service(name="Painting", price=1500, time_required=180, description="Wall painting and renovation"),
        Service(name="Pest Control", price=1200, time_required=90, description="Termite and insect control services"),
        Service(name="Geyser Repair", price=800, time_required=60, description="Geyser installation and repair"),
        Service(name="Washing Machine Repair", price=90, time_required=75, description="Fixing washing machines"),
        Service(name="Sofa Cleaning", price=500, time_required=90, description="Deep cleaning of sofas and upholstery")
    ]

    for service in services:
        db.session.merge(service)  # Ensures services are added without duplication

    try:
        db.session.commit()
        print("Initial data added successfully.")
    except Exception as e:
        print("Error occurred:", e)

