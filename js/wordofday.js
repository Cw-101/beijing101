/* Word of the day card.
   Rewritten: the generated version read lesson.hanzi / lesson.pinyin, but a
   lesson is {d, t, can, words:[[hanzi, pinyin, english], ...]} — so it rendered
   "undefined". This picks a real word, keyed to the day of the year. */
document.addEventListener('DOMContentLoaded', function () {
  // lessons.js declares LESSONS with const, so it is NOT a window property
  if (typeof LESSONS === 'undefined' || !Array.isArray(LESSONS) || !LESSONS.length) return;

  var stats = document.querySelector('.stats') || document.getElementById('stats');
  if (!stats || !stats.parentNode) return;

  var now = new Date();
  var dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);

  var lesson = LESSONS[dayOfYear % LESSONS.length];
  if (!lesson || !Array.isArray(lesson.words) || !lesson.words.length) return;

  var word = lesson.words[dayOfYear % lesson.words.length];
  if (!word) return;

  var card = document.createElement('div');
  card.className = 'card';
  card.style.padding = '16px';
  card.style.marginTop = '14px';

  var eyebrow = document.createElement('div');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'Word of the day';

  var line = document.createElement('div');
  line.style.display = 'flex';
  line.style.alignItems = 'baseline';
  line.style.gap = '12px';
  line.style.marginTop = '6px';

  var hanzi = document.createElement('span');
  hanzi.className = 'hanzi';
  hanzi.textContent = word[0] || '';

  var pinyin = document.createElement('span');
  pinyin.style.color = 'var(--muted)';
  pinyin.textContent = word[1] || '';

  var english = document.createElement('span');
  english.className = 'small';
  english.style.color = 'var(--muted)';
  english.textContent = word[2] || '';

  line.appendChild(hanzi);
  line.appendChild(pinyin);
  line.appendChild(english);
  card.appendChild(eyebrow);
  card.appendChild(line);

  stats.parentNode.insertBefore(card, stats);
});
