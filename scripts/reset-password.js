const resetForm = document.querySelector(".reset-password-form");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const resetMessage = document.querySelector(".reset-message");
const resetSubmitBtn = document.querySelector(".reset-submit-btn");

const showResetMessage = (message, type) => {
  if (!resetMessage) return;

  resetMessage.textContent = message;
  resetMessage.classList.remove(
    "reset-message--hidden",
    "reset-message--success",
    "reset-message--error"
  );

  resetMessage.classList.add(`reset-message--${type}`);
};

if (resetForm) {
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!newPassword || !confirmPassword) {
      showResetMessage("Please fill in both password fields.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showResetMessage("Passwords do not match.", "error");
      return;
    }

    if (newPassword.length < 6) {
      showResetMessage("Password must be at least 6 characters.", "error");
      return;
    }

    resetSubmitBtn.disabled = true;
    resetSubmitBtn.textContent = "Saving...";

    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });

    resetSubmitBtn.disabled = false;
    resetSubmitBtn.textContent = "Save new password";

    if (error) {
      console.error(error);
      showResetMessage("Could not update password. Please try again.", "error");
      return;
    }

    showResetMessage("Password updated successfully. Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1800);
  });
}
