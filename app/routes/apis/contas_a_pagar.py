from flask import request, jsonify
from flask_login import login_required, current_user
from app.routes.apis import apis
from app.decorators.json_required import json_required
from app.models.conta_a_pagar import ContaAPagar

@apis.route('/conta-a-pagar', methods=['POST'])
@login_required
@json_required
def post_conta_a_pagar():
    if current_user.tipo_acesso != 'gerente':
        return jsonify({'message': 'Você não tem permissão para realizar esta ação'}), 403
    data = request.get_json()
    sucesso, msg = ContaAPagar.add_conta(**data)
    if sucesso:
        return jsonify({'message': msg}), 201
    else:
        return jsonify({'message': msg}), 400

@apis.route('/conta-a-pagar/imagem-nota-fiscal', methods=['POST'])
@login_required
def post_imagem_nota_fiscal():
    if current_user.tipo_acesso != 'gerente':
        return jsonify({'message': 'Você não tem permissão para realizar esta ação'}), 403
    
    if 'imagem' not in request.files:
        return jsonify({'message': 'Arquivo de nota fiscal não encontrado'}), 400
    
    file = request.files['imagem']

    if file.filename == '':
        return jsonify({'message': 'Nome do arquivo vazio'}), 400
    
    gerente_id = current_user.id
    empresa_id = current_user.id_empresa

    try:
        caminho_relativo = ContaAPagar.post_image_nota(file, gerente_id, empresa_id)
    except Exception as e:
        return jsonify({'message': 'Erro ao salvar o arquivo', 'error': str(e)}), 500

    return jsonify({'caminho': caminho_relativo}), 201
    

