import { atualizarStatus } from "./tabelaContaAPagar.js";
export default function openModalDetalhesConta(conta, id) {
    const modal = new bootstrap.Modal(document.getElementById('modalDetalhesConta'));
    populateDetalhesConta(conta, id);
    modal.show();
}
function populateDetalhesConta(conta, id) {
    const contaEntries = Object.entries(conta);
    contaEntries.forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([subKey, subValue]) => {
                const subElement = document.getElementById(`${subKey}`);
                if (subElement && subValue !== null) {
                    subElement.innerHTML = formatValue(subKey, subValue, id);
                }
            });
        }
        else {
            const element = document.getElementById(`${key}`);
            if (element) {
                element.innerHTML = formatValue(key, value, id);
            }
        }
    });
    const btnConfim = document.getElementById('confirm-aprovar-modal-sim');
    btnConfim.setAttribute('data-id-conta', `${id}`);
    btnConfim.addEventListener('click', () => {
        const idConta = btnConfim.getAttribute('data-id-conta');
        if (idConta) {
            atualizarStatus(parseInt(idConta), 'aprovado');
        }
    });
}
function formatValue(key, value, id) {
    if (key === 'vencimento') {
        return new Date(value).toLocaleDateString('pt-BR');
    }
    if (key === 'valor') {
        return `R$ ${value.toFixed(2)}`;
    }
    if (key === 'url_nota_fiscal') {
        const baseUrl = '/uploads';
        return `<a href="${baseUrl}/${value.replace(/\\/g, '/')}" target="_blank">Nota Fiscal</a>`;
    }
    if (key === 'status') {
        if (value === 'pendente') {
            return '<span class="badge bg-warning">Pendente</span>';
        }
        else if (value === 'aprovado') {
            return '<span class="badge bg-success">Aprovado</span>';
        }
        else if (value === 'pago') {
            return '<span class="badge bg-primary">Pago</span>';
        }
    }
    return value.toString();
}
