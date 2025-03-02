from main import app 
from application.models import db, Role, Service


with app.app_context():
    db.create_all()
    # admin = Role(id='admin', name='Admin', description='Admin Role')
    # db.session.add(admin)
    # customer = Role(id='customer', name='Customer', description='Customer Role')
    # db.session.add(customer)
    # professional = Role(id='professional', name='Professional', description='Professional Role')
    # db.session.add(professional)
    # try:
    #     db.session.commit()
    # except:
    #     pass


    # Adding roles
    roles = [
        Role(id='admin', name='Admin', description='Admin Role'),
        Role(id='customer', name='Customer', description='Customer Role'),
        Role(id='professional', name='Professional', description='Professional Role')
    ]
    
    for role in roles:
        db.session.merge(role)  # Ensures roles are added without duplication

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

