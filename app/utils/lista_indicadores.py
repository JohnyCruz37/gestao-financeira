from app.models.contasManager import ContasManager

def lista_indicadores(empresas):
    indicadores = []
    for empresa in empresas:
        id = empresa.get('id')
        contas = ContasManager.get_contas_id_empresa(id)
        if len(contas) > 0:
            total = somar_contas(contas)
            empresa_dict = {
                'razao_social': empresa.get('razao_social'),
                'valor': total
            }
            indicadores.append(empresa_dict)
        else:
            empresa_dict = {
                'razao_social': empresa.get('razao_social'),
                'valor': 0
            }
            indicadores.append(empresa_dict)
    
    return indicadores

def somar_contas(contas):
    lista_contas = selecionar_contas(contas)

    total = 0
    for conta in lista_contas:
        total += conta.valor
    
    return total

def selecionar_contas(contas):
    lista = []
    for conta in contas:
        if conta.status != 'pago':
            lista.append(conta)

    return lista