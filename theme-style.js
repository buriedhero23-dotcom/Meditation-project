const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set initial theme
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.body.classList.remove('light-theme');
  document.body.classList.add('dark-theme');
} else {
  document.body.classList.remove('dark-theme');
  document.body.classList.add('light-theme');
}

const updateToggleIcon = () => {
  themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
};

updateToggleIcon();

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateToggleIcon();
});