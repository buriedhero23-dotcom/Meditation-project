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
  const avatarFile = avatarInput?.files[0];

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

  const { error: signInError } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error("SIGN IN AFTER SIGN UP ERROR:", signInError);
    alert(signInError.message);
    return;
  }

  let avatarUrl = "";

  if (avatarFile) {
    const userId = data.user.id;
    const fileExt = avatarFile.name.split(".").pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabaseClient.storage
      .from("avatars")
      .upload(filePath, avatarFile, {
        upsert: true,
    });

    if (uploadError) {
      console.error("UPLOAD ERROR:", uploadError);
      alert(uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabaseClient.storage
      .from("avatars")
      .getPublicUrl(filePath);

    avatarUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabaseClient.auth.updateUser({
      data: {
        full_name: fullName,
        avatar_url: avatarUrl,
      },
    });

    if (updateError) {
      console.error(updateError);
      alert("Account created, but avatar was not saved to profile.");
      return;
    }
  }

  alert("Account created successfully!");
  window.location.href = "meditation-page.html";
});