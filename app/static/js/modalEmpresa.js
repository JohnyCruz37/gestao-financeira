import { desabilitarForm } from "./utils.js";
import { habilitarForm } from "./utils.js";
import AlertaJs from "./alertaJs.js";
import { populateTableEmpresas } from "./populateEmpresas.js";
import { monitorarInputs } from "./formUsuario.js";
export function openModalEmpresas(empresa) {
    const form = document.getElementById('form-empresa-edicao');
    populateFormEmpresaEdicao(form, empresa);
    const modalElement = new bootstrap.Modal(document.getElementById('modalEmpresas'));
    modalElement.show();
}
export default function populateFormEmpresaEdicao(form, empresa) {
    form.querySelector('#id').value = empresa.id.toString();
    form.querySelector('#razao-social').value = empresa.razao_social;
    form.querySelector('#cnpj').value = empresa.cnpj;
    form.querySelector('#rua').value = empresa.rua;
    form.querySelector('#numero').value = empresa.numero.toString();
    form.querySelector('#bairro').value = empresa.bairro;
    form.querySelector('#complemento').value = empresa.complemento;
    form.querySelector('#cidade').value = empresa.cidade;
    form.querySelector('#estado').value = empresa.estado;
    form.querySelector('#cep').value = empresa.cep;
    form.querySelector('#celular').value = empresa.celular;
    const btnEditar = form.querySelector('#btn-editar-empresa');
    const btnSalvar = form.querySelector('#btn-salvar-empresa');
    const btnExcluir = form.querySelector('#confirm-excluir-sim-empresa');
    btnEditar.removeEventListener('click', () => habilitarForm(form, btnSalvar));
    btnSalvar.removeEventListener('click', () => salvarEdicaoEmpresa(form, btnSalvar, empresa));
    btnEditar.addEventListener('click', () => habilitarForm(form, btnSalvar));
    btnSalvar.addEventListener('click', () => salvarEdicaoEmpresa(form, btnSalvar, empresa));
    btnExcluir.addEventListener('click', () => fetchExcluirEmpresa(empresa.id));
    document.getElementById('modalEmpresas').addEventListener('hidden.bs.modal', () => resetarForm(form, btnSalvar, empresa)); // não está funcionando
}
function resetarForm(form, btn, empresas) {
    btn.removeEventListener('click', () => salvarEdicaoEmpresa(form, btn, empresas));
    form.reset();
}
function salvarEdicaoEmpresa(form, btn, empresa) {
    monitorarInputs(form, 'razao-social');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const updatedEmpresa = {
        ...empresa,
        razao_social: data.razao_social,
        cnpj: data.cnpj,
        rua: data.rua,
        numero: data.numero,
        bairro: data.bairro,
        complemento: data.complemento,
        cidade: data.cidade,
        estado: data.estado,
        cep: data.cep,
        celular: data.celular,
    };
    if (form.querySelectorAll('.is-invalid').length === 0) {
        console.log(JSON.stringify(updatedEmpresa));
        fetchSalvarEdicaoEmpresa(updatedEmpresa);
        desabilitarForm(form, btn);
    }
}
async function fetchSalvarEdicaoEmpresa(updateEmpresa) {
    try {
        const response = await fetch(`/api/empresas/${updateEmpresa.id.toString()}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateEmpresa)
        });
        const result = await response.json();
        if (response.ok) {
            AlertaJs.showAlert('Empresa atualizada com sucesso!', 'success');
            populateTableEmpresas('table-empresas');
        }
        else {
            AlertaJs.showAlert('Houve um erro ao atualizar a empresa.', 'danger');
        }
    }
    catch (error) {
        console.error('Erro na requisição:', error);
        AlertaJs.showAlert('Houve um erro ao atualizar a empresa.', 'danger');
    }
}
async function fetchExcluirEmpresa(id) {
    try {
        const response = await fetch(`/api/empresas/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        if (response.ok) {
            AlertaJs.showAlert('Empresa excluída com sucesso!', 'success');
            populateTableEmpresas('table-empresas-e-gerentes');
        }
        else {
            console.error('Erro ao excluir o empresa:', result.message);
            AlertaJs.showAlert(result.message, 'danger');
        }
    }
    catch (error) {
        console.error('Erro na requisição:', error);
        AlertaJs.showAlert('Houve um erro ao excluir a empresa.', 'danger');
    }
}
