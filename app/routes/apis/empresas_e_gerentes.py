from flask import jsonify
from flask_login import login_required, current_user
from app.routes.apis import apis
from app.models.admin import Admin

@apis.route('/lista-empresas-e-gerentes', methods=['GET'])
@login_required
def get_lista_empresas_e_gerentes():
    if current_user.tipo_acesso!= 'admin':
        return jsonify({'message': 'Acesso não permitido'}), 403
    
    try:    
        users = Admin.get_users()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500