import { apresentarListaContas } from "./tabelaContaAPagar.js";
import AlertaJs from "./alertaJs.js";
export default function openModalDetalhesConta(conta, id, tipoAcesso) {
    const modal = new bootstrap.Modal(document.getElementById('modalDetalhesConta'));
    populateDetalhesConta(conta, id, tipoAcesso);
    modal.show();
}
function populateDetalhesConta(conta, id, tipoAcesso) {
    const contaEntries = Object.entries(conta);
    contaEntries.forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
                const element = document.getElementById(`${key}`);
                if (element) {
                    element.innerHTML = formatValue(key, value, id);
                }
            }
            else {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    const subElement = document.getElementById(`${subKey}`);
                    if (subElement && subValue !== null) {
                        subElement.innerHTML = formatValue(subKey, subValue, id);
                    }
                });
            }
        }
        else {
            const element = document.getElementById(`${key}`);
            if (element) {
                element.innerHTML = formatValue(key, value, id);
            }
        }
    });
    validarFormComprovante(tipoAcesso);
    tratarSubmissaoForm(tipoAcesso, conta);
}
function formatValue(key, value, id) {
    console.info(key);
    if (key === 'vencimento') {
        return new Date(value).toLocaleDateString('pt-BR');
    }
    if (key === 'valor') {
        return `R$ ${value.toFixed(2)}`;
    }
    if (key === 'url_nota_fiscal') {
        let lista_urls = '';
        console.info(value);
        const baseUrl = '/uploads/notas_fiscais_uploads';
        value.forEach((url) => {
            const normalizedPath = encodeURIComponent(url['caminho'].replace(/\\/g, '/').replace(/\.\.\//g, ''));
            lista_urls += `<a href="${baseUrl}/${normalizedPath}" target="_blank">Nota</a>` + '<br>';
        });
        return lista_urls;
    }
    if (key === 'url_comprovante_pagamento') {
        const baseUrl = '/uploads/comprovantes_pagamentos_uploads';
        const normalizedPath = value.replace(/\\/g, '/');
        return `<a href="${baseUrl}/${normalizedPath}" target="_blank">Visualizar Comprovante</a>`;
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
function validarFormComprovante(tipoAcesso) {
    const form = document.getElementById('form-comprovante');
    if (form) {
        if (tipoAcesso.trim() === 'financeiro') {
            form.style.display = 'block';
        }
        else {
            form.style.display = 'none';
        }
    }
}
function tratarSubmissaoForm(tipoAcesso, conta) {
    const modalFooter = document.querySelector('.modal-footer');
    if (modalFooter) {
        modalFooter.innerHTML = "";
        const button = generateActionButtons(tipoAcesso, conta);
        const btnFechar = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>`;
        const controles = button + btnFechar;
        modalFooter.insertAdjacentHTML('beforeend', controles);
        if (tipoAcesso.trim() === 'financeiro') {
            actionSubmitButton('confirm-pago-sim', 'pago', tipoAcesso);
        }
        else if (tipoAcesso.trim() === 'admin') {
            actionSubmitButton('confirm-aprovar-sim', 'aprovado', tipoAcesso);
        }
    }
}
export function actionSubmitButton(className, status, tipoAcesso) {
    const btns = document.querySelectorAll(`.${className}`);
    btns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const idConta = btn.getAttribute('data-id-conta');
            if (idConta) {
                if (tipoAcesso.trim() === 'admin') {
                    atualizarStatus(Number(idConta), status, tipoAcesso);
                }
                if (tipoAcesso.trim() === 'financeiro') {
                    const comprovante = await enviarComprovante();
                    const observacao = pegarObs();
                    if (comprovante) {
                        atualizarStatus(Number(idConta), status, tipoAcesso, comprovante, observacao);
                    }
                }
            }
        });
    });
}
export async function atualizarStatus(id, status, tipoAcesso, comprovante = "", observacao = "") {
    let obj_json = {
        status: status,
        url_comprovante_pagamento: comprovante,
        observacao: observacao
    };
    fetch(`/api/conta-a-pagar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj_json),
    })
        .then(response => {
        if (!response.ok) {
            AlertaJs.showAlert('Não foi possível atualizar o status da conta', 'danger');
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        AlertaJs.showAlert('Status da conta atualizado com sucesso', 'success');
        apresentarListaContas(tipoAcesso);
        return response.json();
    });
}
export function generateActionButtons(tipoAcesso, conta) {
    let buttons = '';
    // Verifica o tipo de acesso e o status da conta
    if (tipoAcesso.trim() === 'admin' && conta.status.trim() === 'pendente') {
        buttons = `
        <div class="area-btn-aprovar">
            <div class="btn-group">
                <button type="button" class="btn btn-outline-success dropdown-toggle confir-acao" data-bs-toggle="dropdown" aria-expanded="false">
                    Aprovar
                </button>
                <ul class="dropdown-menu p-3">
                    <li class="text-center mb-2">Quer mesmo confirmar esse pagamento?</li>
                    <li class="text-center">
                        <button class="btn btn-sm btn-success me-2 confirm-aprovar-sim" data-id-conta="${conta.id}">SIM</button>
                        <button type="button" class="btn btn-sm btn-secondary">NÃO</button>
                    </li>
                </ul>
            </div>
        </div>`;
    }
    else if (tipoAcesso.trim() === 'financeiro' && conta.status.trim() === 'aprovado') {
        buttons = `
        <div class="area-btn-pago">
            <div class="btn-group">
                <button type="button" class="btn btn-outline-success dropdown-toggle confir-acao" data-bs-toggle="dropdown" aria-expanded="false">
                    Pago
                </button>
                <ul class="dropdown-menu p-3">
                    <li class="text-center mb-2">Quer mesmo confirmar o pagamento desta conta?</li>
                    <li class="text-center">
                        <button class="btn btn-sm btn-success me-2 confirm-pago-sim" data-id-conta="${conta.id}">SIM</button>
                        <button type="button" class="btn btn-sm btn-secondary">NÃO</button>
                    </li>
                </ul>
            </div>
        </div>`;
    }
    return buttons;
}
async function enviarComprovante() {
    const input = document.querySelector('#input-comprovante');
    if (input && input.files !== null && input.files.length > 0) {
        const formData = new FormData();
        formData.append('imagem', input.files[0]);
        try {
            const response = await fetch('/api/conta-a-pagar/imagem-comprovante-pagamento', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
            }
            const result = await response.json();
            return result.caminho;
        }
        catch (error) {
            console.error('Erro ao enviar o comprovante:', error);
            AlertaJs.showAlert(`Erro ao enviar o comprovante: ${error.message}`, 'danger');
            return '';
        }
    }
    else {
        AlertaJs.showAlert('Por favor, adicione um comprovante para enviar', 'info');
        return '';
    }
}
function pegarObs() {
    return document.getElementById('observacao').value;
}
