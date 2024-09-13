from flask import request, jsonify
from flask_login import login_user
from app.routes.apis import apis
from app.models.user import User
from app.decorators.json_required import json_required

@apis.route('/login', methods=['POST'])
@json_required
def login():
    success = "Acesso liberado"
    danger = "Usuário ou senha incorretos!"
    dados = request.get_json()

    user = User.query.filter_by(email=dados['email']).first()
    if user and user.verificar_senha(dados['password']):
        login_user(user)
        return jsonify({'message': success}), 200
    else:
        return jsonify({'message': danger}), 401