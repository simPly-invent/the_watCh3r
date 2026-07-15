/* w.js — shared interactions for The Watcher "W Series" site */
(function () {
  'use strict';

  /* ── Kickstarter URL — single source of truth ──
     When Kickstarter validates the campaign and gives you the final URL,
     change ONLY this constant: every Kickstarter link on every page
     is rewritten from it. */
  const KICKSTARTER_URL = 'https://www.kickstarter.com/profile/the-watch3r';
  document.querySelectorAll('a[href^="https://www.kickstarter.com"]').forEach(a => {
    a.href = KICKSTARTER_URL;
  });

  /* ── Mobile menu overlay ── */
  const menu = document.getElementById('menu');
  const menuBtn = document.querySelector('.menu-btn');
  if (menu && menuBtn) {
    const closeBtn = menu.querySelector('.menu-close');
    const setOpen = (open) => {
      menu.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', open);
    };
    menuBtn.addEventListener('click', () => setOpen(true));
    closeBtn.addEventListener('click', () => setOpen(false));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  /* ── Band/panel observer: counter + text reveals + progress bars ── */
  const sections = document.querySelectorAll('.panel, .band');
  const counter = document.getElementById('counter');

  if (sections.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        if (counter && entry.target.dataset.i) {
          counter.textContent = 'W' + entry.target.dataset.i + ' / ' + counter.dataset.total;
        }
        entry.target.querySelectorAll('.pbar .fill').forEach(f => {
          f.style.width = f.dataset.w;
        });
      });
    }, { threshold: 0.35 });

    sections.forEach(s => obs.observe(s));
  } else {
    sections.forEach(s => {
      s.classList.add('in');
      s.querySelectorAll('.pbar .fill').forEach(f => { f.style.width = f.dataset.w; });
    });
  }

  /* ── Gallery lightbox ── */
  const shots = document.querySelectorAll('.gallery-stack .frame');
  if (shots.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<img alt=""><figcaption></figcaption>';
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('img');
    const lbCap = lb.querySelector('figcaption');

    shots.forEach(f => {
      const img = f.querySelector('img');
      if (!img) return;
      f.addEventListener('click', () => {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        const cap = f.querySelector('figcaption span');
        lbCap.textContent = cap ? cap.textContent : img.alt;
        lb.classList.add('open');
      });
    });

    lb.addEventListener('click', () => lb.classList.remove('open'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lb.classList.remove('open');
    });
  }

  /* ── Supporters list ──
     Add backer names to assets/data/supporters.json — no HTML edit needed. */
  const supList = document.getElementById('supporters-list');
  if (supList) {
    fetch(supList.dataset.src)
      .then(r => r.json())
      .then(names => {
        if (!Array.isArray(names) || names.length === 0) return;
        const empty = document.getElementById('supporters-empty');
        if (empty) empty.remove();
        names.forEach(name => {
          const li = document.createElement('li');
          li.textContent = name;
          supList.appendChild(li);
        });
      })
      .catch(() => {}); /* offline / file:// — keep the "be the first" message */
  }

})();
