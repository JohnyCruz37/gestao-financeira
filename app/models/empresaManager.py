from app import db
from .empresa import Empresa
class EmpresaManager:
    @classmethod
    def get_empresas(cls):
        return [empresa.to_dict() for empresa in Empresa.query.all()]

    @classmethod
    def delete_empresa(cls, empresa_id):
        empresa = cls.query.get(empresa_id)
        if not empresa:
            return None, 'Empresa não encontrada'
        
        db.session.delete(empresa)
        db.session.commit()
        return True, 'Empresa deletada com sucesso'
    
    @classmethod
    def add_empresa(cls, data):
        try:
            empresa = Empresa(
                cnpj=data['cnpj'],
                razao_social=data['razao-social']
            )
            db.session.add(empresa)
            db.session.commit()
            return True, 'Empresa cadastrada com sucesso'
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @classmethod
    def get_empresa_by_id(cls, empresa_id):
        empresa = cls.query.get(empresa_id)
        if not empresa:
            return None, 'Empresa não encontrada'
        return empresa.to_dict(), 'Empresa encontrada'

    @classmethod
    def update_empresa(cls, empresa_id, data):
        empresa = cls.query.get(empresa_id)
        if not empresa:
            return None, 'Empresa não encontrada'
        
        # Verificar se o CNPJ já existe
        if 'cnpj' in data:
            existing_empresa = cls.query.filter_by(cnpj=data['cnpj']).first()
            if existing_empresa and existing_empresa.id != empresa_id:
                return None, 'CNPJ já cadastrado por outra empresa'
        
        # Atualizar os campos permitidos
        allowed_updates = ['cnpj', 'razao_social']
        for key, value in data.items():
            if key in allowed_updates:
                setattr(empresa, key, value)

        db.session.commit()
        return empresa.to_dict(), 'Empresa atualizada com sucesso'