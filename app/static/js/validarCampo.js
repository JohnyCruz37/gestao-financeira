export default function validarCampo(inputElement, validador, feedbackElement) {
    if (!validador.validar()) {
        inputElement.classList.add('is-invalid');
        feedbackElement.textContent = validador.getMensagemErro();
        feedbackElement.style.display = 'block';
    }
    else {
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
        feedbackElement.style.display = 'none';
    }
}
