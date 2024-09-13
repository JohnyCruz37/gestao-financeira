import AlertaJs from "./alertaJs.js";
document.getElementById("form-login")?.addEventListener('submit', function (event) {
    event.preventDefault();
    //validar email
    const emailInput = document.getElementById("email");
    const emailFeedback = document.getElementById("emailFeedback");
    if (emailInput.value.trim() === "") {
        emailInput.classList.add("is-invalid");
        emailFeedback.textContent = "Por favor, insira seu email.";
        emailFeedback.style.display = "block";
        return;
    }
    // validar senha
    const senhaInput = document.getElementById("password");
    const senhaFeedback = document.getElementById("passwordFeedback");
    if (senhaInput.value.trim() === "") {
        senhaInput.classList.add("is-invalid");
        senhaFeedback.textContent = "Por favor, insira sua senha.";
        senhaFeedback.style.display = "block";
        return;
    }
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
