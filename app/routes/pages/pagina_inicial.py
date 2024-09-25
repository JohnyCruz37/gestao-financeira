from flask import render_template, redirect, url_for
from flask_login import login_required, current_user
from app.routes.pages import pages

@pages.route('/pagina-inicial')
@login_required
def pagina_inicial():
    if current_user.tipo_acesso == 'gerente':
        return redirect(url_for('pages.lancar_conta', id_empresa=current_user.id_empresa))
    return render_template('pages/pagina-inicial.html')