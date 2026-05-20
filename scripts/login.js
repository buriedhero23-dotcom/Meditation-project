const loginForm = document.querySelector(".auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorBlock = document.querySelector(".auth-error");
const errorText = document.querySelector(".auth-error-text");
const forgotLink = document.querySelector(".forgot-password-link");

const showErrorMessage = (message) => {
  if (!errorBlock) return;
  errorText.textContent = message;
  errorBlock.classList.remove("auth-error--hidden");
  // trigger animation-visible state
  requestAnimationFrame(() => errorBlock.classList.add("auth-error--visible"));
  if (forgotLink) {
    forgotLink.style.display = "inline-block";
  }
};

const hideErrorMessage = () => {
  if (!errorBlock) return;
  errorText.textContent = "";
  errorBlock.classList.remove("auth-error--visible");
  errorBlock.classList.add("auth-error--hidden");
  if (forgotLink) {
    forgotLink.style.display = "none";
  }
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