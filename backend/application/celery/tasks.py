from celery import shared_task
from backend.application.models import *
import flask_excel as excel
import datetime
from flask import current_app
import os

@shared_task(ignore_result=False)
def say_hello():
    print(f"Inside the say_hello function")
    return "say hello"
 
@shared_task(ignore_result=False)
def add(x, y):
    return x+y




# ✅ 3. Export Service Requests as CSV (Admin Triggered)
@shared_task(ignore_result=False)
def create_csv():
    service_requests = ServiceRequest.query.filter(ServiceRequest.service_status == "closed").all()
    # ✅ Handle empty result case
    if not service_requests:
        return "No closed service requests found."
    result = []
    for sr in service_requests:
        result.append({
            "Request ID": sr.id,
            "Service ID": sr.service_id,
            "Service Name": sr.service.name if sr.service else None,
            "Customer ID": sr.customer_id,
            "Customer Name": sr.customer.user.username if sr.customer else None,
            "Customer Address": sr.customer.address if sr.customer else None,
            "Customer Phone": sr.customer.phone if sr.customer else None,
            "Professional ID": sr.professional_id,
            "Professional Name": sr.professional.user.username if sr.professional else None,
            "Professional Pincode": sr.professional.pincode if sr.professional else None,
            "Date of Request": sr.date_of_request.strftime("%Y-%m-%d"),
            "Date of Completion": sr.date_of_completion.strftime("%Y-%m-%d") if sr.date_of_completion else None,
            "Service Status": sr.service_status,
            "Rating": sr.rating,
            "Remarks": sr.remarks
        })
    # Define column headers
    column_names = [
        "Request ID", "Service ID", "Service Name", "Customer ID", "Customer Name", "Customer Address", 
        "Customer Phone", "Professional ID", "Professional Name", "Professional Pincode", 
        "Date of Request", "Date of Completion", "Service Status", "Rating", "Remarks"
    ]

    # Prepare CSV data using flask_excel
    csv_data = excel.make_response_from_records(result, column_names=column_names, file_type="csv")

    # Define the filename and path
    filename = f"service_requests_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.csv"
    filepath = os.path.join("exports", filename)

    # Ensure the directory exists
    if not os.path.exists("exports"):
        os.makedirs("exports")

    # Write CSV file
    with open(filepath, "wb") as file:
        file.write(csv_data.data)

    return filepath