from flask import render_template, redirect, url_for
from flask_login import login_required, current_user
from app.routes.pages import pages
from app.decorators.require_access_level import require_any_access_level

@pages.route('/contas-pagas')
@login_required
@require_any_access_level('admin')
def contas_pagas():
    return render_template('pages/contas-pagas.html')