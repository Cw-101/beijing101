document.addEventListener('DOMContentLoaded', function () {
  const helpModal = document.createElement('div');
  helpModal.style.position = 'fixed';
  helpModal.style.top = '50%';
  helpModal.style.left = '50%';
  helpModal.style.transform = 'translate(-50%, -50%)';
  helpModal.style.backgroundColor = 'white';
  helpModal.style.padding = '20px';
  helpModal.style.border = '1px solid #ccc';
  helpModal.style.zIndex = '50';
  helpModal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  helpModal.style.maxWidth = '300px';
  helpModal.style.textAlign = 'center';
  helpModal.id = 'keyhelp';
  helpModal.style.display = 'none';
  helpModal.innerHTML = '<h3>Help</h3><p>1-4: Pick answers</p><p>Space: Replay audio</p><p>? (Shift+/): Show this help</p><button onclick="document.body.removeChild(helpModal)">Close</button>';
  document.body.appendChild(helpModal);

  document.addEventListener('keydown', function (e) {
    const t = e.target;
    const typing = t instanceof Element && t.matches('input, textarea, select');
    if ((e.key === '?' || (e.shiftKey && e.key === '/')) && !typing) {
      e.preventDefault();
      helpModal.style.display = 'block';
    }
  });
});