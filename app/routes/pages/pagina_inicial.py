from flask import render_template
from flask_login import login_required
from app.routes.pages import pages
@pages.route('/pagina-inicial')
@login_required
def pagina_inicial():
    return render_template('pages/pagina-inicial.html')