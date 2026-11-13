document.addEventListener('DOMContentLoaded', function () {
  const settingsElement = document.getElementById('settings');
  if (settingsElement && !document.getElementById('daySelect')) {
    const settingsRow = document.createElement('div');
    settingsRow.className = 'settings-row';

    const label = document.createElement('label');
    label.textContent = 'Jump to day';

    const daySelect = document.createElement('select');
    daySelect.id = 'daySelect';
    daySelect.className = 'secondary';

    for (let i = 1; i <= 30; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      daySelect.appendChild(option);
    }

    settingsRow.appendChild(label);
    settingsRow.appendChild(daySelect);
    settingsElement.appendChild(settingsRow);

    daySelect.addEventListener('change', function () {
      const day = parseInt(this.value);
      const state = JSON.parse(localStorage.getItem('bj101') || '{}');
      state.day = day;
      localStorage.setItem('bj101', JSON.stringify(state));
      location.reload();
    });
  }

  if (settingsElement && !document.getElementById('daySelect')) {
    const settingsRow = document.createElement('div');
    settingsRow.className = 'settings-row';

    const label = document.createElement('label');
    label.textContent = 'Jump to day';

    const daySelect = document.createElement('select');
    daySelect.id = 'daySelect';
    daySelect.className = 'secondary';

    for (let i = 1; i <= 30; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      daySelect.appendChild(option);
    }

    settingsRow.appendChild(label);
    settingsRow.appendChild(daySelect);
    settingsElement.appendChild(settingsRow);

    daySelect.addEventListener('change', function () {
      const day = parseInt(this.value);
      const state = JSON.parse(localStorage.getItem('bj101') || '{}');
      state.day = day;
      localStorage.setItem('bj101', JSON.stringify(state));
      location.reload();
    });
  }
  if (settingsElement && !document.getElementById('daySelect')) {
    const settingsRow = document.createElement('div');
    settingsRow.className = 'settings-row';

    const label = document.createElement('label');
    label.textContent = 'Jump to day';

    const daySelect = document.createElement('select');
    daySelect.id = 'daySelect';
    daySelect.className = 'secondary';

    for (let i = 1; i <= 30; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      daySelect.appendChild(option);
    }

    settingsRow.appendChild(label);
    settingsRow.appendChild(daySelect);
    settingsElement.appendChild(settingsRow);

    daySelect.addEventListener('change', function () {
      const day = parseInt(this.value);
      const state = JSON.parse(localStorage.getItem('bj101') || '{}');
      state.day = day;
      localStorage.setItem('bj101', JSON.stringify(state));
      location.reload();
    });
  }
});