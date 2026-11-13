document.addEventListener('DOMContentLoaded', function() {
  const vocabList = document.getElementById('vocabList');
  const searchBox = document.querySelector('.search-box');
  const searchCount = document.createElement('div');
  searchCount.className = 'small muted';
  searchCount.id = 'searchCount';
  vocabList.parentNode.insertBefore(searchCount, vocabList.nextSibling);

  searchBox.addEventListener('input', function() {
    const visibleChildren = vocabList.children.length - vocabList.querySelectorAll('.hidden').length;
    const totalChildren = vocabList.children.length;
    searchCount.textContent = `${visibleChildren} of ${totalChildren} words`;
  });
});