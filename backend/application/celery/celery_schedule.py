from celery import Celery
from celery.schedules import crontab
from flask import current_app as app
from backend.application.celery.tasks import daily_email_reminder, scheduler_check, monthly_report_to_customers

celery_app = app.extensions['celery']


@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):

    # sender.add_periodic_task(10, monthly_report_to_customers.s(), name='add every 10')
    # sender.add_periodic_task(30, daily_email_reminder.s(), name='add every 30')

    # Executes every Monday morning at 7:30 a.m.
    sender.add_periodic_task(
        crontab(hour=7, minute=30),
        daily_email_reminder.s(name='Daily Reminder to Professionals'),
    )

    sender.add_periodic_task(
        crontab(day_of_month=1, hour=8, minute=0),
        monthly_report_to_customers.s(),
    )
