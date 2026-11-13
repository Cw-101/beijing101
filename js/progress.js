document.addEventListener('DOMContentLoaded', () => {
  const streakPill = document.getElementById('streakPill');
  if (streakPill) {
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export';
    exportBtn.className = 'ghost';
    exportBtn.onclick = () => {
      try {
        const state = localStorage.getItem('bj101');
        if (!state) {
          showToast('Could not read saved progress');
          return;
        }
        const parsed = JSON.parse(state);
        const obj = {
          app: 'beijing101',
          version: 1,
          exportedAt: new Date().toISOString(),
          state: parsed
        };
        const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `beijing-101-progress-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Progress exported');
      } catch (e) {
        showToast('Could not read saved progress');
      }
    };

    const importBtn = document.createElement('button');
    importBtn.textContent = 'Import';
    importBtn.className = 'ghost';
    importBtn.onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        try {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
            const parsed = JSON.parse(event.target.result);
            if (parsed.app !== 'beijing101' || !parsed.state || (typeof parsed.state === 'object' && (!parsed.state.name || !parsed.state.day || !parsed.state.completed || !parsed.state.cards))) {
              showToast('That is not a beijing-101 backup');
              return;
            }
            if (Array.isArray(parsed.state)) {
              showToast('That is not a beijing-101 backup');
              return;
            }
            if (typeof parsed.state === 'object' && (!Object.hasOwn(parsed.state, 'name') || !Object.hasOwn(parsed.state, 'day') || !Object.hasOwn(parsed.state, 'completed') || !Object.hasOwn(parsed.state, 'cards'))) {
              showToast('That is not a beijing-101 backup');
              return;
            }
            if (!confirm('Replace your current progress with this backup?')) return;
            localStorage.setItem('bj101', JSON.stringify(parsed.state));
            location.reload();
          };
          reader.onerror = () => {
            showToast('That file is not valid JSON');
          };
          reader.readAsText(file);
        } catch (e) {
          showToast('That file is not valid JSON');
        }
      };
      input.click();
    };

    streakPill.insertAdjacentElement('afterend', exportBtn);
    streakPill.insertAdjacentElement('afterend', importBtn);
  }
});

function showToast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => {
    el.classList.remove('show');
  }, 2200);
}

window.exportProgress = () => {
  try {
    const state = localStorage.getItem('bj101');
    if (!state) {
      showToast('Could not read saved progress');
      return;
    }
    const parsed = JSON.parse(state);
    const obj = {
      app: 'beijing101',
      version: 1,
      exportedAt: new Date().toISOString(),
      state: parsed
    };
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beijing-101-progress-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Progress exported');
  } catch (e) {
    showToast('Could not read saved progress');
  }
};

window.importProgress = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.app !== 'beijing101' || !parsed.state || (typeof parsed.state === 'object' && (!parsed.state.name || !parsed.state.day || !parsed.state.completed || !parsed.state.cards))) {
          showToast('That is not a beijing-101 backup');
          reject();
          return;
        }
        if (Array.isArray(parsed.state)) {
          showToast('That is not a beijing-101 backup');
          reject();
          return;
        }
        if (typeof parsed.state === 'object' && (!Object.hasOwn(parsed.state, 'name') || !Object.hasOwn(parsed.state, 'day') || !Object.hasOwn(parsed.state, 'completed') || !Object.hasOwn(parsed.state, 'cards'))) {
          showToast('That is not a beijing-101 backup');
          reject();
          return;
        }
        if (!confirm('Replace your current progress with this backup?')) {
          reject();
          return;
        }
        localStorage.setItem('bj101', JSON.stringify(parsed.state));
        location.reload();
        resolve();
      } catch (e) {
        showToast('That file is not valid JSON');
        reject();
      }
    };
    reader.onerror = () => {
      showToast('That file is not valid JSON');
      reject();
    };
    reader.readAsText(file);
  });
};