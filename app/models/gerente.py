from app import db
from sqlalchemy.orm import validates
from .user import User
from .empresa import Empresa
class Gerente(User):
    __mapper_args__ = {
        'polymorphic_identity': 'gerente'
    }
    
    def __init__(self, **kwargs):
        kwargs.pop('tipo_acesso', None) # validado fora do objeto
        super().__init__(tipo_acesso='gerente', **kwargs)
    
    contas_a_pagar = db.relationship('ContaAPagar', backref='gerente', lazy=True, foreign_keys='ContaAPagar.id_gerente')

    def __repr__(self):
        return f'<Gerente {self.nome} - Empresa {self.empresa.razao_social}>'
    @validates('id_empresa')
    def validade_empresa(self, key, id_empresa):
        if not id_empresa:
            raise ValueError('O Gerente precisa de uma empresa associada.')
        return id_empresa
    
    def get_empresa_by_id(self, id_empresa):
        if self.id_empresa!= id_empresa:
            return None
        
        return Empresa.query.get(id_empresa).to_dict()
        

    def to_dict(self):
        return {
            'id': self.id,
            'tipo_acesso': self.tipo_acesso,
            'nome': self.nome,
            'sobrenome': self.sobrenome,
            'celular': self.celular,
            'email': self.email,
            'id_empresa': self.id_empresa
        }