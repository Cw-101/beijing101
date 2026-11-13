document.addEventListener('DOMContentLoaded', function () {
  const settingsElement = document.getElementById('settings');
  if (settingsElement) {
    const accentRow = document.createElement('div');
    accentRow.className = 'settings-row';
    const accentPick = document.createElement('input');
    accentPick.id = 'accentPick';
    accentPick.type = 'color';
    accentRow.appendChild(accentPick);
    settingsElement.appendChild(accentRow);

    // Load stored accent color
    const storedAccent = localStorage.getItem('bj101accent');
    if (storedAccent) {
      document.documentElement.style.setProperty('--red', storedAccent);
    }

    // Save accent color on change
    accentPick.addEventListener('change', function () {
      const selectedColor = this.value;
      document.documentElement.style.setProperty('--red', selectedColor);
      localStorage.setItem('bj101accent', selectedColor);
    });
  }
});