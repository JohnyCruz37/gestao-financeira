import { openModalEmpresas } from "./modalEmpresa.js";
export async function populateSelect(id, disabled = true) {
    const selectEmpresa = document.getElementById(id);
    selectEmpresa.innerHTML = `<option value="">Selecionar Empresa</option>`;
    try {
        const empresas = await fetchEmpresas();
        selectEmpresa.disabled = false;
        selectEmpresa.innerHTML += empresas.map((empresa) => `<option value="${empresa.id}">${empresa.razao_social}</option>`).join('');
        selectEmpresa.disabled = disabled;
    }
    catch (error) {
        console.error('Erro ao popular o select de empresas:', error);
    }
}
export async function fetchEmpresas() {
    try {
        const response = await fetch('/api/empresas');
        if (!response.ok) {
            throw new Error('Erro ao buscar empresas');
        }
        return await response.json();
    }
    catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}
export async function populateTableEmpresas(id) {
    try {
        const empresas = await fetchEmpresas();
        const table = document.getElementById(id);
        let tableContent = '';
        if (empresas.length === 0) {
            table.innerHTML = `<tr><td colspan='3'>Nenhuma empresa cadastrada!</td></tr>`;
            return;
        }
        else {
            const theadContent = `
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Empresa</th>
                        <th scope="col">CNPJ</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
            `;
            empresas.forEach(empresa => {
                tableContent += `
                    <tr>
                        <td>${empresa.id.toString()}</td>
                        <td>${empresa.razao_social}</td>
                        <td>${empresa.cnpj}</td>
                        <td>
                        <button class="btn btn-sm btn-outline-secondary btn-editar-empresa" data-user-id="${empresa.id}">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        </td>
                    </tr>
                `;
            });
            table.innerHTML = theadContent + `<tbody>${tableContent}</tbody>`;
            const editButtons = table.querySelectorAll('.btn-editar-empresa');
            editButtons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    openModalEmpresas(empresas[index]);
                });
            });
        }
    }
    catch (error) {
        console.error('Erro ao preencher a tabela de empresas:', error);
    }
}
