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

// App install modal — triggered from the "Get the App" footer link
(function () {
  const overlay = document.getElementById('appModalOverlay');
  const closeBtn = document.getElementById('appModalClose');
  const openLink = document.getElementById('openAppModalFooter');
  const downloadBtn = document.getElementById('downloadAppBtn');
  const iosInstructions = document.getElementById('iosInstructions');
  const alreadyInstalledNote = document.getElementById('alreadyInstalledNote');
  if (!overlay) return;

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (isStandalone) {
      downloadBtn.style.display = 'none';
      alreadyInstalledNote.style.display = 'block';
    }
  }
  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openLink) openLink.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
      } else if (isIOS) {
        iosInstructions.style.display = 'block';
      } else {
        iosInstructions.innerHTML = '<strong>To install:</strong> tap your browser menu (⋮) and select "Install app" or "Add to Home Screen". If you don\'t see this option, try browsing this site in Chrome directly (not inside Messenger/Facebook).';
        iosInstructions.style.display = 'block';
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    downloadBtn.style.display = 'none';
    alreadyInstalledNote.style.display = 'block';
  });
})();
