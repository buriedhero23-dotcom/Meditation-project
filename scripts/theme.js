const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  document.body.classList.remove("light-theme");
  document.body.classList.add("dark-theme");
} else {
  document.body.classList.remove("dark-theme");
  document.body.classList.add("light-theme");
}

const updateToggleIcon = () => {
  if (!themeToggle) return;

  themeToggle.innerHTML = document.body.classList.contains("dark-theme")
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
};

updateToggleIcon();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-theme");

    document.body.classList.toggle("dark-theme", isDark);
    document.body.classList.toggle("light-theme", !isDark);

    localStorage.setItem("theme", isDark ? "dark" : "light");

    updateToggleIcon();
  });
}