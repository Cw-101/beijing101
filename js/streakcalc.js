document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;

  try {
    const state = JSON.parse(localStorage.getItem('bj101')) || {};
    if (state.lastStudyDate === today) {
      streak = state.completed.length;
    }
  } catch (e) {
    // Ignore parsing errors, default streak to 0
  }

  if (document.getElementById('streakPill')) {
    document.getElementById('streakPill').setAttribute('title', 'Streak computed from stored progress');
  }
});