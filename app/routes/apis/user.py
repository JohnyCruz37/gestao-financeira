from flask import request, jsonify
from app.routes.apis import apis
from app.models.user import User
from app.decorators.json_required import json_required

@apis.route('/users', methods=['POST'])
@json_required
def post_users():
    data = request.get_json()
    pass
    sucesso, msg = User.add_user(data)
    if sucesso:
        return jsonify({'message': msg}), 201
    else:
        return jsonify({'message': msg}), 400
    
# @apis.route('/users', methods=['GET'])
# def get_users_route():
#     users = User.get_users()
#     return jsonify(users)