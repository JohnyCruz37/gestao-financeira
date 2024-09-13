import { openModalUsuarios } from "./modalUsuario.js";
export default function populateTableUsuarios(id, usuarios) {
    const table = document.getElementById(id);
    let tableContent = '';
    if (usuarios.length === 0) {
        table.innerHTML = `<tr><td colspan='3'>Nenhum usuário cadastrado!</td></tr>`;
        return;
    }
    else {
        // Cria o <thead> uma única vez
        const theadContent = `
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Acesso</th>
                    <th scope="col"></th>
                </tr>
            </thead>
        `;
        usuarios.forEach(user => {
            tableContent += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.nome} ${user.sobrenome}</td>
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
                openModalUsuarios(usuarios[index]);
            });
        });
    }
}
