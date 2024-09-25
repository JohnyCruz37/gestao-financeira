from datetime import date
from flask import request, jsonify
from flask_login import login_required, current_user
from app.routes.apis import apis
from app.decorators.json_required import json_required
from app.models.conta_a_pagar import ContaAPagar
from app.models.contasManager import ContasManager
from app.models.empresaManager import EmpresaManager
from app.models.UserManager import UserManager
from app.utils.filtrar_por_vencimento import filtrar_por_vencimento

@apis.route('/conta-a-pagar', methods=['POST'])
@login_required
@json_required
def post_conta_a_pagar():
    if current_user.tipo_acesso != 'gerente':
        return jsonify({'message': 'Você não tem permissão para realizar esta ação'}), 403
    data = request.get_json()
    print(data.get('vencimento'))
    sucesso, msg = ContaAPagar.add_conta(**data)
    if sucesso:
        return jsonify({'message': msg}), 201
    else:
        return jsonify({'message': msg}), 400

@apis.route('/conta-a-pagar', methods=['GET'])
@login_required
def get_contas_a_pagar():
    tipo_acesso_usuario = current_user.tipo_acesso
    if tipo_acesso_usuario == 'admin':
        contas = ContasManager.get_contas_status('pendente')
    elif tipo_acesso_usuario == 'gerente':
        contas = ContasManager.get_contas_id_gerente(current_user.id)
    elif tipo_acesso_usuario == 'financeiro':
        hoje = date.today()
        hoje_str = hoje.strftime('%Y-%m-%d')
        
        contas = ContasManager.get_contas_status('aprovado')
        por_vencimento = filtrar_por_vencimento(contas, hoje_str)
        return jsonify(por_vencimento), 200
    
    return jsonify([conta.to_dict() for conta in contas]), 200

@apis.route('/conta-a-pagar/<id>', methods=['PUT'])
@login_required
def update_conta_a_pagar(id):
    if current_user.tipo_acesso != 'gerente':
        data = request.get_json()
        novo_status = data.get('status')
        if novo_status == 'pago':
            ContasManager.update_comprovante_pagamento(id, data.get('url_comprovante_pagamento'))
            
        sucesso, msg = ContasManager.update_status_conta(id, novo_status)
        if sucesso:
            return jsonify({'message': msg}), 200
        else:
            return jsonify({'message': msg}), 400
    return jsonify({'message': 'Você não tem permissão para realizar esta ação'}), 403
    

@apis.route('/conta-a-pagar/<id>', methods=['GET'])
@login_required
def get_conta_a_pagar_by_id(id):    
    conta = ContasManager.get_conta_by_id(id)
    try:
        if conta:
            dict_conta = conta.to_dict()
            id_gerente = dict_conta['id_gerente']
            id_empresa = dict_conta['id_empresa']

            user = UserManager.get_user_by_id(id_gerente)
            empresa = EmpresaManager.get_empresa_by_id(id_empresa)
            dict_conta['gerente'] = user
            dict_conta['empresa'] = empresa

            return jsonify(dict_conta), 200
        else:
            return jsonify({'message': 'Conta não encontrada'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

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
    

@apis.route('/conta-a-pagar/imagem-comprovante-pagamento', methods=['POST'])
@login_required
def post_imagem_comprovante_pagamento():
    if current_user.tipo_acesso != 'financeiro':
        return jsonify({'message': 'Você não tem permissão para realizar esta ação'}), 403
    
    if 'imagem' not in request.files:
        return jsonify({'message': 'Arquivo de comprovante de pagamento não encontrado'}), 400
    
    file = request.files['imagem']
    if file.filename == '':
        return jsonify({'message': 'Nome do arquivo vazio'}), 400
    
    financeiro_id = current_user.id

    try:
        caminho_relativo = ContaAPagar.post_image_comprovante(file, financeiro_id)
        return jsonify({'caminho': caminho_relativo}), 201
    except Exception as e:
        return jsonify({'message': 'Erro ao salvar o arquivo', 'error': str(e)}), 500