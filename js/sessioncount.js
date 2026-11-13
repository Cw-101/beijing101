document.addEventListener('DOMContentLoaded', function() {
  const settings = document.getElementById('settings');
  if (settings) {
    let sessionCount = parseInt(localStorage.getItem('bj101sessions')) || 0;
    sessionCount++;
    localStorage.setItem('bj101sessions', sessionCount);
    const lastSession = new Date().toISOString();
    localStorage.setItem('bj101lastSession', lastSession);

    const row = document.createElement('div');
    row.className = 'settings-row';
    row.innerHTML = '<span>Study sessions</span><strong>' + sessionCount + '</strong>';
    settings.appendChild(row);
  }
});