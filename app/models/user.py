from app import db, bcrypt
from flask_login import UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    tipo_acesso = db.Column(db.String(10), nullable=False)
    nome = db.Column(db.String(100), nullable=False)
    sobrenome = db.Column(db.String(100), nullable=False)
    celular = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha_hash = db.Column(db.String(100), nullable=False)
    id_empresa = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=True) # se gerente

    __mapper_args__ = {
        'polymorphic_identity': 'user', 
        'polymorphic_on': tipo_acesso  
    }

    def __init__(self, tipo_acesso, nome, sobrenome, celular, email, senha, id_empresa=None):
        self.tipo_acesso = tipo_acesso
        self.id_empresa = id_empresa
        self.nome = nome
        self.sobrenome = sobrenome
        self.celular = celular
        self.email = email
        self.secret_senha = senha

    @property
    def secret_senha(self):
        raise AttributeError('A propriedade secret_senha é somente para escrita.')
    
    @secret_senha.setter
    def secret_senha(self, senha):
        self.senha_hash = bcrypt.generate_password_hash(senha).decode('utf-8')
    
    def verificar_senha(self, senha_atual):
        return bcrypt.check_password_hash(self.senha_hash, senha_atual)

    def to_dict(self):
        pass
    def get_id(self):
        return self.id
    
    def __repr__(self):
        return f'<User {self.email}>'