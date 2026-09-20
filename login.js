const DEMO_EMAIL = "cristobalcontreras@paesnet.cl";
const DEMO_PASSWORD = "paes2026";
const SESSION_KEY = "paesnetSession";

if (localStorage.getItem(SESSION_KEY) === "active") {
  window.location.replace("inicio.html");
}

const form = document.querySelector("#loginForm");
const emailInput = document.querySelector("#loginEmail");
const passwordInput = document.querySelector("#loginPassword");
const forgotButton = document.querySelector("#forgotPassword");
const togglePassword = document.querySelector("#togglePassword");
const message = document.querySelector("#loginMessage");

forgotButton.addEventListener("click", (event) => {
  event.preventDefault();
  emailInput.value = DEMO_EMAIL;
  passwordInput.value = DEMO_PASSWORD;
  message.textContent = "Credenciales completadas. Ya puedes iniciar sesión.";
  message.className = "login-message success";
});

togglePassword.addEventListener("click", () => {
  const hidden = passwordInput.type === "password";
  passwordInput.type = hidden ? "text" : "password";
  togglePassword.textContent = hidden ? "Ocultar" : "Ver";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    localStorage.setItem(SESSION_KEY, "active");
    window.location.href = "inicio.html";
    return;
  }
  message.textContent = "Correo o contraseña incorrectos.";
  message.className = "login-message error";
});
