import AlertaJs from "./alertaJs.js";
import { createEditButton } from "./utils.js";
export function editarConta() {
    const trs = document.querySelectorAll('.editavel-admin');
    trs.forEach((tr) => {
        const td = tr.querySelector('td');
        const btn = td?.querySelector('button');
        btn?.addEventListener('click', () => {
            const key = btn?.getAttribute('data-key');
            const idConta = btn?.getAttribute('data-id-conta');
            const currentValue = td?.textContent?.trim() || '';
            const inputHtml = `
                <input type="text" class="form-control me-2" value="${currentValue}" />
                <button type="button" class="btn btn-success">
                    <i class="bi bi-floppy-fill"></i>
                </button>
            `;
            td.innerHTML = inputHtml;
            const input = td.querySelector('input');
            const saveButton = td.querySelector('button');
            saveButton.addEventListener('click', () => {
                const newValue = input.value;
                if (key && key !== null && idConta) {
                    const salvo = fetchsalvarEdicaoNota(key, newValue, parseInt(idConta));
                    if (salvo) {
                        td.innerHTML = `${newValue} ${createEditButton(key, parseInt(idConta, 10))}`;
                        editarConta();
                    }
                }
                else {
                    AlertaJs.showAlert('Erro ao salvar', 'danger');
                }
            });
        });
    });
}
async function fetchsalvarEdicaoNota(key, novoValor, idConta) {
    const obj = {};
    obj[key] = novoValor;
    try {
        const response = await fetch(`/api/conta-a-pagar/edicao-admin/${idConta}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        });
        const result = await response.json();
        if (response.ok) {
            AlertaJs.showAlert(result.message, 'success');
            return true;
        }
        else {
            AlertaJs.showAlert(result.message, 'danger');
            return false;
        }
    }
    catch (error) {
        AlertaJs.showAlert('Erro ao salvar a conta', 'danger');
        console.error('Error:', error);
        return false;
    }
}
