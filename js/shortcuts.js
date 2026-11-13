document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('keydown', function(event) {
    // Ignore if the event target is an input, select, or textarea
    if (event.target && (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT' || event.target.tagName === 'TEXTAREA')) {
      return;
    }

    // Check if onboarding modal is open
    const onboardModal = document.getElementById('onboard');
    if (onboardModal && onboardModal.classList.contains('show')) {
      event.preventDefault();
      return;
    }

    // Get the active view and its choices
    const activeView = document.querySelector('.view.active');
    const choices = activeView ? activeView.querySelectorAll('.choice') : [];

    // Handle keys 1-4 to click the corresponding choice
    if (event.key >= '1' && event.key <= '4') {
      const index = parseInt(event.key) - 1;
      if (index >= 0 && index < choices.length) {
        choices[index].click();
      }
    }

    // Handle space key to play the word
    if (event.key === ' ' && !document.getElementById('onboard')?.classList?.contains('show') && !document.getElementById('keyhelp')?.classList?.contains('show')) {
      const playWordButton = document.getElementById('playWord');
      if (playWordButton) {
        event.preventDefault(); // Prevent default scrolling behavior
        playWordButton.click();
      }
    }
  });
});