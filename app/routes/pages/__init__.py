from flask import Blueprint

pages = Blueprint('pages', __name__)

from .login import login
from .pagina_inicial import pagina_inicial
from .empresas import empresas
from .lancar_conta import lancar_conta
from .server_image import serve_image
from .contas_pagas import contas_pagas
