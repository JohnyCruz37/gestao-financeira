import { populateSelect } from "./populateEmpresas.js";
import AlertaJs from "./alertaJs.js";
import populateTableEmpresasGerentes from "./populateTableEmpresasGerentes.js";
export function openModalUsuarios(user, empresas) {
    const form = document.getElementById('form-usuario-edicao');
    populateFormUsuarioEdicao(form, user, empresas);
    const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
    modal.show();
}
async function populateFormUsuarioEdicao(form, user, empresas) {
    form.querySelector('#id').value = user.id.toString();
    form.querySelector('#nome').value = user.nome;
    form.querySelector('#sobrenome').value = user.sobrenome;
    form.querySelector('#email').value = user.email;
    form.querySelector('#celular').value = user.celular;
    const selectTipoAcesso = form.querySelector('#tipoAcesso');
    selectTipoAcesso.value = user.tipo_acesso;
    await populateSelect('select-empresa-modal');
    const selectEmpresa = form.querySelector('#select-empresa-modal');
    if (selectEmpresa) {
        if (user.empresa && !Array.from(selectEmpresa.options).some(option => option.value === user.empresa?.id.toString())) {
            const newOption = document.createElement('option');
            newOption.value = user.empresa.id.toString();
            newOption.text = user.empresa.razao_social;
            selectEmpresa.appendChild(newOption);
        }
        selectEmpresa.value = user.empresa?.id.toString() || '';
    }
    else {
        console.error('Elemento select-empresa não encontrado no formulário.');
    }
    const btnEditar = form.querySelector('#btn-editar-usuario');
    const btnSalvar = form.querySelector('#btn-salvar-usuario');
    btnEditar.removeEventListener('click', () => habilitarForm(form, btnSalvar));
    btnSalvar.removeEventListener('click', () => salvarEdicaoUsuario(user, form, btnSalvar, empresas));
    btnEditar.addEventListener('click', () => habilitarForm(form, btnSalvar));
    btnSalvar.addEventListener('click', () => salvarEdicaoUsuario(user, form, btnSalvar, empresas));
    document.getElementById('modalUsuario').addEventListener('hidden.bs.modal', () => resetarForm(form, btnSalvar, user, empresas));
}
function habilitarForm(form, btn) {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.id !== 'id') {
            input.disabled = false;
        }
    });
    btn.style.display = 'block';
}
function desabilitarForm(form, btn) {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.id !== 'id') {
            input.disabled = true;
        }
    });
    btn.style.display = 'none';
}
function resetarForm(form, btn, user, empresas) {
    btn.removeEventListener('click', () => salvarEdicaoUsuario(user, form, btn, empresas));
    desabilitarForm(form, btn);
    form.reset();
}
function salvarEdicaoUsuario(user, form, btn, empresas) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const updatedUser = {
        ...user,
        nome: data.nome,
        sobrenome: data.sobrenome,
        email: data.email,
        celular: data.celular,
        tipo_acesso: data.tipoAcesso,
    };
    if (updatedUser.tipo_acesso === 'gerente' && data['select-empresa']) {
        const empresaId = parseInt(data['select-empresa']);
        const empresaSelecionada = empresas.find(e => e.id === empresaId);
        if (empresaSelecionada) {
            updatedUser.empresa = empresaSelecionada;
        }
    }
    fetchSalvarEdicaoUsuario(updatedUser);
    desabilitarForm(form, btn);
}
async function fetchSalvarEdicaoUsuario(updatedUser) {
    try {
        const response = await fetch(`/api/users/${updatedUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        });
        const result = await response.json();
        if (response.ok) {
            AlertaJs.showAlert('Usuário atualizado com sucesso!', 'success');
            populateTableEmpresasGerentes('table-empresas-e-gerentes');
        }
        else {
            console.error('Erro ao atualizar o usuário:', result.message);
            AlertaJs.showAlert('Houve um erro ao atualizar o usuário.', 'danger');
        }
    }
    catch (error) {
        console.error('Erro na requisição:', error);
        AlertaJs.showAlert('Houve um erro ao atualizar o usuário.', 'danger');
    }
}
