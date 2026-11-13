/* High-contrast toggle for Settings.
   Rewritten: the generated version only added the toggle when high contrast was
   ALREADY on, so it could never be switched on in the first place. */
document.addEventListener('DOMContentLoaded', function () {
  var KEY = 'bj101hc';
  var on = false;
  try { on = localStorage.getItem(KEY) === '1'; } catch (e) {}

  if (on) document.body.classList.add('hc');

  var style = document.createElement('style');
  style.textContent =
    'body.hc { --ink:#000; --muted:#2b2b2b; --line:#000; }' +
    'body.hc .card { border-width:2px; }';
  document.head.appendChild(style);

  var settings = document.getElementById('settings');
  if (!settings) return;

  var row = document.createElement('div');
  row.className = 'settings-row';

  var label = document.createElement('label');
  label.textContent = 'High contrast';
  label.setAttribute('for', 'hc-toggle');

  var box = document.createElement('input');
  box.type = 'checkbox';
  box.id = 'hc-toggle';
  box.className = 'toggle';
  box.checked = on;

  box.addEventListener('change', function () {
    document.body.classList.toggle('hc', box.checked);
    try { localStorage.setItem(KEY, box.checked ? '1' : '0'); } catch (e) {}
  });

  row.appendChild(label);
  row.appendChild(box);
  settings.appendChild(row);
});
