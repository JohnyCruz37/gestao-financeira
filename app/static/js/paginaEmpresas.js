import configurarFormEmpresa from "./formEmpresa.js";
import configurarFormUsuario from "./formUsuario.js";
import { populateSelect, populateTableEmpresas } from "./populateEmpresas.js";
import populateTableEmpresasGerentes from "./populateTableEmpresasGerentes.js";
document.addEventListener('DOMContentLoaded', () => {
    configurarFormEmpresa();
    configurarFormUsuario();
    populateSelect();
    populateTableEmpresasGerentes('table-empresas-e-gerentes');
    populateTableEmpresas('table-empresas');
});
