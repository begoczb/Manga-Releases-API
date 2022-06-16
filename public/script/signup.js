const signupForm = document.querySelector(".sign-form"),
  usernameInput = signupForm.querySelector("#username"),
  passwordInput = signupForm.querySelector("#password"),
  baseUrl = "http://localhost:3000/api/auth/signup";

signupForm.addEventListener("submit", handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();
  const username = usernameInput.value,
    password = passwordInput.value,
    userToCreate = { username, password };
  try {
    const response = await axios.post(`${baseUrl}/signup`, userToCreate);
    console.log(response);
  } catch (error) {
    console.error(error.message);
  }
}
