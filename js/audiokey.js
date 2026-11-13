document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.vocab-right .icon-btn, .sound');
  elements.forEach(el => {
    if (!el.getAttribute('aria-label')) {
      el.setAttribute('aria-label', 'Play sound');
    }
    if (!el.getAttribute('title')) {
      el.setAttribute('title', 'Play sound');
    }
  });
});