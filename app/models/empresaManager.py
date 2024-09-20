from app import db
from .empresa import Empresa
class EmpresaManager:
    @classmethod
    def get_empresas(cls):
        return [empresa.to_dict() for empresa in Empresa.query.all()]

    @classmethod
    def delete_empresa(cls, id_empresa):
        empresa = Empresa.query.get(id_empresa)
        if not empresa:
            return None, 'Empresa não encontrada'
        
        db.session.delete(empresa)
        db.session.commit()
        return True, 'Empresa deletada com sucesso'
    
    @classmethod
    def add_empresa(cls, data):
        if Empresa.cnpj_existe(data['cnpj']):
            return None, 'CNPJ já cadastrado'
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
    def get_empresa_by_id(cls, id_empresa):
        empresa = Empresa.query.get(id_empresa)
        if not empresa:
            return None, 'Empresa não encontrada'
        return empresa.to_dict()

    @classmethod
    def update_empresa(cls, id_empresa, data):
        empresa = Empresa.query.get(id_empresa)
        if not empresa:
            return None, 'Empresa não encontrada'
        
        # Atualizar os campos permitidos
        allowed_updates = ['razao_social']
        for key, value in data.items():
            if key in allowed_updates:
                setattr(empresa, key, value)

        db.session.commit()
        return empresa.to_dict(), 'Empresa atualizada com sucesso'