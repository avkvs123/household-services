from flask_restful import Resource, Api, reqparse, fields, marshal_with
from .models import Service, db

api = Api(prefix='/api')

parser = reqparse.RequestParser()
parser.add_argument('name', type=str, help="name is required and  should be a string", required=True)
parser.add_argument('price', type=float, help="price is not valid,It is required and It should be an Integer", required=True)
parser.add_argument('time_required', type=int, help="Time  is required and should be an integer", required=True)
parser.add_argument("description", type=str, help="Description is required and should be a string", required=True)



service_fields = {
    'id':fields.Integer,
    'name':fields.String,
    'price':fields.Integer,
    'time_required':fields.Integer,
    'description':fields.String
}

class Services(Resource):
    @marshal_with(service_fields)
    def get(self):
        all_services = Service.query.all()
        return all_services
    

    def post(self):
        args = parser.parse_args()
        services = Service(**args)
        db.session.add(services)
        db.session.commit()
        return {"message":"Resource Created-Service detail is added"}
    


api.add_resource(Services, '/services')
