/* Settings row showing how long ago the last study session was.
   Written as a clean rewrite: the generated original declared lastStudyDate
   twice and never closed its braces, so it failed to parse. */
document.addEventListener('DOMContentLoaded', function () {
  var settings = document.getElementById('settings');
  if (!settings) return;

  var state = {};
  try {
    state = JSON.parse(localStorage.getItem('bj101')) || {};
  } catch (e) {
    return;
  }

  var last = state.lastStudyDate;
  if (!last) return;

  var then = new Date(last);
  if (isNaN(then.getTime())) return;

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  then.setHours(0, 0, 0, 0);

  var days = Math.round((today.getTime() - then.getTime()) / 86400000);
  if (days < 0) days = 0;

  var row = document.createElement('div');
  row.className = 'settings-row';

  var label = document.createElement('span');
  label.textContent = 'Last studied';

  var value = document.createElement('strong');
  value.textContent = days === 0 ? 'Today' : (days === 1 ? 'Yesterday' : days + ' days ago');

  row.appendChild(label);
  row.appendChild(value);
  settings.appendChild(row);
});
