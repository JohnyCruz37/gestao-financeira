export function habilitarForm(form, btn) {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.id !== 'id') {
            if (input.id !== 'cnpj') {
                input.disabled = false;
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
