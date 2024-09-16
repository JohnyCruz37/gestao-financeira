from flask import request, jsonify
from flask_login import login_required, current_user
from app.routes.apis import apis
from app.models.admin import Admin
from app.decorators.json_required import json_required

@apis.route('/users', methods=['POST'])
@login_required
@json_required
def post_users():
    if current_user.tipo_acesso!= 'admin':
        return jsonify({'message': 'Você não tem permissão para realizar esta ação'}), 403
    
    data = request.get_json()
    id_empresa = data.get('select-empresa') if 'select-empresa' in data else None
    admin = Admin(**current_user.__dict__)
    sucesso, msg = admin.add_user(data, id_empresa)
    if sucesso:
        return jsonify({'message': msg}), 201
    else:
        return jsonify({'message': msg}), 400
    

@apis.route('/users', methods=['GET'])
@login_required
def get_users_route():
    if current_user.tipo_acesso!= 'admin':
        return jsonify({'message': 'Acesso não permitido'}), 403
    
    try:    
        admin = Admin(**current_user.__dict__)
        users = admin.get_users()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@apis.route('/users/<id>', methods=['PUT'])
@login_required
def update_user_route(id):
    if current_user.tipo_acesso!= 'admin':
        return jsonify({'message': 'Você não tem permissão para realizar esta ação'}), 403

    data = request.get_json()

    admin = Admin(**current_user.__dict__)
    sucesso, msg = admin.update_user(id, data)
    if sucesso:
        return jsonify({'message': msg}), 200
    else:
        return jsonify({'message': msg}), 400


@apis.route('/users/<id>', methods=['DELETE'])
@login_required
def delete_user_route(id):
    if current_user.tipo_acesso!= 'admin':
        return jsonify({'message': 'Você não tem permissão para realizar esta ação'}), 403
    
    admin = Admin(**current_user.__dict__)
    sucesso, msg = admin.delete_user(id)
    if sucesso:
        return jsonify({'message': msg}), 200
    else:
        return jsonify({'message': msg}), 400