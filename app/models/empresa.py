from app import db

class Empresa(db.Model):
    __tablename__ = 'empresas'
    id = db.Column(db.Integer, primary_key=True)
    cnpj = db.Column(db.String(14), unique=True, nullable=False)
    razao_social = db.Column(db.String(100), nullable=False)

    gerentes = db.relationship('Gerente', backref='empresa', uselist=False, foreign_keys='Gerente.empresa_id')
    contas_a_pagar = db.relationship('ContaAPagar', backref='empresa_rel', lazy='dynamic', foreign_keys='ContaAPagar.id_empresa')

    def __repr__(self):
        return f'<Empresa {self.razao_social}>'

    def to_dict(self):
        return {
            'id': self.id,
            'cnpj': self.cnpj,
            'razao_social': self.razao_social
        }

    
    @classmethod
    def cnpj_existe(cls, cnpj):
        return cls.query.filter_by(cnpj=cnpj).first() is not None
