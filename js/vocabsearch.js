document.addEventListener('DOMContentLoaded', function() {
  const vocabList = document.getElementById('vocabList');
  if (vocabList) {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search words…';
    vocabList.parentNode.insertBefore(searchInput, vocabList);

    let searchValue = '';
    searchInput.value = searchValue;
    searchInput.addEventListener('input', function() {
      searchValue = this.value;
      const searchTerm = searchValue.trim().toLowerCase();
      if (searchTerm === '') {
        vocabList.childNodes.forEach(function(item) {
          item.style.display = '';
        });
      } else {
        vocabList.childNodes.forEach(function(item) {
          if (item.nodeType === Node.ELEMENT_NODE && item.textContent.toLowerCase().includes(searchTerm)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      }
    });

    vocabList.addEventListener('DOMNodeInserted', function() {
      if (vocabList.childNodes.length === 0) {
        searchInput.disabled = true;
        searchInput.style.display = 'none';
      }
    });
  }
});