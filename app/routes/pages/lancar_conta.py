from flask import render_template
from flask_login import login_required
from app.routes.pages import pages
from app.decorators.require_access_level import require_any_access_level


@pages.route('/lancar-conta-a-pagar')
@require_any_access_level('gerente', 'admin')
@login_required
def lancar_conta():
    return render_template('pages/lancar-conta.html')
