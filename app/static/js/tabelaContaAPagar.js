import AlertaJs from "./alertaJs.js";
import openModalDetalhesConta from "./modalDetalhesConta.js";
let gTipoAcesso = "";
document.addEventListener('DOMContentLoaded', async () => {
    const tipoAcesso = document.getElementById('tipo-acesso').textContent;
    if (tipoAcesso) {
        apresentarListaContas(tipoAcesso);
        gTipoAcesso = tipoAcesso;
    }
});
async function apresentarListaContas(tipoAcesso) {
    const lista = await fetchContasAPagar();
    await populateTableContas(lista, tipoAcesso);
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
async function populateTableContas(listacontas, tipoAcesso) {
    const tbody = document.querySelector('tbody');
    if (tbody) {
        if (listacontas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nenhuma conta a pagar encontrada.</td></tr>';
            return;
        }
        else {
            const rows = listacontas.map(conta => {
                let buttons = '';
                if (tipoAcesso.trim() === 'admin' && conta.status.trim() === 'pendente') {
                    buttons += `<button class="btn btn-outline-secondary btn-sm btn-aprovar" data-id-conta="${conta.id}"> Aprovar </button>`;
                }
                if (tipoAcesso.trim() === 'financeiro' && conta.status.trim() === 'aprovado') {
                    buttons += `<button class="btn btn-outline-secondary btn-sm btn-pago" data-id-conta="${conta.id}"> Confirmar Pagamento </button>`;
                }
                return `
                    <tr>
                        <td>${conta.numero_nota}</td>
                        <td>${conta.valor.toFixed(2)}</td>
                        <td>${conta.forma_pagamento}</td>
                        <td>${new Date(conta.vencimento).toLocaleDateString()}</td>
                        <td>
                            ${conta.status.trim() === 'pendente' ? `<span class="badge bg-warning">Pendente</span>` :
                    conta.status.trim() === 'pago' ? '<span class="badge bg-primary">Pago</span>' :
                        `<span class="badge bg-success">Aprovado</span>`}
                        </td>
                        <td>
                            <button class="btn btn-primary btn-sm btn-detalhes-conta" data-id-conta="${conta.id}"> Detalhes </button>
                            ${buttons}
                        </td>
                    </tr>
                `;
            }).join('');
            tbody.innerHTML = rows;
        }
    }
    const btnsAprovar = document.querySelectorAll('.btn-aprovar');
    btnsAprovar.forEach(btnAprovar => {
        btnAprovar.addEventListener('click', () => {
            const idConta = btnAprovar.getAttribute('data-id-conta');
            if (idConta) {
                atualizarStatus(Number(idConta), 'aprovado');
            }
        });
    });
    const btnsPago = document.querySelectorAll('.btn-pago');
    btnsPago.forEach(btnPago => {
        btnPago.addEventListener('click', () => {
            const idConta = btnPago.getAttribute('data-id-conta');
            if (idConta) {
                atualizarStatus(Number(idConta), 'pago');
            }
        });
    });
    const btnsDetalhe = document.querySelectorAll('.btn-detalhes-conta');
    btnsDetalhe.forEach(btnDetalhe => {
        btnDetalhe.addEventListener('click', () => {
            const idConta = btnDetalhe.getAttribute('data-id-conta');
            if (idConta) {
                detalhesConta(Number(idConta));
            }
        });
    });
}
export async function atualizarStatus(id, status) {
    fetch(`/api/conta-a-pagar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status }),
    })
        .then(response => {
        if (!response.ok) {
            AlertaJs.showAlert('Não foi possível atualizar o status da conta', 'danger');
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        AlertaJs.showAlert('Status da conta atualizado com sucesso', 'success');
        apresentarListaContas(gTipoAcesso);
        return response.json();
    });
}
async function detalhesConta(id) {
    const response = await fetch(`/api/conta-a-pagar/${id});`);
    if (!response.ok) {
        AlertaJs.showAlert('Não foi possível carregar a conta a pagar', 'danger');
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const conta = await response.json();
    openModalDetalhesConta(conta);
}
