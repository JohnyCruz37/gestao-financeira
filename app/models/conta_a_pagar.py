import os
from werkzeug.utils import secure_filename
from flask import current_app
from app import db
class ContaAPagar(db.Model):
    __tablename__ = 'contas_a_pagar'
    id = db.Column(db.Integer, primary_key=True)
    numero_nota = db.Column(db.String(20), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    fornecedor = db.Column(db.String(100), nullable=False)
    vencimento = db.Column(db.Date, nullable=False)
    forma_pagamento = db.Column(db.String(50), nullable=False)
    url_comprovante_pagamento = db.Column(db.String(200), nullable=True)
    url_nota_fiscal = db.Column(db.String(200), nullable=False)
    id_empresa = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=False)  
    id_gerente = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  

    status = db.Column(db.String(20), default='pendente')
    comprovante = db.Column(db.String(200), nullable=True)

    def __repr__(self):
        return f'<ContaAPagar {self.numero_nota} - Status {self.status}>'

    def to_dict(self):
        return {
            'id': self.id,
            'id_gerente': self.id_gerente,
            'id_empresa': self.id_empresa,
            'numero_nota': self.numero_nota,
            'valor': self.valor,
            'fornecedor': self.fornecedor,
            'vencimento': self.vencimento,
            'forma_pagamento': self.forma_pagamento,
            'status': self.status,
            'comprovante_pagamento': self.comprovante_pagamento,
            'url_nota_fiscal': self.url_nota_fiscal,
            'url_comprovante_pagamento': self.comprovante_pagamento if self.comprovante_pagamento else None,
        }

    def post_image_nota(file, gerente_id, empresa_id):
        diretorio = os.path.join(current_app.config['UPLOAD_FOLDER'], 'notas_fiscais_uploads', str(gerente_id), str(empresa_id))

        if not os.path.exists(diretorio):
            os.makedirs(diretorio)
        
        filename = secure_filename(file.filename)
        caminho_completo = os.path.join(diretorio, filename)

        file.save(caminho_completo)

        return os.path.relpath(caminho_completo, current_app.config['UPLOAD_FOLDER'])
    
    @staticmethod
    def add_conta(**kwargs):
        lista_obrigatorios = ['numero_nota', 'valor', 'fornecedor', 'vencimento', 'forma_pagamento', 'url_nota_fiscal', 'id_empresa', 'id_gerente']
        for campo in lista_obrigatorios:
            if campo not in kwargs:
                raise ValueError(f'O campo {campo} é obrigatório')
        
        nova_conta = ContaAPagar(**kwargs)
        try:
            db.session.add(nova_conta)
            db.session.commit()
            return True, 'Conta adicionada com sucesso'
        except Exception as e:
            db.session.rollback()
            return False, str(e)
