export default function openModalDetalhesConta(conta) {
    const modal = new bootstrap.Modal(document.getElementById('modalDetalhesConta'));
    populateDetalhesConta(conta);
    modal.show();
}
function populateDetalhesConta(conta) {
    const contaEntries = Object.entries(conta);
    contaEntries.forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([subKey, subValue]) => {
                const subElement = document.getElementById(`${subKey}`);
                if (subElement && subValue !== null) {
                    subElement.innerHTML = formatValue(subKey, subValue);
                }
            });
        }
        else {
            const element = document.getElementById(`${key}`);
            if (element) {
                element.innerHTML = formatValue(key, value);
            }
        }
    });
}
function formatValue(key, value) {
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
