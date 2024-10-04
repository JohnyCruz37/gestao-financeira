from app import db
from .conta_a_pagar import ContaAPagar
from .notas_fiscais import NotasFiscais
class ContasManager:

    @classmethod
    def aprovar_conta(cls, conta_id):
        conta = ContaAPagar.query.get(conta_id)
        if conta and conta.status == 'pendente':
            conta.status = 'aprovado'
            db.session.commit()
            return True, 'Conta aprovada com sucesso'
        return False, 'Conta não encontrada ou já aprovada'

    @classmethod
    def dar_baixa(cls, conta_id):
        conta = ContaAPagar.query.get(conta_id)
        if conta and conta.status == 'aprovado':
            conta.status = 'pago'
            db.session.commit()
            return True, 'Pagamento confirmado com sucesso'
        return False, 'Conta não aprovada ou não encontrada'

    @classmethod
    def get_contas_status(cls, status_conta):
        return ContaAPagar.query.filter_by(status=status_conta).all()
    
    @classmethod
    def get_contas_id_gerente(cls, id_gerente):
        return ContaAPagar.query.filter_by(id_gerente=id_gerente).all()
    
    @classmethod
    def get_contas_id_empresa(cls, id_empresa):
        return ContaAPagar.query.filter_by(id_empresa=id_empresa).all()
    
    @classmethod
    def get_conta_by_id(cls, id_conta):
        return ContaAPagar.query.get(id_conta)
    
    @classmethod
    def update_status_conta(cls, conta_id, novo_status):
        conta = ContaAPagar.query.get(conta_id)
        if conta:
            if novo_status not in ['pendente', 'aprovado', 'pago']:
                return False, 'Status inválido'
            conta.status = novo_status
            db.session.commit()
            return True, 'Status atualizado com sucesso'
        return False, 'Conta não encontrada'
    
    @classmethod
    def get_contas_by_vencimento(cls, data_vencimento):
        return ContaAPagar.query.filter_by(vencimento=data_vencimento).all()

    @classmethod
    def update_comprovante_pagamento(cls, conta_id, comprovante_pagamento):
        conta = ContaAPagar.query.get(conta_id)
        if conta:
            conta.url_comprovante_pagamento = comprovante_pagamento
            db.session.commit()
            return True
        return False

    @classmethod
    def update_observacao(cls, conta_id, observacao):
        conta = ContaAPagar.query.get(conta_id)
        if conta:
            conta.observacoes = observacao
            db.session.commit()
            return True
        return False
    
    @classmethod
    def update_informacoes_conta(cls, **kwargs):
        conta = ContaAPagar.query.get(kwargs['id'])
        if conta:
            for key, value in kwargs.items():
                setattr(conta, key, value)
            db.session.commit()
            return True
        return False
