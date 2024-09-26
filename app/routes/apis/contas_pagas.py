from flask import jsonify
from flask_login import login_required, current_user
from app.routes.apis import apis
from app.models.contasManager import ContasManager

@apis.route('/contas-pagas', methods=['GET'])
@login_required
def get_contas_pagas():
    tipo_acesso_usuario = current_user.tipo_acesso
    if tipo_acesso_usuario != 'admin':
        return jsonify({'message': 'Acesso não permitido'}), 403
    contas = ContasManager.get_contas_status('pago')
    
    return jsonify([conta.to_dict() for conta in contas]), 200