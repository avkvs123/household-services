from celery import shared_task
from backend.application.models import *
import flask_excel as excel
import datetime
from datetime import timedelta
from flask import current_app
import os
from backend.application.celery.mail_service import send_email 
from jinja2 import Template
import calendar


def generate_html_report(customer, service_requests):
    template = Template("""
    <html>
    <body>
        <h2>Monthly Activity Report - {{ month_year }}</h2>
        <p>Dear {{ customer_name }},</p>
        <p>Here is your service activity for the month:</p>
        <table border='1' cellpadding='5' cellspacing='0'>
            <tr>
                <th>Service</th>
                <th>Status</th>
                <th>Date Requested</th>
                <th>Date Completed</th>
                <th>Remarks</th>
            </tr>
            {% for request in service_requests %}
            <tr>
                <td>{{ request.service.name }}</td>
                <td>{{ request.service_status }}</td>
                <td>{{ request.date_of_request.strftime('%Y-%m-%d') }}</td>
                <td>{{ request.date_of_completion.strftime('%Y-%m-%d') if request.date_of_completion else 'N/A' }}</td>
                <td>{{ request.remarks if request.remarks else 'N/A' }}</td>
            </tr>
            {% endfor %}
        </table>
        <p>Thank you for using our services.</p>
    </body>
    </html>
    """)
    return template.render(
        month_year=datetime.datetime.today().strftime('%B %Y'),
        customer_name=customer.user.username,
        service_requests=service_requests
    )




@shared_task(ignore_result=True)
def scheduler_check():
    send_email('avkvs123@gmail.com', "Test MAil", "<h1>Test Mail</h1>", 'html')



@shared_task(ignore_result=True)
def daily_email_reminder():

    # send_email(to, subject, content)
    professionals = (
        db.session.query(Professional)
        .join(ServiceRequest, Professional.id == ServiceRequest.professional_id)
        .filter(ServiceRequest.service_status.in_(['requested', 'accepted']))
        .join(User, Professional.user_id == User.id)
        .all()
    )

    if not professionals:
        print(f"No professionals with pending requests")
    
    for professional in professionals:
        if professional.user.email:
            subject = "Service Request Action Required"
            body = f"Hello {professional.user.username},\n\nYou have pending service requests. Please take action as soon as possible.\n\nBest,\nYour Service Management Team"
            send_email(professional.user.email, subject, body, 'text')
            print(f"Email sent to {professional.user.email}")


@shared_task(ignore_result=True)
def monthly_report_to_customers():
    # Get the first and last day of the previous month
    today = datetime.datetime.today()
    # Determine the first and last day of the previous month
    first_day_last_month = today.replace(day=1) - timedelta(days=1)  # Last day of the previous month
    first_day_last_month = first_day_last_month.replace(day=1)  # First day of the previous month
    last_day_last_month = datetime.datetime(first_day_last_month.year, first_day_last_month.month, calendar.monthrange(first_day_last_month.year, first_day_last_month.month)[1])


    print(f"First Day Last Month: {first_day_last_month}, Last Day Last Month: {last_day_last_month}")
    
    # Fetch customers
    customers = Customer.query.all()

    print(f"Customers are {customers}")
    
    for customer in customers:
        # Fetch service requests for this customer from the previous month
        service_requests = ServiceRequest.query.filter(
            ServiceRequest.customer_id == customer.id
            # ServiceRequest.date_of_request >= first_day_last_month,  # Start of last month
            # ServiceRequest.date_of_request <= last_day_last_month    # End of last month
        ).all()

        print(f"Service Requests for {customer.id}: {service_requests}")
        
        # Generate HTML report
        report_html = generate_html_report(customer, service_requests)
        
        # Send email
        send_email(customer.user.email, 'Monthly Report',report_html, 'html')






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