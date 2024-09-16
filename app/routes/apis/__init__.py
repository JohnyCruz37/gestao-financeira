from flask import Blueprint

apis = Blueprint('apis', __name__)

from .login import login
from .empresas import post_empresas, \
                    get_empresas_route,\
                    update_empresa_route,\
                    delete_empresa_route

from .user import post_users,\
                get_users_route,\
                update_user_route,\
                delete_user_route