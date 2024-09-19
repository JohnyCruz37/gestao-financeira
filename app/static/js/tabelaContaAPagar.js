import AlertaJs from "./alertaJs.js";
document.addEventListener('DOMContentLoaded', async () => {
    const lista = await fetchContasAPagar();
    await populateTableContas(lista);
});
async function fetchContasAPagar() {
    try {
        const response = await fetch('/api/conta-a-pagar');
        if (!response.ok) {
            AlertaJs.showAlert('Não foi possível carregar as contas a pagar', 'danger');
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
    catch (error) {
        console.error('Error', error);
        throw error;
    }
}
async function populateTableContas(listacontas) {
    console.info('Número de notas recebidas', listacontas.length);
    const tbody = document.querySelector('tbody'); // Seleciona o corpo da tabela
    if (tbody) {
        if (listacontas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nenhuma conta a pagar encontrada.</td></tr>';
            return;
        }
        else {
            const rows = listacontas.map(conta => `
                <tr>
                    <td>${conta.numero_nota}</td>
                    <td>${conta.valor.toFixed(2)}</td>
                    <td>${conta.forma_pagamento}</td>
                    <td>${new Date(conta.vencimento).toLocaleDateString()}</td>
                    <td>
                        ${conta.status === 'pendente' ? `<span class="text text-warning ">Pendente</span>` :
                conta.status === 'pago' ? '<span class="text text-success">Pago</span>' :
                    '<span class="text text-info">Aprovado</span>'}
                    </td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="verDetalhes(${conta.id})">Detalhes</button>
                        ${conta.status === 'pendente' ?
                `<button class="btn btn-outline-secondary btn-sm" id="btn-aprovar" data-id-conta=${conta.id}>Aprovar</button>` :
                `<a href="${conta.url_comprovante_pagamento}" target="_blank" class="btn btn-success btn-sm">Ver Comprovante</a>`}
                    </td>
                </tr>
            `).join('');
            tbody.innerHTML = rows;
        }
    }
    const btnAprovar = document.getElementById('btn-aprovar');
    if (btnAprovar) {
        btnAprovar.addEventListener('click', () => {
            console.log('Aprovar a conta');
            const idConta = btnAprovar.getAttribute('data-id-conta');
            console.info('ID da conta:', idConta);
        });
    }
}
function atualizarStatus(id) {
    console.log('Ver detalhes da conta:', id);
}
