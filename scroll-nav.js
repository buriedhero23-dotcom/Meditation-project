// Smooth scrolling and active state tracking for navigation

const scrollBtns = document.querySelectorAll('.scroll-btn');
const sections = document.querySelectorAll('section, header[id], main[id]');

// Handle click events on nav buttons
scrollBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Remove active class from all buttons
      scrollBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      // Smooth scroll to target
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Update active button based on scroll position
function updateActiveButton() {
  let currentSection = '';
  
  sections.forEach(section => {
    if (!section.id) return;
    
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    // Check if section is in viewport
    if (window.scrollY >= sectionTop - 200) {
      currentSection = section.id;
    }
  });
  
  // Update active button
  scrollBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-target') === currentSection) {
      btn.classList.add('active');
    }
  });
}

// Listen to scroll events
window.addEventListener('scroll', updateActiveButton);

// Set initial active button on page load
window.addEventListener('load', updateActiveButton);
updateActiveButton();