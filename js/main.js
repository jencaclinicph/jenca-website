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

// Install app logic — shared between the top banner and the homepage "Download the App" section
(function () {
  const banner = document.getElementById('installBanner');
  const bannerText = document.getElementById('installBannerText');
  const bannerInstallBtn = document.getElementById('installBtn');
  const dismissBtn = document.getElementById('installDismiss');

  const downloadBtn = document.getElementById('downloadAppBtn');
  const iosInstructions = document.getElementById('iosInstructions');
  const alreadyInstalledNote = document.getElementById('alreadyInstalledNote');

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  const isInAppBrowser = /FBAN|FBAV|Instagram|Messenger/i.test(navigator.userAgent);

  // Homepage section: reflect installed state immediately
  if (isStandalone && downloadBtn) {
    downloadBtn.style.display = 'none';
    if (alreadyInstalledNote) alreadyInstalledNote.style.display = 'block';
  }

  // Top banner: only show if not installed, not dismissed, not in an in-app browser
  if (banner && !isStandalone && !isInAppBrowser && !sessionStorage.getItem('installBannerDismissed')) {
    if (isIOS) {
      bannerText.textContent = '📲 I-install ang JENCA app: i-tap ang Share icon, tapos "Add to Home Screen".';
      banner.classList.add('show');
    }
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      banner.classList.remove('show');
      sessionStorage.setItem('installBannerDismissed', '1');
    });
  }

  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (banner && !isStandalone && !isInAppBrowser && !sessionStorage.getItem('installBannerDismissed')) {
      bannerText.textContent = '📲 I-install ang JENCA app para sa mas mabilis na access.';
      bannerInstallBtn.style.display = 'inline-block';
      banner.classList.add('show');
    }
  });

  async function triggerInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (banner) banner.classList.remove('show');
    } else if (isIOS) {
      if (iosInstructions) iosInstructions.style.display = 'block';
    }
  }

  if (bannerInstallBtn) bannerInstallBtn.addEventListener('click', triggerInstall);
  if (downloadBtn) downloadBtn.addEventListener('click', triggerInstall);

  window.addEventListener('appinstalled', () => {
    if (downloadBtn) downloadBtn.style.display = 'none';
    if (alreadyInstalledNote) alreadyInstalledNote.style.display = 'block';
    if (banner) banner.classList.remove('show');
  });
})();
