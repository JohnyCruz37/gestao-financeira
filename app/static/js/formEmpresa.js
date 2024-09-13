import ValidadorInput from "./validadorInputs.js";
import AlertaJs from "./alertaJs.js";
import validarCampo from "./validarCampo.js";
import { populateSelect, populateTableEmpresas } from "./populateEmpresas.js";
export default function configurarFormEmpresa() {
    document.getElementById('empresaForm')?.addEventListener('submit', function (event) {
        event.preventDefault();
        const cnpjInput = document.getElementById('cnpj');
        const validadorCnpj = new ValidadorInput(cnpjInput);
        const cnpjFeedback = document.getElementById('cnpjFeedback');
        validarCampo(cnpjInput, validadorCnpj, cnpjFeedback);
        // Validar como Razão Social
        const razaoSocialInput = document.getElementById('razao-social');
        const razaoSocialFeedback = document.getElementById('razaoSocialFeedback');
        if (razaoSocialInput.value.trim() === '') {
            razaoSocialInput.classList.add('is-invalid');
            razaoSocialFeedback.textContent = 'Por favor, insira a razão social.';
            razaoSocialFeedback.style.display = 'block';
        }
        else {
            razaoSocialInput.classList.remove('is-invalid');
            razaoSocialInput.classList.add('is-valid');
            razaoSocialFeedback.style.display = 'none';
        }
        if (document.querySelectorAll('.is-invalid').length === 0) {
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            fetch('/api/empresas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json()
                .then(result => ({
                status: response.status,
                body: result
            })))
                .then(({ status, body }) => {
                if (status >= 200 && status < 300) {
                    AlertaJs.showAlert(body.message, 'success');
                    this.reset();
                    populateSelect();
                    populateTableEmpresas('table-empresas');
                }
                else {
                    throw new Error(body.message || 'Erro ao enviar os dados para o servidor');
                }
            })
                .catch((error) => {
                AlertaJs.showAlert(error.message, 'danger');
                console.error('Erro:', error);
            });
        }
    });
}
