// scripts/forgot-password.js
// Handles the password reset form UI and calls Supabase to send reset links.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.password-reset-form');
  const emailInput = document.getElementById('resetEmail');
  const messageBlock = document.querySelector('.reset-message');
  const submitBtn = document.querySelector('.reset-submit-btn');

  function showResetMessage(message, type = 'success') {
    if (!messageBlock) return;
    messageBlock.textContent = message;
    messageBlock.classList.remove('reset-message--hidden', 'reset-message--success', 'reset-message--error');
    messageBlock.classList.add(type === 'error' ? 'reset-message--error' : 'reset-message--success');
  }

  function hideResetMessage() {
    if (!messageBlock) return;
    messageBlock.textContent = '';
    messageBlock.classList.add('reset-message--hidden');
    messageBlock.classList.remove('reset-message--success', 'reset-message--error');
  }

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideResetMessage();

    const email = emailInput?.value.trim() || '';
    if (!email) {
      showResetMessage('Please enter your email address.', 'error');
      return;
    }

    // Disable button while request is in progress
    const prevText = submitBtn ? submitBtn.textContent : null;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    try {
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://buriedhero23-dotcom.github.io/Meditation-project/reset-password.html',
      });

      if (error) {
        console.error('Supabase reset error:', error);
        showResetMessage('Unable to send reset link. Please try again later.', 'error');
        return;
      }

      showResetMessage('Password reset link sent. Please check your email.', 'success');
      if (emailInput) emailInput.value = '';
    } catch (err) {
      console.error('Unexpected error:', err);
      showResetMessage('Unexpected error. Please try again.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = prevText || 'Send reset link';
      }
    }
  });
});
