const meditationButtons = document.querySelectorAll(
  "#meditationStartBtn, .meditation-start-btn"
);

meditationButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();

    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    if (session) {
      window.location.href = "meditation-page.html";
      return;
    }

    window.location.href = "registration-page.html";
  });
});