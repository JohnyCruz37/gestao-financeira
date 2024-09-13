from flask import Blueprint

apis = Blueprint('apis', __name__)

from .login import login
from .empresas import post_empresas, get_empresas_route
from .user import post_users
from .empresas_e_gerentes import get_lista_empresas_e_gerentes
