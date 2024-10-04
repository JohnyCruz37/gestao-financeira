export function habilitarForm(form, btn) {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach((input) => {
        if (input.id !== 'id') {
            if (input.id !== 'cnpj') {
                if (input.id !== 'tipoAcesso') {
                    input.disabled = false;
                }
            }
        }
    });
    btn.style.display = 'block';
}
export function desabilitarForm(form, btn) {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.id !== 'id') {
            input.disabled = true;
        }
    });
    btn.style.display = 'none';
}
export function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}
export function verificarVencimento(dataISO) {
    const hoje = new Date();
    const vencimento = new Date(dataISO);
    hoje.setHours(0, 0, 0, 0);
    return vencimento <= hoje;
}
export function createEditButton(key, id) {
    return `<button type="button" class="btn btn-warning" data-key="${key}" data-id-conta="${id}">
                <i class="bi bi-pencil-square"></i>
            </button>`;
}
