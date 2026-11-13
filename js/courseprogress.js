document.addEventListener('DOMContentLoaded', function() {
  const streakPill = document.getElementById('streakPill');
  if (streakPill) {
    let completed = [];
    try {
      const raw = JSON.parse(localStorage.getItem('bj101') || '{}') || {};
      completed = Array.isArray(raw.completed) ? raw.completed : [];
    } catch (e) { completed = []; }
    const percentage = Math.round(100 * completed.length / 30);
    
    const progressDiv = document.createElement('div');
    progressDiv.style.display = 'flex';
    progressDiv.style.alignItems = 'center';
    progressDiv.style.marginTop = '8px';

    const barOuter = document.createElement('div');
    barOuter.style.height = '6px';
    barOuter.style.background = '#eee9e1';
    barOuter.style.borderRadius = '9px';
    barOuter.style.width = '100%';
    barOuter.style.position = 'relative';

    const barInner = document.createElement('div');
    barInner.style.height = '100%';
    barInner.style.background = '#c8102e';
    barInner.style.width = `${percentage}%`;
    barInner.style.borderRadius = '9px';

    const caption = document.createElement('div');
    caption.textContent = `${percentage}% of the course`;
    caption.style.marginLeft = '8px';

    barOuter.appendChild(barInner);
    progressDiv.appendChild(barOuter);
    progressDiv.appendChild(caption);

    streakPill.parentNode.insertBefore(progressDiv, streakPill.nextSibling);
  }
});