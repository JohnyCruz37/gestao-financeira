from flask import Blueprint

pages = Blueprint('pages', __name__)

from .login import login
from .pagina_inicial import pagina_inicial
from .empresas import empresas
