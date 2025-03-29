from celery import Celery, Task

class FlaskTask(Task):
    """Custom Celery Task that ensures Flask app context."""
    def __call__(self, *args, **kwargs):
        with self.app.app_context():
            return self.run(*args, **kwargs)

def celery_init_app(app):
    """Initialize Celery with Flask app."""
    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object("celery_config")
    celery_app.Task.app = app  # Ensure Flask context is set
    return celery_app
