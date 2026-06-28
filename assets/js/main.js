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

  /* ── Mobile menu ── */
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    const menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.innerHTML = `
      <a href="./index.html">Home</a>
      <a href="./html/tech.html">Technology</a>
      <a href="./html/gallery.html">Gallery</a>
      <a href="./html/contact.html">About</a>
      <a href="#kickstarter" class="btn-ks">▲ Back on Kickstarter</a>
    `;
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
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === './' + page || a.getAttribute('href') === page) {
      a.classList.add('active');
    }
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

  /* ── Glow dot follows cursor ── */
  const glow = document.querySelector('.glow-dot');
  if (glow) {
    document.addEventListener('mousemove', (e) => {
      glow.style.transform = `translate(${e.clientX - 350}px, ${e.clientY - 350}px)`;
    });
  }

  /* ── Contact form (mailto fallback + success feedback) ── */
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      const btn = form.querySelector('.btn-submit');
      btn.textContent = '✓ Sent!';
      btn.style.background = '#00ff88';
      btn.style.color = '#000';
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.style.background = '';
        btn.style.color = '';
      }, 3500);
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
