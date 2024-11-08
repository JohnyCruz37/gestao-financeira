import AlertaJs from "./alertaJs.js";
import openModalDetalhesConta from "./modalDetalhesConta.js";
import { formatarData, verificarVencimento } from "./utils.js";
document.addEventListener('DOMContentLoaded', async () => {
    const tipoAcesso = document.getElementById('tipo-acesso').textContent;
    if (tipoAcesso) {
        apresentarListaContas(tipoAcesso);
    }
});
export async function apresentarListaContas(tipoAcesso) {
    const lista = await fetchContasAPagar();
    const tbody = document.getElementById('tbody-contas-a-pagar');
    if (tbody && tbody !== null) {
        await populateTableContas(tbody, lista, tipoAcesso);
    }
}
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
export async function populateTableContas(tbody, listacontas, tipoAcesso) {
    if (tbody) {
        if (listacontas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nenhuma conta a pagar encontrada.</td></tr>';
            return;
        }
        else {
            const rows = listacontas.map(conta => {
                return `
                    <tr>
                        <td>${conta.numero_nota}</td>
                        <td>${conta.valor.toFixed(2)}</td>
                        <td>${conta.forma_pagamento}</td>
                        <td>
                            ${verificarVencimento(conta.vencimento) ? `<span class="badge bg-danger">${formatarData(conta.vencimento)}</span>` : formatarData(conta.vencimento)}
                        </td>
                        <td>
                            ${conta.status.trim() === 'pendente' ? `<span class="badge bg-warning">Pendente</span>` :
                    conta.status.trim() === 'pago' ? '<span class="badge bg-primary">Pago</span>' :
                        `<span class="badge bg-success">Aprovado</span>`}
                        </td>
                        <td class="d-flex">
                            <button class="btn btn-primary btn-sm btn-detalhes-conta" data-id-conta="${conta.id}"> Detalhes </button>
                        </td>
                    </tr>
                `;
            }).join('');
            tbody.innerHTML = rows;
        }
    }
    const btnsDetalhe = document.querySelectorAll('.btn-detalhes-conta');
    btnsDetalhe.forEach(btnDetalhe => {
        btnDetalhe.addEventListener('click', () => {
            const idConta = btnDetalhe.getAttribute('data-id-conta');
            if (idConta) {
                detalhesConta(Number(idConta), tipoAcesso);
            }
        });
    });
}
export async function detalhesConta(id, tipoAcesso) {
    const response = await fetch(`/api/conta-a-pagar/${id});`);
    if (!response.ok) {
        AlertaJs.showAlert('Não foi possível carregar a conta a pagar', 'danger');
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const conta = await response.json();
    openModalDetalhesConta(conta, id, tipoAcesso);
}
