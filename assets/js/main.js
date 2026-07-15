/* main.js — UI interactions for The Watcher site */
(function () {

  /* ── Navbar scroll opacity ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.background = window.scrollY > 60
        ? 'rgba(13, 13, 13, 0.98)'
        : 'rgba(13, 13, 13, 0.92)';
    });
  }

  /* ── Mobile menu ──
     Built by cloning the real navbar links so hrefs stay correct
     from any page depth (/index.html or /html/*.html). */
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && navbar) {
    const menu = document.createElement('div');
    menu.className = 'mobile-menu';

    navbar.querySelectorAll('.nav-links a').forEach(link => {
      menu.appendChild(link.cloneNode(true));
    });
    const ks = navbar.querySelector('.btn-ks');
    if (ks) menu.appendChild(ks.cloneNode(true));

    document.body.appendChild(menu);

    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.textContent = open ? '✕' : '☰';
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        toggle.textContent = '☰';
      }
    });
  }

  /* ── Active nav link ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const target = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
    if (target === page) a.classList.add('active');
  });

  /* ── Progress bars (animate on scroll into view) ── */
  const fills = document.querySelectorAll('.progress-fill');
  if (fills.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = el.dataset.width;
          requestAnimationFrame(() => { el.style.width = target; });
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    fills.forEach(f => obs.observe(f));
  }

  /* ── Gallery lightbox ── */
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close">✕</button>
      <img alt="">
      <figcaption></figcaption>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('img');
    const lbCaption = lightbox.querySelector('figcaption');

    galleryItems.forEach(item => {
      const img = item.querySelector('img');
      if (!img) return;
      item.addEventListener('click', () => {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbCaption.textContent =
          (item.querySelector('.gallery-overlay span') || {}).textContent || img.alt;
        lightbox.classList.add('open');
      });
    });

    lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lightbox.classList.remove('open');
    });
  }

  /* ── Fade-in on scroll ── */
  const fadeEls = document.querySelectorAll('.feature-card, .stat-card, .spec-card, .timeline-item, .roadmap-item');
  if (fadeEls.length) {
    const style = document.createElement('style');
    style.textContent = `
      .fade-hidden { opacity: 0; transform: translateY(18px); transition: opacity 0.55s ease, transform 0.55s ease; }
      .fade-in { opacity: 1; transform: none; }
    `;
    document.head.appendChild(style);

    fadeEls.forEach(el => el.classList.add('fade-hidden'));

    const fadeObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          fadeObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(el => fadeObs.observe(el));
  }

})();
