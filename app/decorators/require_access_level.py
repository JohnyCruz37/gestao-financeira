from functools import wraps
from flask import redirect, url_for, request, flash
from flask_login import current_user

def require_access_level(required_access):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if current_user.tipo_acesso != required_access:
                flash('Acesso não autorizado.', 'danger')
                if required_access == 'admin':
                    return redirect(url_for('pages.pagina_inicial'))
                elif required_access == 'financeiro':
                    return redirect(url_for('pages.pagina_inicial'))
                elif required_access == 'gerente':
                    return redirect(url_for('pages.pagina_inicial'))
                return redirect(url_for('pagina_inicial'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator
