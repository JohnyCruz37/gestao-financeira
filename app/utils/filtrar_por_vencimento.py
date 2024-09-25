

def filtrar_por_vencimento(contas, vencimento): 
    #vencimento do tipo 2024-09-25
    # conta do tipo lista de objetos ContaAPagar

    lista_contas = []
    for conta in contas:
        conta = conta.to_dict()
        if conta.get('vencimento') <= vencimento:
            lista_contas.append(conta)

    return lista_contas
    