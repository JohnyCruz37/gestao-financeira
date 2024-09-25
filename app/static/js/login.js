import AlertaJs from "./alertaJs.js";
import { monitorarInputs } from "./formUsuario.js";
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("form-login");
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        monitorarInputs(form, 'email');
        if (document.querySelectorAll(".is-invalid").length === 0) {
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json()
                .then(result => ({
                status: response.status,
                body: result
            })))
                .then(({ status, body }) => {
                if (status === 200) {
                    AlertaJs.showAlert(body.message, "success");
                    setTimeout(() => {
                        window.location.href = "/pagina-inicial";
                    }, 1500);
                }
                else {
                    AlertaJs.showAlert(body.message, "danger");
                }
            })
                .catch(error => {
                AlertaJs.showAlert(error.message, "danger");
                console.error("Erro:", error);
            });
        }
    });
    const btnToogleSenha = document.getElementById("togglePassword");
    btnToogleSenha.addEventListener("click", function () {
        const inputSenha = document.getElementById("password");
        inputSenha.type = inputSenha.type === "password" ? "text" : "password";
    });
});
