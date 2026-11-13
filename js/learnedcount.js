document.addEventListener('DOMContentLoaded', function() {
  try {
    const state = JSON.parse(localStorage.getItem('bj101')) || {};
    const cardCount = Object.keys(state.cards || {}).length;
    const settingsDiv = document.getElementById('settings');
    if (settingsDiv) {
      const row = document.createElement('div');
      row.className = 'settings-row';
      row.innerHTML = '<span>Words in review</span><strong>' + cardCount + '</strong>';
      settingsDiv.appendChild(row);
    }
  } catch (e) {
    if (document.getElementById('settings')) {
      const row = document.createElement('div');
      row.className = 'settings-row';
      row.innerHTML = '<span>Words in review</span><strong>0</strong>';
      document.getElementById('settings').appendChild(row);
    }
  }
});