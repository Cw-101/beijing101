document.addEventListener('DOMContentLoaded', function() {
  const vocabList = document.getElementById('vocabList');
  if (vocabList) {
    const printButton = document.createElement('button');
    printButton.textContent = 'Print list';
    vocabList.appendChild(printButton);

    printButton.addEventListener('click', function() {
      window.print();
    });

    // Inject print styles
    const style = document.createElement('style');
    style.textContent = "\n@media print {\n  .sidebar, .topbar, #printButton {\n    display: none;\n  }\n}";
    document.head.appendChild(style);
  }
});