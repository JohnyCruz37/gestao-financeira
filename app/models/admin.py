from .user import User
from .UserManager import UserManager
from .empresaManager import EmpresaManager
from .contasManager import ContasManager
class Admin(User):
    __mapper_args__ = {
        'polymorphic_identity': 'admin'
    }
    def __init__(self, **kwargs):
        kwargs.pop('tipo_acesso', None) # validado fora do objeto
        super().__init__(tipo_acesso='admin', **kwargs)


    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'sobrenome': self.sobrenome,
            'celular': self.celular,
            'email': self.email,
            'tipo_acesso': self.tipo_acesso,
        }

    def get_users(cls):
        return UserManager.get_users()

    def add_user(self, data, id_empresa=None):
        return UserManager.add_user(data, id_empresa)

    def update_user(self, user_id, data):
        return UserManager.update_user(user_id, data)

    def delete_user(self, user_id):
        return UserManager.delete_user(user_id)

    def get_empresas(cls):
        return EmpresaManager.get_empresas()

    @classmethod
    def add_empresa(cls, data):
        return EmpresaManager.add_empresa(data)

    def update_empresa(self, id_empresa, data):
        return EmpresaManager.update_empresa(id_empresa, data)

    def delete_empresa(self, id_empresa):
        return EmpresaManager.delete_empresa(id_empresa)

    def filtrar_contas_por_empresa(self, id_empresa):
        return ContasManager.filtrar_contas_por_empresa(id_empresa)
    
    def aprovar_conta(self, conta_id):
        return ContasManager.aprovar_conta(conta_id)
    
    def visualizar_contas_pagamento(self):
        return ContasManager.visualizar_contas_pagamento()
    