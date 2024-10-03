import os
from werkzeug.utils import secure_filename
from flask import current_app
from app import db

class NotasFiscais(db.Model):
    __tablename__ = 'notas_fiscais'
    id = db.Column(db.Integer, primary_key=True)
    caminho_imagem = db.Column(db.String(255), nullable=False)
    id_conta = db.Column(db.Integer, db.ForeignKey('contas_a_pagar.id'), nullable=False)

    def __repr__(self):
        return f'<NotaFiscal {self.id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'caminho_imagem': self.caminho_imagem,
            'id_conta': self.id_conta
        }
    
    @staticmethod
    def post_image_nota(file, gerente_id, empresa_id):
        diretorio = os.path.join(current_app.config['UPLOAD_FOLDER'], 'notas_fiscais_uploads', str(empresa_id), str(gerente_id))

        if not os.path.exists(diretorio):
            os.makedirs(diretorio)
        
        filename = secure_filename(file.filename)
        caminho_completo = os.path.join(diretorio, filename)

        file.save(caminho_completo)

        return os.path.relpath(caminho_completo, current_app.config['UPLOAD_FOLDER'])

    def add_caminhos_imagens(caminhos, id_conta):
        for caminho in caminhos:
            nova_imagem = NotasFiscais(
                caminho_imagem=caminho,
                id_conta=id_conta
            )
            db.session.add(nova_imagem)
        db.session.commit()
    
    @classmethod
    def get_notas_fiscais_by_conta(self, id_conta):
        return NotasFiscais.query.filter_by(id_conta=id_conta).all()