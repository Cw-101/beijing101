document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.vocab-right .icon-btn');
  elements.forEach(el => {
    if (!el.getAttribute('aria-label')) {
      el.setAttribute('aria-label', 'Play pronunciation');
    }
    if (!el.getAttribute('title')) {
      el.setAttribute('title', 'Play pronunciation');
    }
  });
});