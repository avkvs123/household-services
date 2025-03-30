from flask import Flask
from backend.application.models import db, User, Role
from flask_security import Security
from backend.config import  DevelopmentConfig
from backend.application.datastore import datastore
from backend.application.celery.celery_factory import celery_init_app
from flask_caching import Cache
import flask_excel as excel




def create_app():
    app = Flask(__name__, static_folder="frontend", static_url_path="/static", template_folder="backend/templates")
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    cache = Cache(app)  
    excel.init_excel(app) 
    app.cache = cache 

    app.security = Security(app, datastore)
    with app.app_context():
        from backend.application.resources import api
        api.init_app(app)
        import backend.application.views




        
    return app, datastore


app, datastore = create_app()

celery_app = celery_init_app(app)


if __name__ == "__main__":
    app.run(debug=True)