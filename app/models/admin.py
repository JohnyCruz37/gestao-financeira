from .user import User
from .UserManager import UserManager
from .empresaManager import EmpresaManager
from .contasManager import ContasManager
class Admin(User):
    __mapper_args__ = {
        'polymorphic_identity': 'admin'
    }

    def __init__(self, nome, sobrenome, celular, email, senha, id_empresa=None):
        super().__init__('admin', nome, sobrenome, celular, email, senha, id_empresa)


    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'sobrenome': self.sobrenome,
            'celular': self.celular,
            'email': self.email,
            'tipo_acesso': self.tipo_acesso,
        }

    @classmethod
    def get_users(cls):
        return UserManager.get_users()

    def add_user(self, data):
        return UserManager.add_user(data)

    def atualizar_usuario(self, user_id, data):
        return UserManager.update_user(user_id, data)

    def deletar_usuario(self, user_id):
        return UserManager.delete_user(user_id)

    @classmethod
    def get_empresas(cls):
        return EmpresaManager.get_empresas()

    @classmethod
    def add_empresa(cls, data):
        return EmpresaManager.add_empresa(data)

    def update_empresa(self, empresa_id, data):
        return EmpresaManager.update_empresa(empresa_id, data)

    def delete_empresa(self, empresa_id):
        return EmpresaManager.delete_empresa(empresa_id)

    def filtrar_contas_por_empresa(self, empresa_id):
        return ContasManager.filtrar_contas_por_empresa(empresa_id)
    
    def aprovar_conta(self, conta_id):
        return ContasManager.aprovar_conta(conta_id)
    
    def visualizar_contas_pagamento(self):
        return ContasManager.visualizar_contas_pagamento()
    