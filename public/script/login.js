const form = document.querySelector(".log-form");
const usernameInput = form.querySelector("#username");
const passwordInput = form.querySelector("#password");
const baseUrl = "http://localhost:3000/api/auth/login";

const { apiHandler } = require("./apiHandler");

form.addEventListener("submit", handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  const payload = { username, password };
  apiHandler.login(payload);
}
