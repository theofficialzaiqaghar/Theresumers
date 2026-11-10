(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-links');
  const serviceToggle = document.getElementById('services-menu-toggle');
  const serviceMenu = document.getElementById('services-menu');
  const backToTop = document.querySelector('.back-to-top');

  const setMenuOpen = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute(
      'aria-label',
      open ? 'Close navigation menu' : 'Open navigation menu'
    );
    document.body.style.overflow = open ? 'hidden' : '';
  };

  const setServicesOpen = (open) => {
    if (!serviceToggle || !serviceMenu) return;
    serviceToggle.setAttribute('aria-expanded', String(open));
    serviceMenu.hidden = !open;
  };

  serviceToggle?.addEventListener('click', () => {
    setServicesOpen(serviceToggle.getAttribute('aria-expanded') !== 'true');
  });

  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setMenuOpen(open);
    if (open) menu?.querySelector('a, button')?.focus();
  });

  menu?.addEventListener('click', (event) => {
    if (event.target.closest('.nav__dropdown-menu a')) setServicesOpen(false);
    if (event.target.closest('a:not(.nav__dropdown-toggle)')) setMenuOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && serviceToggle?.getAttribute('aria-expanded') === 'true') {
      setServicesOpen(false);
      serviceToggle.focus();
    }
    if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
      setMenuOpen(false);
      toggle?.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (serviceMenu && !event.target.closest('.nav__dropdown')) setServicesOpen(false);
    if (nav?.classList.contains('is-open') && !nav.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  const desktopNav = window.matchMedia('(min-width: 960px)');
  desktopNav.addEventListener?.('change', (event) => {
    if (event.matches) {
      setMenuOpen(false);
      setServicesOpen(false);
      document.body.style.overflow = '';
    }
  });

  const navLinks = [...document.querySelectorAll('.nav__links a[href^="#"]')];
  const sections = navLinks
    .map((link) => [link, document.getElementById(link.getAttribute('href').slice(1))])
    .filter(([, section]) => section);

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const [link, section] of sections) {
            const active = section === entry.target;
            link.classList.toggle('is-active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          }
        }
      },
      { rootMargin: '-42% 0px -52% 0px' }
    );
    sections.forEach(([, section]) => observer.observe(section));
  }

  let scrollTicking = false;
  const updateScrollUI = () => {
    const y = window.scrollY;
    nav?.classList.toggle('is-scrolled', y > 8);
    if (backToTop) backToTop.hidden = y < 480;
    scrollTicking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(updateScrollUI);
    },
    { passive: true }
  );
  updateScrollUI();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  document.querySelectorAll('[data-stagger]').forEach((group) => {
    const items = group.querySelectorAll('[data-reveal]');
    items.forEach((el, i) => {
      if (!reduceMotion) {
        el.style.transitionDelay = `${Math.min(i * 85, 595)}ms`;
      }
    });
  });

  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
  }

  document.querySelectorAll('.faq-item button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('button')?.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
})();
