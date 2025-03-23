from flask_restful import Resource, Api, reqparse, fields, marshal_with
from .models import Service, db
from flask_security import auth_required, roles_required

api = Api(prefix='/api')

parser = reqparse.RequestParser()
parser.add_argument('name', type=str, help="name is required and  should be a string", required=True)
parser.add_argument('price', type=float, help="price is not valid,It is required and It should be an Integer", required=True)
parser.add_argument('time_required', type=int, help="Time  is required and should be an integer", required=True)
parser.add_argument("description", type=str, help="Description is required and should be a string", required=True)

update_parser = reqparse.RequestParser()
update_parser.add_argument('id', type=int, help="Service ID is required", required=True)
update_parser.add_argument('name', type=str)
update_parser.add_argument('price', type=float)
update_parser.add_argument('time_required', type=int)
update_parser.add_argument("description", type=str)

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
    
    @auth_required('token')
    @roles_required("admin")
    def post(self):
        args = parser.parse_args()
        services = Service(**args)
        db.session.add(services)
        db.session.commit()
        return {"message":"Resource Created-Service detail is added"}
    
    @auth_required('token')
    @roles_required("admin")
    def delete(self):
        args = update_parser.parse_args()
        ser = Service.query.get(args["id"])
        if not ser:
            return {"message":"Service not found"}, 404
        db.session.delete(ser)
        db.session.commit()
        return {"message": "Service deleted successfully"}, 200
    


    @auth_required('token')
    @roles_required("admin")
    def put(self):
        args = update_parser.parse_args()
        service = Service.query.get(args["id"])
        
        if not service:
            return {"message": "Service not found"}, 404
        
        if args["name"]:
            service.name = args["name"]
        if args["price"]:
            service.price = args["price"]
        if args["time_required"]:
            service.time_required = args["time_required"]
        if args["description"]:
            service.description = args["description"]

        db.session.commit()
        return {"message": "Service updated successfully"}, 200
        


api.add_resource(Services, '/services')
