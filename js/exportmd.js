// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Check if the 'settings' element exists
  const settingsElement = document.getElementById('settings');
  if (settingsElement) {
    // Create the export button
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export notes (Markdown)';
    exportButton.id = 'exportNotesButton';
    settingsElement.appendChild(exportButton);

    // Add event listener to the export button
    exportButton.addEventListener('click', () => {
      // Get the current date
      const currentDate = new Date().toISOString().split('T')[0];

      // Get the number of completed days from localStorage
      const completedDays = localStorage.getItem('bj101') ? JSON.parse(localStorage.getItem('bj101')).completed.length : 0;

      // Create the markdown content
      const markdownContent = `# Beijing 101 Notes

**Date:** ${currentDate}

**Completed Days:** ${completedDays}

## Lessons

| Hanzi | Pinyin | English |
|-------|--------|---------|
`;

      // Check if the LESSONS array exists in the global scope
      if (typeof LESSONS !== 'undefined') {
        // Append each lesson to the markdown content
        LESSONS.forEach(lesson => {
          markdownContent += `| ${lesson.hanzi} | ${lesson.pinyin} | ${lesson.english} |
`;
        });
      }

      // Create a Blob with the markdown content
      const blob = new Blob([markdownContent], { type: 'text/markdown' });

      // Create a temporary anchor element to trigger the download
      const anchor = document.createElement('a');
      anchor.href = URL.createObjectURL(blob);
      anchor.download = 'beijing-101-notes.md';
      anchor.click();

      // Clean up the temporary anchor element
      anchor.remove();
    });
  }
});