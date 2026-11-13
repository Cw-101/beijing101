document.addEventListener('DOMContentLoaded', function () {
  const badge = document.createElement('div');
  badge.style.position = 'fixed';
  badge.style.bottom = '10px';
  badge.style.left = '10px';
  badge.style.padding = '6px 10px';
  badge.style.borderRadius = '99px';
  badge.style.fontSize = '11px';
  badge.style.backgroundColor = '#1a1a1a';
  badge.style.color = 'white';
  badge.style.opacity = '0.7';
  badge.style.zIndex = '40';
  document.body.appendChild(badge);

  function updateBadge() {
    badge.textContent = navigator.onLine ? 'Online' : 'Offline';
  }

  updateBadge();
  window.addEventListener('online', updateBadge);
  window.addEventListener('offline', updateBadge);
});