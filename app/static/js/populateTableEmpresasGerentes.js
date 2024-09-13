import populateTableUsuarios from "./populateTableUsuarios.js";
export default function populateTableEmpresasGerentes(id) {
    fetch("/api/lista-empresas-e-gerentes", {
        method: 'GET',
    })
        .then(response => response.json())
        .then((data) => {
        const table = document.getElementById(id);
        let tableContent = '';
        if (data.length === 0) {
            table.innerHTML = `<tr><td colspan='3'>Nenhuma empresa cadastrada!</td></tr>`;
            return;
        }
        else {
            // Cria o <thead> uma única vez
            const theadContent = `
                <thead>
                    <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Empresa</th>
                        <th scope="col">Acesso</th>
                    </tr>
                </thead>
            `;
            data.forEach(item => {
                tableContent += `
                    <tr>
                        <td>${item.nome} ${item.sobrenome}</td>
                        <td>${item.empresa?.razao_social || '- - - -'}</td>
                        <td>${item.tipo_acesso}</td>
                    </tr>
                `;
            });
            table.innerHTML = theadContent + `<tbody>${tableContent}</tbody>`;
            populateTableUsuarios('table-usuarios', data);
        }
    })
        .catch(error => {
        console.error('Erro ao preencher a tabela:', error);
    });
}
