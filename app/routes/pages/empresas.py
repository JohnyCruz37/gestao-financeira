from flask import render_template
from flask_login import login_required
from app.routes.pages import pages
@pages.route('/empresas')
@login_required
def empresas():
    return render_template('pages/empresas.html')