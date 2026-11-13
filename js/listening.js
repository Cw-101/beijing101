/* Listening and tone drills.
 *
 * The app has only ever tested recognition with the characters visible. These
 * two drills play audio first and ask for meaning, which is the skill a learner
 * actually needs on a street in Beijing:
 *
 *   Listening — hear a word you have been taught, choose the English meaning
 *   Tone      — hear one syllable from a minimal-pair family (mā/má/mǎ/mà),
 *               choose which one it was. No text hint, only the sound.
 *
 * Self-mounting: injects a panel at the top of the Review view and needs no
 * changes to the engine. Uses the global speak()/LESSONS from index.html.
 */
(function () {
  'use strict';

  var toneless = function (p) {
    return String(p)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s'’·]/g, '')
      .toLowerCase();
  };

  var shuffle = function (a) {
    var arr = a.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  };

  function allWords() {
    if (typeof LESSONS === 'undefined' || !Array.isArray(LESSONS)) return [];
    var out = [];
    LESSONS.forEach(function (lesson) {
      (lesson.words || []).forEach(function (w) {
        if (!out.some(function (x) { return x[0] === w[0]; })) out.push(w);
      });
    });
    return out;
  }

  function learnedWords() {
    var all = allWords();
    var cards = {};
    try { cards = (JSON.parse(localStorage.getItem('bj101') || '{}') || {}).cards || {}; } catch (e) {}
    var known = all.filter(function (w) { return cards[w[0]]; });
    return known.length >= 4 ? known : all;
  }

  /* syllable family: same toneless pinyin, different tones */
  function toneFamilies() {
    var groups = {};
    allWords().forEach(function (w) {
      var key = toneless(w[1]);
      if (!key) return;
      (groups[key] = groups[key] || []).push(w);
    });
    return Object.keys(groups)
      .map(function (k) { return groups[k]; })
      .filter(function (g) { return g.length >= 2 && g.length <= 4; });
  }

  var panel, body, score = { right: 0, total: 0 };

  function feedback(text, good) {
    var el = body.querySelector('.drill-feedback');
    if (!el) return;
    el.textContent = text;
    el.className = 'feedback drill-feedback ' + (good ? 'good' : 'bad');
  }

  function renderListening() {
    var pool = learnedWords();
    if (pool.length < 4) {
      body.innerHTML = '<p class="footer-note">Learn a few words first — this drill needs at least four.</p>';
      return;
    }
    var correct = pool[Math.floor(Math.random() * pool.length)];
    var distractors = shuffle(pool.filter(function (w) { return w[0] !== correct[0]; })).slice(0, 3);
    var options = shuffle([correct].concat(distractors));

    body.innerHTML =
      '<p class="instruction">Listen, then choose what you heard. No characters shown until you answer.</p>' +
      '<button class="primary" id="drillPlay">▶ Play again</button>' +
      '<div class="choice-list" style="margin-top:14px">' +
      options.map(function (w) {
        return '<button class="choice" data-pick="' + w[0].replace(/"/g, '&quot;') + '">' + w[2] + '</button>';
      }).join('') +
      '</div><div class="feedback drill-feedback"></div>';

    var say = function () { try { speak(correct[0]); } catch (e) {} };
    body.querySelector('#drillPlay').addEventListener('click', say);
    say();

    body.querySelectorAll('[data-pick]').forEach(function (b) {
      b.addEventListener('click', function () {
        var ok = b.dataset.pick === correct[0];
        score.total++;
        if (ok) score.right++;
        b.classList.add(ok ? 'correct' : 'selected');
        body.querySelectorAll('[data-pick]').forEach(function (x) { x.disabled = true; });
        feedback(
          (ok ? 'Yes — ' : 'No — it was ') + correct[0] + ' (' + correct[1] + '), ' + correct[2] + '.',
          ok
        );
        var next = document.createElement('button');
        next.className = 'secondary';
        next.textContent = 'Next →';
        next.style.marginTop = '12px';
        next.addEventListener('click', renderListening);
        body.appendChild(next);
      });
    });
  }

  function renderTones() {
    var families = toneFamilies();
    if (!families.length) {
      body.innerHTML = '<p class="footer-note">No tone families available yet. Finish day 1 first.</p>';
      return;
    }
    var family = families[Math.floor(Math.random() * families.length)];
    var correct = family[Math.floor(Math.random() * family.length)];

    body.innerHTML =
      '<p class="instruction">Same syllable, different tone. Listen and pick which one you heard.</p>' +
      '<button class="primary" id="tonePlay">▶ Play again</button>' +
      '<div class="choice-list" style="margin-top:14px">' +
      family.map(function (w) {
        return '<button class="choice" data-tone="' + w[0] + '">' +
               '<span class="hanzi" style="font-size:22px">' + w[0] + '</span> ' +
               '<span class="small muted">' + w[1] + '</span></button>';
      }).join('') +
      '</div><div class="feedback drill-feedback"></div>';

    var say = function () { try { speak(correct[0]); } catch (e) {} };
    body.querySelector('#tonePlay').addEventListener('click', say);
    say();

    body.querySelectorAll('[data-tone]').forEach(function (b) {
      b.addEventListener('click', function () {
        var ok = b.dataset.tone === correct[0];
        score.total++;
        if (ok) score.right++;
        b.classList.add(ok ? 'correct' : 'selected');
        body.querySelectorAll('[data-tone]').forEach(function (x) { x.disabled = true; });
        feedback((ok ? 'Correct — ' : 'It was ') + correct[0] + ' (' + correct[1] + '), ' + correct[2] + '.', ok);
        var next = document.createElement('button');
        next.className = 'secondary';
        next.textContent = 'Next →';
        next.style.marginTop = '12px';
        next.addEventListener('click', renderTones);
        body.appendChild(next);
      });
    });
  }

  function mount() {
    var review = document.getElementById('review');
    if (!review || document.getElementById('drillPanel')) return;

    panel = document.createElement('div');
    panel.id = 'drillPanel';
    panel.className = 'card';
    panel.style.padding = '20px';
    panel.style.marginBottom = '18px';
    panel.innerHTML =
      '<div class="eyebrow">Train your ear</div>' +
      '<h3 style="margin:6px 0 4px">Listening drills</h3>' +
      '<p class="small muted" style="margin:0 0 12px">Recognition with your eyes closed. ' +
      'The review queue below tests reading; these test hearing.</p>' +
      '<button class="secondary" id="drillListening">Listening drill</button> ' +
      '<button class="secondary" id="drillTones">Tone drill</button>' +
      '<div id="drillBody" style="margin-top:14px"></div>';
    review.insertBefore(panel, review.firstChild);

    body = panel.querySelector('#drillBody');
    panel.querySelector('#drillListening').addEventListener('click', renderListening);
    panel.querySelector('#drillTones').addEventListener('click', renderTones);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
