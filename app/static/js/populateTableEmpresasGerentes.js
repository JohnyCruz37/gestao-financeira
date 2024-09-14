import { fetchEmpresas } from "./populateEmpresas.js";
import { openModalUsuarios } from "./modalUsuario.js";
import AlertaJs from "./alertaJs.js";
export default async function populateTableEmpresasGerentes(id) {
    try {
        const [empresas, users] = await Promise.all([
            fetchEmpresas(),
            fetch("/api/users", {
                method: 'GET',
            }).then(res => res.json()),
        ]);
        const table = document.getElementById(id);
        let tableContent = '';
        if (users.length === 0) {
            table.innerHTML = `<tr><td colspan='3'>Cadastre empresas e usuários!</td></tr>`;
            return;
        }
        else {
            const theadContent = `
                <thead>
                    <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Empresa</th>
                        <th scope="col">Acesso</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
            `;
            users.forEach(user => {
                if (user.tipo_acesso === 'gerente' && user.id_empresa) {
                    const empresa = empresas.find(e => Number(e.id) === user.id_empresa);
                    if (empresa) {
                        user.empresa = {
                            id: Number(empresa.id),
                            razao_social: empresa.razao_social,
                            cnpj: empresa.cnpj
                        };
                    }
                }
                tableContent += `
                    <tr>
                        <td>${user.nome} ${user.sobrenome}</td>
                        <td>${user.empresa?.razao_social || '- - - -'}</td>
                        <td>${user.tipo_acesso}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-secondary btn-editar-usuario" data-user-id="${user.id}">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            table.innerHTML = theadContent + `<tbody>${tableContent}</tbody>`;
            const editButtons = table.querySelectorAll('.btn-editar-usuario');
            editButtons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    openModalUsuarios(users[index], empresas);
                });
            });
        }
    }
    catch (error) {
        console.error(error);
        AlertaJs.showAlert('Ocorreu um erro ao carregar os dados!', 'danger');
        return;
    }
}
