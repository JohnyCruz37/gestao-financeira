import AlertaJs from "./alertaJs.js";
// Função para formatar o valor monetário
function formatarValor(valor) {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}
// Função para renderizar a tabela
async function renderizarTabela() {
    const tabelaCorpo = document.getElementById("tabela-corpo");
    const totalGeralEl = document.getElementById("total-geral");
    if (!tabelaCorpo || !totalGeralEl)
        return;
    tabelaCorpo.innerHTML = "";
    let totalGeral = 0;
    const empresas = await fetchIndicadores();
    empresas.forEach(empresa => {
        const linha = `
            <tr>
                <td>${empresa.razao_social}</td>
                <td class="text-end">${formatarValor(empresa.valor)}</td>
            </tr>
        `;
        tabelaCorpo.innerHTML += linha;
        totalGeral += empresa.valor;
    });
    totalGeralEl.textContent = formatarValor(totalGeral);
}
document.addEventListener("DOMContentLoaded", renderizarTabela);
async function fetchIndicadores() {
    try {
        const response = await fetch('/api/indicadores');
        if (!response.ok) {
            AlertaJs.showAlert('Não foi possível carregar os indicadores', 'danger');
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
    catch (error) {
        console.error('Error', error);
        throw error;
    }
}
