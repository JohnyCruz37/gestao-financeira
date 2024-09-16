from functools import wraps
from flask import redirect, url_for, request, flash
from flask_login import current_user

def require_any_access_level(*required_access_levels):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if current_user.tipo_acesso not in required_access_levels:
                flash('Acesso não autorizado.', 'danger')
                return redirect(url_for('pages.pagina_inicial'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator
