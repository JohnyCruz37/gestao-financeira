export function openModalEmpresas(empresa) {
    const modalTitle = document.getElementById('modalEmpresasLabel');
    if (modalTitle)
        modalTitle.textContent = `Detalhes do Usuário: ${empresa.razao_social}`;
    // Abrir o modal
    const modalElement = new bootstrap.Modal(document.getElementById('modalEmpresas'));
    modalElement.show();
}
export default function modalEmpresa() {
    console.info('Chamando a função modalEmpresa()');
}
