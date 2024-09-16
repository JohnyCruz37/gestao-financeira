"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('notaForm');
    const btnLimpar = document.getElementById('limparFormulario');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        console.log(JSON.stringify(data, null, 2));
    });
    btnLimpar.addEventListener('click', () => {
        form.reset();
    });
});
