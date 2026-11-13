document.addEventListener('DOMContentLoaded', function () {
  const settingsElement = document.getElementById('settings');
  if (settingsElement) {
    const printButton = document.createElement('button');
    printButton.textContent = 'Print flashcards';
    printButton.id = 'printFlashcardsButton';
    settingsElement.appendChild(printButton);

    printButton.addEventListener('click', function () {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Flashcards</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .card { display: flex; justify-content: space-between; margin: 10px 0; }
              .hanzi { font-size: 24px; font-weight: bold; }
              .pinyin, .english { font-size: 16px; }
            </style>
          </head>
          <body>
      `);

      if (typeof LESSONS !== 'undefined') {
        LESSONS.forEach(lesson => {
          lesson.words.forEach((word, index) => {
            if (index % 2 === 0) {
              printWindow.document.write(`
                <div class="card">
                  <div class="hanzi">${word.hanzi}</div>
                  <div class="pinyin english">${word.pinyin} / ${word.english}</div>
                </div>
              `);
            }
          });
        });
      }

      printWindow.document.write(`
        </body>
      </html>
      `);
      printWindow.print();
      printWindow.close();
    });
  }
});