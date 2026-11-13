document.addEventListener('DOMContentLoaded', function() {
  const completed = JSON.parse(localStorage.getItem('bj101') || '[]');
  const daysRemaining = Math.max(0, 30 - completed.length);
  const settingsElement = document.getElementById('settings');
  if (settingsElement) {
    settingsElement.innerHTML += `<div class="settings-row"><span>Days remaining</span><strong>${daysRemaining}</strong></div>`;
  }
});