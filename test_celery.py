from celery import Celery

app = Celery('test', broker='redis://localhost:6379/0')

try:
    app.connection().connect()
    print("Celery connected to Redis successfully!")
except Exception as e:
    print(f"Celery connection failed: {e}")
