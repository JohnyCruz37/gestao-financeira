export function openModalUsuarios(user) {
    const form = document.getElementById('form-usuario-edicao');
    populateFormUsuarioEdicao(form, user);
    const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
    modal.show();
    const btnEditar = form.querySelector('#btn-editar-usuario');
    const btnSalvar = form.querySelector('#btn-salvar-usuario');
    btnEditar.removeEventListener('click', () => habilitarForm(form, btnSalvar));
    btnSalvar.removeEventListener('click', () => salvarEdicaoUsuario(user, form, btnSalvar));
    btnEditar.addEventListener('click', () => habilitarForm(form, btnSalvar));
    btnSalvar.addEventListener('click', () => salvarEdicaoUsuario(user, form, btnSalvar));
    document.getElementById('modalUsuario').addEventListener('hidden.bs.modal', () => resetarForm(form, btnSalvar, user));
}
function populateFormUsuarioEdicao(form, user) {
    form.querySelector('#id').value = user.id.toString();
    form.querySelector('#nome').value = user.nome;
    form.querySelector('#sobrenome').value = user.sobrenome;
    form.querySelector('#email').value = user.email;
    form.querySelector('#celular').value = user.celular;
    form.querySelector('#tipo-acesso').value = user.tipo_acesso;
    form.querySelector('#empresa').value = user.empresa?.razao_social || '';
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
function resetarForm(form, btn, user) {
    btn.removeEventListener('click', () => salvarEdicaoUsuario(user, form, btn));
    desabilitarForm(form, btn);
    form.reset();
}
function salvarEdicaoUsuario(user, form, btn) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const updatedUser = {
        ...user,
        ...data,
    };
    fetchSalvarEdicaoUsuario(updatedUser);
    desabilitarForm(form, btn);
}
function fetchSalvarEdicaoUsuario(updatedUser) {
    console.info(`Novos dados para o usuário ${updatedUser.id}`);
}
