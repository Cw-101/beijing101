document.addEventListener('DOMContentLoaded', function() {
  const settingsDiv = document.getElementById('settings');
  if (settingsDiv) {
    const completedCount = localStorage.getItem('bj101') ? JSON.parse(localStorage.getItem('bj101')).completed.length : 0;
    const streakDiv = document.createElement('div');
    streakDiv.className = 'settings-row';
    streakDiv.title = 'Completed days';

    for (let i = 0; i < 30; i++) {
      const span = document.createElement('span');
      span.textContent = i < completedCount ? '■' : '□';
      streakDiv.appendChild(span);
    }

    settingsDiv.appendChild(streakDiv);
  }
});