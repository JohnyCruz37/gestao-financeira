from flask import render_template, abort
from flask_login import login_required, current_user
from app.routes.pages import pages
from app.decorators.require_access_level import require_any_access_level
from app.models.empresa import Empresa

@pages.route('/lancar-conta-a-pagar/<int:id_empresa>')
@require_any_access_level('gerente')
@login_required
def lancar_conta(id_empresa):
    if current_user.id_empresa != id_empresa:
        abort(403, 'Você não tem permissão para acessar essa página.')

    empresa = Empresa.query.get(id_empresa)
    if not empresa:
        abort(404, 'Empresa não encontrada.')

    return render_template('pages/lancar-conta.html', id_gerente=current_user.id, id_empresa=id_empresa)
