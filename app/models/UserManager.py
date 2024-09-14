from app import db
from .user import User
class UserManager:
    @classmethod
    def get_users(cls):
        users = User.query.all()
        result = []
        for user in users:
            user_dict = user.to_dict()
            result.append(user_dict)
        return result
    
    @classmethod
    def delete_user(cls, user_id):
        user = User.query.get(user_id)
        if not user:
            return 'Usuário não encontrado'
        db.session.delete(user)
        db.session.commit()
        return True, 'Usuário excluído com sucesso'

    @classmethod
    def update_user(cls, user_id, data):
        user = User.query.get(user_id)
        if not user:
            return None, 'Usuário não encontrado'
        
        if 'email' in data and User.query.filter_by(email=data['email']).first():
            return None, 'Email já cadastrado'

        try:
            allowed_updates = ['nome', 'sobrenome', 'celular', 'email', 'tipo_acesso', 'id_empresa']
            for key in allowed_updates:
                if key in data:
                    setattr(user, key, data[key])
            
            if 'senha' in data:
                user.secret_senha = data['password']

            db.session.commit()
            return True, 'Usuário atualizado com sucesso'
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @classmethod
    def add_user(cls, data):
        tipo_acesso = data.get('tipoAcesso')
        if tipo_acesso not in ['admin', 'financeiro', 'gerente']:
            return None, 'Tipo de acesso inválido'

        if User.query.filter_by(email=data.get('email')).first():
            return None, 'Email já cadastrado'
        
        id_empresa = data.get('select-empresa') if tipo_acesso == 'gerente' else None

        try:

            user = User(
                tipo_acesso=data['tipoAcesso'],
                nome=data['nome'],
                sobrenome=data['sobrenome'],
                celular=data['celular'],
                email=data['email'],
                senha=data['password'],
                id_empresa=id_empresa
            )
            db.session.add(user)
            db.session.commit()
            return True, 'Usuário criado com sucesso'
        except Exception as e:
            db.session.rollback()
            return None, str(e)
