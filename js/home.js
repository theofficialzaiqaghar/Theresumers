(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const rotator = document.querySelector('[data-hero-rotator]');
  const track = document.querySelector('[data-hero-rotator-track]');
  const live = document.querySelector('[data-hero-rotator-live]');

  if (rotator && track && !reduceMotion) {
    const items = [...track.querySelectorAll('.hero-rotator__item')];
    let index = 0;
    const itemHeight = () => items[0]?.offsetHeight || 0;

    const goTo = (nextIndex, animate = true) => {
      index = nextIndex % items.length;
      const offset = -index * itemHeight();
      track.style.transition = animate ? 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
      track.style.transform = `translateY(${offset}px)`;
      if (live) live.textContent = items[index].textContent;
    };

    const cloneFirst = items[0]?.cloneNode(true);
    if (cloneFirst) {
      cloneFirst.setAttribute('aria-hidden', 'true');
      track.appendChild(cloneFirst);
    }

    let timer = window.setInterval(() => {
      if (index >= items.length - 1) {
        goTo(index + 1);
        window.setTimeout(() => goTo(0, false), 560);
        index = 0;
      } else {
        goTo(index + 1);
      }
    }, 2800);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        window.clearInterval(timer);
      } else {
        timer = window.setInterval(() => {
          if (index >= items.length - 1) {
            goTo(index + 1);
            window.setTimeout(() => goTo(0, false), 560);
            index = 0;
          } else {
            goTo(index + 1);
          }
        }, 2800);
      }
    });

    window.addEventListener('resize', () => goTo(index, false));
  }

  const trustNums = document.querySelectorAll('[data-count]');
  if (trustNums.length && 'IntersectionObserver' in window && !reduceMotion) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = Number(el.getAttribute('data-count'));
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1200;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - (1 - progress) ** 3;
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          countObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    trustNums.forEach((el) => countObserver.observe(el));
  } else {
    trustNums.forEach((el) => {
      el.textContent = (el.getAttribute('data-count') || '0') + (el.getAttribute('data-suffix') || '');
    });
  }

  const quickForm = document.getElementById('quick-inquiry-form');
  const quickSuccess = document.getElementById('quick-inquiry-success');
  const quickError = document.getElementById('quick-inquiry-error');

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value) => value.replace(/\D/g, '').length >= 8;

  quickForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(quickForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const service = String(data.get('service') || '').trim();

    const showError = (message, focusEl) => {
      if (quickError) {
        quickError.hidden = false;
        quickError.textContent = message;
      }
      if (quickSuccess) quickSuccess.hidden = true;
      focusEl?.focus();
    };

    const hideError = () => {
      if (quickError) {
        quickError.hidden = true;
        quickError.textContent = '';
      }
    };

    hideError();

    if (!name) {
      showError('Please enter your name.', quickForm.querySelector('[name="name"]'));
      return;
    }
    if (!email || !isValidEmail(email)) {
      showError('Please enter a valid email address.', quickForm.querySelector('[name="email"]'));
      return;
    }
    if (!phone || !isValidPhone(phone)) {
      showError('Please enter a valid phone number.', quickForm.querySelector('[name="phone"]'));
      return;
    }
    if (!service) {
      showError('Please select a service or package.', quickForm.querySelector('[name="service"]'));
      return;
    }

    const params = new URLSearchParams({ name, email, phone, service });
    const serviceLabel = service.replace(/-/g, ' ');
    if (quickSuccess) {
      quickSuccess.hidden = false;
      quickSuccess.textContent = `Thanks, ${name}. We will follow up about ${serviceLabel} shortly.`;
    }

    window.setTimeout(() => {
      window.location.href = `contact.html?${params.toString()}#contact-form`;
    }, 900);
  });
})();
