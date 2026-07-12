document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burgerBtn');
  const links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', () => {
      links.classList.toggle('open');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        document.body.style.overflow = '';
      })
    );
  }
});

// Register service worker for offline support + installability (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}

// Install app logic — powers the "Download the App" section on the homepage
(function () {
  const downloadBtn = document.getElementById('downloadAppBtn');
  const iosInstructions = document.getElementById('iosInstructions');
  const alreadyInstalledNote = document.getElementById('alreadyInstalledNote');
  if (!downloadBtn) return;

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;

  if (isStandalone) {
    downloadBtn.style.display = 'none';
    if (alreadyInstalledNote) alreadyInstalledNote.style.display = 'block';
    return;
  }

  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  downloadBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    } else if (isIOS) {
      if (iosInstructions) iosInstructions.style.display = 'block';
    }
  });

  window.addEventListener('appinstalled', () => {
    downloadBtn.style.display = 'none';
    if (alreadyInstalledNote) alreadyInstalledNote.style.display = 'block';
  });
})();
