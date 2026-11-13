document.addEventListener('DOMContentLoaded', function() {
  const settingsElement = document.getElementById('settings');
  if (settingsElement) {
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export words (CSV)';
    exportButton.id = 'export-words-button';
    exportButton.style.margin = '10px';
    settingsElement.appendChild(exportButton);

    exportButton.addEventListener('click', function() {
      const state = JSON.parse(localStorage.getItem('bj101')) || {};
      const cards = state.cards || {};
      let csvContent = 'word,due,interval,ease\n';

      for (const word in cards) {
        const card = cards[word];
        csvContent += `${word},${card.due},${card.interval},${card.ease}\n`;
      }

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'beijing-101-words.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
});