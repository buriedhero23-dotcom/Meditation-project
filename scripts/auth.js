const form = document.querySelector(".auth-form");
const avatarInput = document.getElementById("avatarInput");
const avatarPreview = document.querySelector(".avatar-preview");
const avatarUploadBtn = document.querySelector(".avatar-upload-btn");

if (avatarInput && avatarPreview && avatarUploadBtn) {
  avatarUploadBtn.addEventListener("click", () => {
    avatarInput.click();
  });

  avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      avatarInput.value = "";
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      avatarPreview.innerHTML = `
        <img src="${reader.result}" alt="Selected avatar preview" />
      `;
    });

    reader.readAsDataURL(file);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!fullName || !email || !password || !confirmPassword) {
    alert("Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:"https://buriedhero23-dotcom.github.io/Meditation-project/meditation-page.html",
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  alert("Account created. Please check your email and confirm your account before logging in.");
  window.location.href = "login.html";
});