from flask import Blueprint

apis = Blueprint('apis', __name__)

from .login import login
from .empresas import post_empresas, \
                    get_empresas_route,\
                    update_empresa_route,\
                    delete_empresa_route,\
                    get_empresa_by_id_route

from .user import post_users,\
                get_users_route,\
                update_user_route,\
                delete_user_route

from .contas_a_pagar import post_conta_a_pagar,\
                            post_imagem_nota_fiscal,\
                            get_contas_a_pagar,\
                            update_conta_a_pagar,\
                            post_imagem_comprovante_pagamento

from .contas_pagas import get_contas_pagas