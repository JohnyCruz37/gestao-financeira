import AlertaJs from "./alertaJs.js";
import ValidadorInput from "./validadorInputs.js";
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('notaForm');
    const btnLimpar = document.getElementById('limparFormulario');
    const inputValor = document.getElementById('valor');
    if (inputValor) {
        new ValidadorInput(inputValor);
    }
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const imgDaNota = document.getElementById('notaFiscal');
        if (!imgDaNota || imgDaNota.files.length === 0) {
            AlertaJs.showAlert('Nenhuma nota fiscal foi selecionada', 'warning');
            return;
        }
        const formData = new FormData();
        formData.append('imagem', imgDaNota.files[0]);
        try {
            const caminhoImagem = await enviarImagemNota(formData);
            const formDataObj = new FormData(this);
            const data = Object.fromEntries(formDataObj.entries());
            const vencicmento = document.getElementById('vencimento').value;
            if (vencicmento && vencicmento.trim() !== '') {
                data['vencimento'] = vencicmento;
            }
            else {
                AlertaJs.showAlert('Vencimento não pode ser vazio', 'warning');
                return;
            }
            const valor = document.getElementById('valor');
            if (valor && valor.value.trim() !== '' && valor !== null) {
                const dataValor = valor.getAttribute('data-valor')?.toString();
                if (dataValor && dataValor !== '') {
                    data['valor'] = dataValor;
                }
            }
            else {
                AlertaJs.showAlert('Valor não pode ser vazio', 'warning');
                return;
            }
            data['url_nota_fiscal'] = caminhoImagem;
            await salvarNota(data);
            AlertaJs.showAlert('Nota salva com sucesso!', 'success');
            form.reset();
        }
        catch (error) {
            AlertaJs.showAlert('Falha ao salvar a nota!', 'danger');
            console.error(error);
        }
    });
    btnLimpar.addEventListener('click', () => {
        form.reset();
    });
});
async function enviarImagemNota(formData) {
    const response = await fetch('/api/conta-a-pagar/imagem-nota-fiscal', {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        throw new Error(`Erro ao enviar imagem: ${response.statusText}`);
    }
    const result = await response.json();
    return result.caminho;
}
async function salvarNota(data) {
    delete data.notaFiscal; // imagem da nota já foi enviada
    const response = await fetch('/api/conta-a-pagar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`Erro ao salvar nota: ${response.statusText}`);
    }
    return await response.json();
}
