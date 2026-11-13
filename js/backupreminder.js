document.addEventListener('DOMContentLoaded', function() {
  const streakPill = document.querySelector('#streakPill');
  if (streakPill && !localStorage.getItem('bj101exportedAt')) {
    const backupBtn = document.createElement('button');
    backupBtn.textContent = 'Export Progress';
    backupBtn.className = 'small muted';
    backupBtn.onclick = function() {
      window.exportProgress();
      this.remove();
    };
    streakPill.parentNode.insertBefore(backupBtn, streakPill.nextSibling);
  }
});