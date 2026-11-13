document.addEventListener('DOMContentLoaded', function() {
  const examElement = document.getElementById('exam');
  if (examElement && !examElement.querySelector('#examTimer')) {
    const timerElement = document.createElement('div');
    timerElement.id = 'examTimer';
    timerElement.className = 'small muted';
    timerElement.textContent = 'Time: 0:00';
    examElement.prepend(timerElement);

    let totalSeconds = 0;
    let timerInterval;

    function startTimer() {
      timerInterval = setInterval(() => {
        if (!examElement.classList.contains('active')) {
          clearInterval(timerInterval);
          return;
        }
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        timerElement.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        totalSeconds++;
      }, 1000);
    }

    function stopTimer() {
      clearInterval(timerInterval);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        stopTimer();
      } else {
        startTimer();
      }
    });

    // Reset timer when exam view leaves active class
    const observer = new MutationObserver(() => {
      if (!examElement.classList.contains('active')) {
        totalSeconds = 0;
        timerElement.textContent = 'Time: 0:00';
        stopTimer();
        // Clear interval on visibilitychange
        if (document.visibilityState === 'hidden') {
          clearInterval(timerInterval);
        }
      }
    });

    observer.observe(examElement, { attributes: true });
  }
});