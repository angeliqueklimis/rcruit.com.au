/* =============================================
   RCRUIT — js/main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initMobileMenu();
  initScrollReveal();
  initPageTransition();
  setActiveNav();
  initAccordion();
});

/* ─── CUSTOM CURSOR ─── */
function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tickRing() {
    ringX = lerp(ringX, mouseX, 0.10);
    ringY = lerp(ringY, mouseY, 0.10);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(tickRing);
  }
  tickRing();

  // Expand ring on hover over interactive elements
  document.querySelectorAll(
    'a, button, .btn, input, select, textarea, label, ' +
    '.specialism-card, .service-row, .promise-card, .value-card, ' +
    '.process-col, .t-card, .check-item'
  ).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

/* ─── NAVIGATION SCROLL STATE ─── */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function update() {
    if (window.scrollY > 72) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─── MOBILE MENU ─── */
function initMobileMenu() {
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ─── SCROLL REVEAL ─── */
function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -48px 0px'
  });

  els.forEach(el => io.observe(el));
}

/* ─── PAGE TRANSITIONS ─── */
function initPageTransition() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  // Reveal page on load: fade overlay out
  requestAnimationFrame(() => {
    overlay.classList.add('out');
  });

  // Cover page before navigating: fade overlay in, then navigate
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      link.hasAttribute('target')
    ) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      const dest = href;
      overlay.classList.remove('out');
      overlay.classList.add('in');
      setTimeout(() => {
        window.location.href = dest;
      }, 580);
    });
  });
}

/* ─── ACTIVE NAV LINK ─── */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mob-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const match = href === page || (page === '' && href === 'index.html');
    if (match) link.classList.add('active');
  });
}

/* ─── SERVICE ACCORDION ─── */
function initAccordion() {
  const headers = document.querySelectorAll('.service-row-header');
  if (!headers.length) return;

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const isOpen = header.getAttribute('aria-expanded') === 'true';
      const bodyId = header.getAttribute('aria-controls');
      const body   = document.getElementById(bodyId);

      // Close all
      headers.forEach(h => {
        h.setAttribute('aria-expanded', 'false');
        const b = document.getElementById(h.getAttribute('aria-controls'));
        if (b) b.classList.remove('open');
      });

      // Open clicked one if it was closed
      if (!isOpen && body) {
        header.setAttribute('aria-expanded', 'true');
        body.classList.add('open');
      }
    });
  });
}
