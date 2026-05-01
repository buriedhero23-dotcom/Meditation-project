const updateSessionUI = async () => {
  const userPanel = document.querySelector(".user-panel");
  const userAvatar = document.querySelector(".user-avatar");
  const userName = document.querySelector(".user-name");
  const authLinks = document.querySelector(".auth-links");

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (session) {
    const displayName =
      session.user.user_metadata.full_name || session.user.email;
    const avatarLetter = displayName.charAt(0).toUpperCase();

    if (userPanel) userPanel.style.display = "inline-flex";
    if (userName) userName.textContent = displayName;
    if (userAvatar) userAvatar.textContent = avatarLetter;
    if (authLinks) authLinks.style.display = "none";

    return;
  }

  if (userPanel) userPanel.style.display = "none";
  if (authLinks) authLinks.style.display = "";
};

const initUserDropdown = () => {
  const userMenuBtn = document.querySelector(".user-menu-btn");
  const userDropdown = document.querySelector(".user-dropdown");
  const logoutBtn = document.querySelector(".logout-btn");

  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", () => {
      userDropdown.classList.add("hidden");
    });

    userDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await supabaseClient.auth.signOut();
      window.location.href = "index.html";
    });
  }
};

updateSessionUI();
initUserDropdown();