from flask import render_template
from flask_login import login_required
from app.routes.pages import pages
from app.decorators.require_access_level import require_any_access_level
@pages.route('/empresas')
@login_required
@require_any_access_level('admin')
def empresas():
    return render_template('pages/empresas.html')