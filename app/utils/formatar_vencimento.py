# formatar data '10/10/2022' para '2022-10-10'

def formatar_data(data):
    dia, mes, ano = data.split('/')
    return f'{ano}-{int(mes):02d}-{int(dia):02d}'

