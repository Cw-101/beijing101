document.addEventListener('DOMContentLoaded', function () {
  const settingsElement = document.getElementById('settings');
  if (settingsElement) {
    const timerRow = document.createElement('div');
    timerRow.className = 'settings-row';
    const startButton = document.createElement('button');
    startButton.textContent = 'Start 25-min timer';
    timerRow.appendChild(startButton);

    settingsElement.appendChild(timerRow);

    let timerInterval;
    let timeLeft = 25 * 60;
    let timerRunning = false;

    startButton.addEventListener('click', function () {
      if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        startButton.textContent = 'Start 25-min timer';
        timerRow.querySelector('span').textContent = 'Done — take a break';
      } else {
        clearInterval(timerInterval);
        timeLeft = 25 * 60;
        timerRunning = true;
        startButton.textContent = 'Stop timer';
        timerRow.querySelector('span').textContent = '25:00';

        timerInterval = setInterval(function () {
          timeLeft--;
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          timerRow.querySelector('span').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

          if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerRunning = false;
            startButton.textContent = 'Start 25-min timer';
            timerRow.querySelector('span').textContent = 'Done — take a break';
          }
        }, 1000);
      }
    });

    // Clear interval on pagehide
    window.addEventListener('pagehide', function () {
      clearInterval(timerInterval);
      timerRunning = false;
    });
  }
});