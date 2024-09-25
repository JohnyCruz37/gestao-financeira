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
        else if (this.inputElement.id === 'nome' || this.inputElement.id === 'sobrenome' || this.inputElement.id === 'razao-social') {
            this.validador = new InputNomeSobrenome(this.inputElement);
        }
        else if (this.inputElement.id === 'email') {
            this.validador = new InputEmail(this.inputElement);
        }
        else if (this.inputElement.id === 'senha' || this.inputElement.id === 'password') {
            this.validador = new InputSenha(this.inputElement);
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
class InputNomeSobrenome {
    constructor(input) {
        this.inputElement = input;
        this.aplicarRestricoes();
    }
    aplicarRestricoes() {
        this.inputElement.addEventListener('input', () => {
            let valor = this.inputElement.value;
            valor = valor.trim();
            if (valor === '' || valor.length < 3 || valor.endsWith(' ')) {
                this.inputElement.value = valor;
            }
            else {
                this.inputElement.value = valor;
            }
        });
    }
    validar() {
        const valor = this.inputElement.value.trim();
        return valor.length >= 3 && !valor.endsWith(' ');
    }
    getMensagemErro() {
        if (!this.validar()) {
            return 'Deve conter pelo menos 3 caracteres e não terminar com espaço.';
        }
        return '';
    }
}
class InputEmail {
    constructor(input) {
        this.inputElement = input;
        this.aplicarRestricoes();
    }
    aplicarRestricoes() {
        this.inputElement.addEventListener('input', () => {
            let valor = this.inputElement.value;
            valor = valor.trim();
            if (valor === '' || !/\S+@\S+\.\S+/.test(valor)) {
                this.inputElement.value = valor;
            }
            else {
                this.inputElement.value = valor;
            }
        });
    }
    validar() {
        const valor = this.inputElement.value.trim();
        return /^\S+@\S+\.\S+$/.test(valor);
    }
    getMensagemErro() {
        if (!this.validar()) {
            return 'Deve conter um endereço de email válido.';
        }
        return '';
    }
}
class InputSenha {
    constructor(input) {
        this.inputElement = input;
        this.aplicarRestricoes();
    }
    aplicarRestricoes() {
        this.inputElement.addEventListener('input', () => {
            let valor = this.inputElement.value;
            valor = valor.trim();
            if (valor === '' || !this.validarFormato(valor)) {
                this.inputElement.classList.add('is-invalid');
            }
            else {
                this.inputElement.classList.remove('is-invalid');
            }
        });
    }
    validar() {
        const valor = this.inputElement.value.trim();
        return this.validarFormato(valor);
    }
    getMensagemErro() {
        const valor = this.inputElement.value.trim();
        if (valor === '') {
            return 'A senha é obrigatória.';
        }
        if (valor.length < 8 || valor.length > 20) {
            return 'A senha deve ter entre 8 e 20 caracteres.';
        }
        if (!/[A-Z]/.test(valor)) {
            return 'A senha deve conter ao menos uma letra maiúscula.';
        }
        if (!/[a-z]/.test(valor)) {
            return 'A senha deve conter ao menos uma letra minúscula.';
        }
        if (!/[0-9]/.test(valor)) {
            return 'A senha deve conter ao menos um número.';
        }
        return '';
    }
    validarFormato(valor) {
        const tamanhovalido = valor.length >= 8 && valor.length <= 20;
        const numero = /[0-9]/.test(valor);
        const letraMaiuscula = /[A-Z]/.test(valor);
        const letraMinuscula = /[a-z]/.test(valor);
        return tamanhovalido && numero && letraMaiuscula && letraMinuscula;
    }
}
export default ValidadorInput;
