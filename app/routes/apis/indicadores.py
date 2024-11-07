from flask import request, jsonify
from flask_login import login_required

from app.routes.apis import apis
from app.decorators.require_access_level import require_any_access_level
from app.models.empresaManager import EmpresaManager
from app.utils.lista_indicadores import lista_indicadores
@apis.route('/indicadores', methods=['GET'])
@login_required
@require_any_access_level('admin')
def get_indicadores():
    empresas = EmpresaManager.get_empresas()
    indicadores = lista_indicadores(empresas)

    return jsonify(indicadores), 200