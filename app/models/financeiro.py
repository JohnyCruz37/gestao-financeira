from app import db
from .user import User
from .conta_a_pagar import ContaAPagar
class Financeiro(User):
    __mapper_args__ = {
        'polymorphic_identity': 'financeiro'
    }
    def __init__(self, nome, sobrenome, celular, email, senha):
        super().__init__(nome, sobrenome, celular, email, senha, tipo_acesso='financeiro')

    def to_dict(self):
        return {
            'id': self.id,
            'tipo_acesso': self.tipo_acesso,
            'nome': self.nome,
            'sobrenome': self.sobrenome,
            'celular': self.celular,
            'email': self.email
        }

    @classmethod
    def listar_contas_liberadas(cls):
        return ContaAPagar.query.filter_by(status='aprovado').all()

    @classmethod
    def dar_baixa(cls, conta_id, comprovante):
        conta = ContaAPagar.query.get(conta_id)
        if conta and conta.status == 'aprovado':
            conta.status = 'pago'
            conta.comprovante_pagamento = comprovante  # Anexa o comprovante
            db.session.commit()
            return True, 'Pagamento confimado com sucesso'
        return False, 'Conta não aprovada ou não encontrada'