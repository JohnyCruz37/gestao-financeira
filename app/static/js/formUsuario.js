import AlertaJs from "./alertaJs.js";
import populateTableEmpresasGerentes from "./populateTableEmpresasGerentes.js";
import ValidadorInput from "./validadorInputs.js";
import validarCampo from "./validarCampo.js";
export default function configurarFormUsuario() {
    const form = document.getElementById('usuarioForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const listInput = ['nome', 'sobrenome', 'email', 'celular', 'password'];
        listInput.forEach((inputId) => {
            monitorarInputs(form, inputId);
        });
        const password = form.querySelector('#password');
        const confimPassword = form.querySelector('#password-confirm');
        const confirmFeedback = form.querySelector('#password-confirmFeedback');
        if (!compararInputsPassword(password, confimPassword, confirmFeedback)) {
            return;
        }
        else {
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
    const btnToogleSenha = document.getElementById("togglePassword-password");
    btnToogleSenha.addEventListener("click", function () {
        const inputSenha = document.getElementById("password");
        inputSenha.type = inputSenha.type === "password" ? "text" : "password";
    });
    const btnToogleSenhaConf = document.getElementById("togglePassword-password-confirm");
    btnToogleSenhaConf.addEventListener("click", function () {
        const inputSenha = document.getElementById("password-confirm");
        inputSenha.type = inputSenha.type === "password" ? "text" : "password";
    });
}
export function monitorarInputs(form, id) {
    const input = form.querySelector(`#${id}`);
    const inputFeedback = form.querySelector(`#${id}Feedback`);
    if (input && inputFeedback) {
        const validaInput = new ValidadorInput(input);
        validarCampo(input, validaInput, inputFeedback);
    }
}
function compararInputsPassword(valorPassword, valorConfirmPassword, confirmInput) {
    if (valorPassword.value !== valorConfirmPassword.value) {
        valorPassword.classList.add('is-invalid');
        valorConfirmPassword.classList.add('is-invalid');
        confirmInput.textContent = "Senha e confirmação de senha não coincidem";
        confirmInput.style.display = 'block';
        return false;
    }
    else {
        valorConfirmPassword.classList.remove('is-invalid');
        valorPassword.classList.remove('is-invalid');
        confirmInput.style.display = 'none';
        return true;
    }
}
