const avatarInput = document.getElementById("avatarInput");
const avatarImage = document.getElementById("profileAvatar");
const avatarEditBtn = document.querySelector(".avatar-edit-btn");

const profileName = document.querySelector(".profile-name");
const profileEmail = document.querySelector(".profile-email");
const profileDate = document.querySelector(".profile-date");

const profileForm = document.querySelector(".profile-form");
const fullNameInput = document.getElementById("fullNameInput");
const logoutBtn = document.querySelector(".profile-logout-btn");

const defaultAvatar = "images/avatars/default-avatar.png";

const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();

  if (error) {
    console.error("Session error:", error);
    alert("Could not check your session. Please try again.");
    return null;
  }

  return session;
};

const formatMemberSince = (createdAt) => {
  if (!createdAt) return "Member since —";

  const date = new Date(createdAt);

  return `Member since ${date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })}`;
};

const renderProfile = (user) => {
  const fullName = user.user_metadata?.full_name || "Meditation user";
  const avatarUrl = user.user_metadata?.avatar_url || defaultAvatar;

  if (profileName) {
    profileName.textContent = fullName;
  }

  if (profileEmail) {
    profileEmail.textContent = user.email || "";
  }

  if (profileDate) {
    profileDate.textContent = formatMemberSince(user.created_at);
  }

  if (fullNameInput) {
    fullNameInput.value = fullName;
  }

  if (avatarImage) {
    avatarImage.src = avatarUrl;
  }
};

const loadProfile = async () => {
  const session = await getSession();

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  renderProfile(session.user);
};

const updateFullName = async (fullName) => {
  const { data, error } = await supabaseClient.auth.updateUser({
    data: {
      full_name: fullName,
    },
  });

  if (error) {
    console.error("Name update error:", error);
    alert("Could not update your name. Please try again.");
    return;
  }

  if (data?.user) {
    renderProfile(data.user);
  }

  alert("Profile updated successfully.");
};

const uploadAvatar = async (file) => {
  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file.");
    return;
  }

  const session = await getSession();

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const user = session.user;
  const fileExt = file.name.split(".").pop();
  const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

  const tempUrl = URL.createObjectURL(file);

  if (avatarImage) {
    avatarImage.src = tempUrl;
  }

  const { error: uploadError } = await supabaseClient.storage
    .from("avatars")
    .upload(filePath, file);

  URL.revokeObjectURL(tempUrl);

  if (uploadError) {
    console.error("Avatar upload error:", uploadError);
    alert("Could not upload avatar. Please try again.");
    renderProfile(user);
    return;
  }

  const {
    data: { publicUrl },
  } = supabaseClient.storage.from("avatars").getPublicUrl(filePath);

  const { data, error: updateError } = await supabaseClient.auth.updateUser({
    data: {
      avatar_url: publicUrl,
    },
  });

  if (updateError) {
    console.error("Avatar metadata update error:", updateError);
    alert("Avatar uploaded, but profile update failed. Please try again.");
    return;
  }

  if (data?.user) {
    renderProfile(data.user);
  }

  await supabaseClient.auth.refreshSession();

  alert("Avatar updated successfully.");
};

if (avatarEditBtn && avatarInput) {
  avatarEditBtn.addEventListener("click", () => {
    avatarInput.click();
  });

  avatarInput.addEventListener("change", async () => {
    const file = avatarInput.files[0];

    if (!file) return;

    await uploadAvatar(file);

    avatarInput.value = "";
  });
}

if (profileForm && fullNameInput) {
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = fullNameInput.value.trim();

    if (!fullName) {
      alert("Please enter your full name.");
      return;
    }

    await updateFullName(fullName);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      alert("Could not log out. Please try again.");
      return;
    }

    window.location.href = "index.html";
  });
}

loadProfile();