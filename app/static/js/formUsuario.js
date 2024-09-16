import AlertaJs from "./alertaJs.js";
import populateTableEmpresasGerentes from "./populateTableEmpresasGerentes.js";
// import ValidadorInput from "./validadorInputs.js";
// import validarCampo from "./validarCampo.js";
export default function configurarFormUsuario() {
    const form = document.getElementById('usuarioForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        // Validar Nome
        // Valiar Sobrenome
        // Validar Senha
        // Validar Celular
        if (form.querySelectorAll('.is-invalid').length === 0) {
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                return response.json().then(data => {
                    return { status: response.status, data };
                });
            })
                .then(({ status, data }) => {
                if (status === 201) {
                    AlertaJs.showAlert(data.message, 'success');
                    this.reset();
                    populateTableEmpresasGerentes('table-empresas-e-gerentes');
                }
                else {
                    throw new Error(data.message || 'Erro ao enviar os dados para o servidor');
                }
            })
                .catch((error) => {
                AlertaJs.showAlert(error.message, 'danger');
                console.error('Erro:', error);
            });
        }
    });
    const handleTipoAcessoChange = () => {
        const tipoAcessoInput = form.querySelector('#tipoAcesso');
        const selectEmpresa = form.querySelector('#select-empresa');
        if (tipoAcessoInput.value === 'gerente') {
            selectEmpresa.disabled = false;
        }
        else {
            selectEmpresa.innerHTML = `<option value="">Selecionar Empresa</option>`;
            selectEmpresa.disabled = true;
        }
    };
    form.querySelector('#tipoAcesso')?.addEventListener('change', handleTipoAcessoChange);
}
