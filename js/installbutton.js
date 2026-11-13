document.addEventListener('DOMContentLoaded', () => {
  let installEvent = null;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installEvent = event;
  });

  const settings = document.getElementById('settings');
  if (installEvent) {
    const installButton = document.createElement('button');
    installButton.textContent = 'Install app';
    installButton.onclick = () => {
      if (installEvent) {
        installEvent.prompt();
        installEvent = null;
        settings.removeChild(installButton);
        installButton.remove();
      }
    };
    // Remove button after 60 seconds if not clicked
    setTimeout(() => {
      if (installButton && settings.contains(installButton)) {
        settings.removeChild(installButton);
        installButton.remove();
      }
    }, 60000);
  }
});