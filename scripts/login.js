const loginForm = document.querySelector(".auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageBlock = document.querySelector(".auth-message");

const showErrorMessage = (message) => {
  messageBlock.textContent = message;
  messageBlock.classList.remove("auth-message--hidden");
};

const hideErrorMessage = () => {
  messageBlock.textContent = "";
  messageBlock.classList.add("auth-message--hidden");
};

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  hideErrorMessage();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showErrorMessage("Please fill in all fields");
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    showErrorMessage("Invalid email or password. Please try again.");
    return;
  }

  hideErrorMessage();
  window.location.href = "meditation-page.html";
});