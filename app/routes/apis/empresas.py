from flask import request, jsonify
from flask_login import login_required, current_user
from app.routes.apis import apis
from app.models.admin import Admin
from app.decorators.json_required import json_required
from app.models.gerente import Gerente

@apis.route('/empresas', methods=['POST'])
@json_required
@login_required
def post_empresas():
    if current_user.tipo_acesso!= 'admin':
        return jsonify({'message': 'Você não tem permissão para realizar esta ação'}), 403
    
    data = request.get_json()

    sucesso, msg = Admin.add_empresa(data)
    if sucesso:
        return jsonify({'message': msg}), 201
    else:
        return jsonify({'message': msg}), 400

@apis.route('/empresas', methods=['GET'])
@login_required
def get_empresas_route():
    if current_user.tipo_acesso!= 'admin':
        return jsonify({'message': 'Você não tem permissão para realizar esta ação'}), 403
    
    admin = Admin(**current_user.__dict__)
    empresas = admin.get_empresas()
    return jsonify(empresas)

@apis.route('/empresas/<id>', methods=['GET'])
def get_empresa_by_id_route(id):
    if current_user.tipo_acesso!= 'admin' and current_user.tipo_acesso!= 'gerente':
        return jsonify({'message': 'Você não tem permissão para realizar esta ação'}), 403
    
    if current_user.tipo_acesso == 'gerente':
        gerente = Gerente(**current_user.to_dict())
        empresa = gerente.get_empresa_by_id(gerente.id_empresa)
        if not empresa:
            return jsonify({'message': 'Você não tem permissão para acessar esta empresa'}), 403
        return jsonify(empresa)
        


@apis.route('/empresas/<id>', methods=['PUT'])
@login_required
def update_empresa_route(id):
    if current_user.tipo_acesso!= 'admin':
        return jsonify({'message': 'Você não tem permissão para realizar esta ação'}), 403
    
    data = request.get_json()
    admin = Admin(**current_user.__dict__)
    sucesso, msg = admin.update_empresa(id, data)
    if sucesso:
        return jsonify({'message': msg}), 200
    else:
        return jsonify({'message': msg}), 400

@apis.route('/empresas/<id>', methods=['DELETE'])
@login_required
def delete_empresa_route(id):
    if current_user.tipo_acesso!= 'admin':
        return jsonify({'message': 'Você não tem permissão para realizar esta ação'}), 403
    
    admin = Admin(**current_user.__dict__)
    sucesso, msg = admin.delete_empresa(id)
    if sucesso:
        return jsonify({'message': msg}), 200
    else:
        return jsonify({'message': msg}), 400