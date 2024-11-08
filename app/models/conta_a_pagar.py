import os
from werkzeug.utils import secure_filename
from flask import current_app
from app import db
from app.models.notas_fiscais import NotasFiscais
class ContaAPagar(db.Model):
    __tablename__ = 'contas_a_pagar'
    id = db.Column(db.Integer, primary_key=True)
    id_gerente = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    id_empresa = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=False)
    numero_nota = db.Column(db.String(20), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    fornecedor = db.Column(db.String(100), nullable=False)
    vencimento = db.Column(db.Date, nullable=False)
    forma_pagamento = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='pendente')
    url_comprovante_pagamento = db.Column(db.String(200), nullable=True)
    observacoes = db.Column(db.String(200), nullable=True)


    def __repr__(self):
        return f'<ContaAPagar {self.numero_nota} - Status {self.status}>'

    def to_dict(self):
        conta_dict = {
            'id': self.id,
            'id_gerente': self.id_gerente,
            'id_empresa': self.id_empresa,
            'numero_nota': self.numero_nota,
            'valor': self.valor,
            'fornecedor': self.fornecedor,
            'vencimento': self.vencimento.strftime('%Y-%m-%d'),
            'forma_pagamento': self.forma_pagamento,
            'status': self.status,
        }

        if self.url_comprovante_pagamento:
            conta_dict['url_comprovante_pagamento'] = self.url_comprovante_pagamento
        if self.observacoes:
            conta_dict['observacoes'] = self.observacoes

        notas = NotasFiscais.query.filter_by(id_conta=self.id).all()
        notas_fiscais = [{'caminho': nf.caminho_imagem, 'id_conta': nf.id_conta} for nf in notas]
        conta_dict['url_nota_fiscal'] = notas_fiscais

        return conta_dict

    def post_image_nota(file, gerente_id, empresa_id):
        return NotasFiscais.post_image_nota(file, gerente_id, empresa_id)

    def post_image_comprovante(file, financeiro_id):
        diretorio = os.path.join(current_app.config['UPLOAD_FOLDER_COMPROVANTES'], 'comprovantes_pagamentos_uploads', str(financeiro_id))
        
        if not os.path.exists(diretorio):
            os.makedirs(diretorio)
        
        filename = secure_filename(file.filename)
        caminho_completo = os.path.join(diretorio, filename)

        file.save(caminho_completo)
        return os.path.relpath(caminho_completo, current_app.config['UPLOAD_FOLDER_COMPROVANTES'])

    @staticmethod
    def add_conta(url_nota_fiscal, **kwargs):
        lista_obrigatorios = ['id_gerente', 'id_empresa', 'numero_nota', 'valor', 'fornecedor', 'vencimento', 'forma_pagamento' ]
        for campo in lista_obrigatorios:
            if campo not in kwargs:
                raise ValueError(f'O campo {campo} é obrigatório')
        
        nova_conta = ContaAPagar(**kwargs)
        try:
            db.session.add(nova_conta)
            db.session.commit()

            if url_nota_fiscal is not None and url_nota_fiscal!= '':
                NotasFiscais.add_caminhos_imagens(url_nota_fiscal, nova_conta.id)

            return True, 'Conta adicionada com sucesso'
        except Exception as e:
            db.session.rollback()
            return False, str(e)
    
    @staticmethod
    def update_conta(conta_id, **kwargs):
        if 'status' in kwargs and kwargs['status'] == 'aprovado':
            kwargs['url_comprovante_pagamento'] = ContaAPagar.post_image_nota(kwargs.get('comprovante_pagamento'), kwargs['id_gerente'], kwargs['id_empresa'])
        
        try:
            conta = ContaAPagar.query.get(conta_id)
            if not conta:
                return False, 'Conta não encontrada'
            
            for key, value in kwargs.items():
                setattr(conta, key, value)
            
            db.session.commit()
            return True, 'Conta atualizada com sucesso'
        except Exception as e:
            db.session.rollback()
            return False, str(e)
    
    @staticmethod
    def delete_conta(conta_id):
        try:
            conta = ContaAPagar.query.get(conta_id)
            if not conta:
                return False, 'Conta não encontrada'
            
            db.session.delete(conta)
            db.session.commit()
            return True, 'Conta excluída com sucesso'
        except Exception as e:
            db.session.rollback()
            return False, str(e)