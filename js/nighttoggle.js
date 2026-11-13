document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('bj101night') === '1') {
    document.body.classList.add('night');
  }

  // Reflect stored value on load
  if (document.getElementById('settings')) {
    const settingsRow = document.createElement('div');
    settingsRow.className = 'settings-row';

    const label = document.createElement('label');
    label.textContent = 'Night mode';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'toggle';
    checkbox.checked = localStorage.getItem('bj101night') === '1';
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        document.body.classList.add('night');
        localStorage.setItem('bj101night', '1');
      } else {
        document.body.classList.remove('night');
        localStorage.setItem('bj101night', '0');
      }
    });

    settingsRow.appendChild(label);
    settingsRow.appendChild(checkbox);
    document.getElementById('settings').appendChild(settingsRow);
  }
});

// Define the night mode style
const style = document.createElement('style');
style.textContent = 'body.night { filter: invert(1) hue-rotate(180deg); } body.night img { filter: none; } @media print { body.night { filter: none; } }';
document.head.appendChild(style);