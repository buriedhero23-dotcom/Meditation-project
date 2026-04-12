const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.body.classList.add('dark-theme');
}

const updateToggleIcon = () => {
  themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
};

updateToggleIcon();

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateToggleIcon();
});