class ValidadorInput {
    constructor(input) {
        this.validador = null;
        this.inputElement = input;
        this.inicializarValidador();
    }
    inicializarValidador() {
        if (this.inputElement.id === 'cnpj') {
            this.validador = new InputCnpj(this.inputElement);
        }
        else if (this.inputElement.id === 'celular') {
            this.validador = new InputCelular(this.inputElement);
        }
    }
    validar() {
        if (this.validador) {
            return this.validador.validar();
        }
        return true;
    }
    getMensagemErro() {
        if (this.validador) {
            return this.validador.getMensagemErro();
        }
        return '';
    }
}
class InputCnpj {
    constructor(input) {
        this.inputElement = input;
        this.aplicarRestricoes();
    }
    aplicarRestricoes() {
        this.inputElement.addEventListener('input', () => {
            let valor = this.inputElement.value;
            valor = valor.replace(/\D/g, '');
            if (valor.length > 14) {
                valor = valor.substring(0, 14);
            }
            this.inputElement.value = valor;
        });
    }
    validar() {
        const valor = this.inputElement.value.replace(/\D/g, '');
        return valor.length === 14;
    }
    getMensagemErro() {
        if (!this.validar()) {
            return 'CNPJ inválido. Deve conter 14 dígitos e apenas números.';
        }
        return '';
    }
}
class InputCelular {
    constructor(input) {
        this.inputElement = input;
        this.aplicarRestricoes();
    }
    aplicarRestricoes() {
        this.inputElement.addEventListener('input', () => {
            let valor = this.inputElement.value;
            valor = valor.replace(/\D/g, '');
            if (valor.length > 11) {
                valor = valor.substring(0, 11);
            }
            this.inputElement.value = valor;
        });
    }
    validar() {
        const valor = this.inputElement.value.replace(/\D/g, '');
        return valor.length === 11;
    }
    getMensagemErro() {
        if (!this.validar()) {
            return 'Número de celular inválido. Deve conter 11 dígitos.';
        }
        return '';
    }
}
export default ValidadorInput;
