document.addEventListener('DOMContentLoaded', function() {
  const streakPill = document.querySelector('#streakPill');
  if (streakPill && !localStorage.getItem('bj101exportedAt')) {
    const backupDiv = document.createElement('div');
    backupDiv.textContent = 'No backup in 7+ days — use Export';
    backupDiv.className = 'small muted';
    streakPill.parentNode.insertBefore(backupDiv, streakPill.nextSibling);
  }
});