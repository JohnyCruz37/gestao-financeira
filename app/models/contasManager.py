from app import db
from .conta_a_pagar import ContaAPagar
class ContasManager:
    @classmethod
    def filtrar_contas_por_empresa(cls, empresa_id):
        return ContaAPagar.query.filter_by(empresa_id=empresa_id).all()

    @classmethod
    def aprovar_conta(cls, conta_id):
        conta = ContaAPagar.query.get(conta_id)
        if conta and conta.status == 'pendente':
            conta.status = 'aprovado'
            db.session.commit()
            return True, 'Conta aprovada com sucesso'
        return False, 'Conta não encontrada ou já aprovada'

    def visualizar_contas_pagamento(cls):
        return ContaAPagar.query.filter_by(status='pago').all()