from app import db
class ContaAPagar(db.Model):
    __tablename__ = 'contas_a_pagar'
    id = db.Column(db.Integer, primary_key=True)
    numero_nota = db.Column(db.String(20), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    fornecedor = db.Column(db.String(100), nullable=False)
    vencimento = db.Column(db.Date, nullable=False)
    forma_pagamento = db.Column(db.String(50), nullable=False)
    id_empresa = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=False)  
    id_gerente = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  

    status = db.Column(db.String(20), default='pendente') 
    comprovante = db.Column(db.String(200), nullable=True)


    def __repr__(self):
        return f'<ContaAPagar {self.numero_nota} - Status {self.status}>'

    def to_dict(self):
        return {
            'id': self.id,
            'numero_nota': self.numero_nota,
            'valor': self.valor,
            'fornecedor': self.fornecedor,
            'vencimento': self.vencimento,
            'forma_pagamento': self.forma_pagamento,
            'status': self.status,
            'comprovante_pagamento': self.comprovante_pagamento
        }
