(() => {
  const FORM_EMAIL = 'support@theresumer.co.uk';
  const form = document.getElementById('contact-inquiry-form');
  const success = document.getElementById('contact-success');
  const statusEl = document.getElementById('contact-form-status');

  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const prefillName = params.get('name');
  const prefillEmail = params.get('email');
  const prefillPhone = params.get('phone');
  const prefillService = params.get('service');

  if (prefillName) {
    const nameInput = form.querySelector('[name="name"]');
    if (nameInput && !nameInput.value) nameInput.value = prefillName;
  }

  if (prefillEmail) {
    const emailInput = form.querySelector('[name="email"]');
    if (emailInput && !emailInput.value) emailInput.value = prefillEmail;
  }

  if (prefillPhone) {
    const phoneInput = form.querySelector('[name="phone"]');
    if (phoneInput && !phoneInput.value) phoneInput.value = prefillPhone;
  }

  if (prefillService) {
    const serviceSelect = form.querySelector('[name="service"]');
    const packageMap = {
      'silver-package': 'silver-package',
      'gold-package': 'gold-package',
      'platinum-package': 'platinum-package',
      'career-transition': 'career-transition',
      'job-application': 'job-application',
      '90-day-boost': '90-day-boost',
      consultation: 'multiple',
      'cover-letter': 'cover-letter',
      'linkedin-marketing': 'linkedin-marketing',
      'linkedin-premium': 'linkedin-premium',
      biography: 'biography',
      'company-profile': 'company-profile',
      'interview-coaching': 'interview-coaching',
    };
    const mapped = packageMap[prefillService] || prefillService;
    if (serviceSelect) {
      const option = [...serviceSelect.options].find((opt) => opt.value === mapped);
      if (option) serviceSelect.value = mapped;
    }
  }

  const packagePrefill = [
    'silver-package',
    'gold-package',
    'platinum-package',
    'career-transition',
    'job-application',
    '90-day-boost',
    'consultation',
  ];
  if (prefillService && packagePrefill.includes(prefillService)) {
    const messageInput = form.querySelector('[name="message"]');
    const labels = {
      'silver-package': 'Silver Career Boost package',
      'gold-package': 'Gold Career Accelerator package',
      'platinum-package': 'Platinum Executive Suite package',
      'career-transition': 'Career transition package',
      'job-application': 'Job application package (monthly)',
      '90-day-boost': '90-day career boost program',
      consultation: 'free consultation',
    };
    const line = `I am interested in the ${labels[prefillService] || prefillService}.\n\n`;
    if (messageInput && !messageInput.value.trim()) messageInput.value = line;
  }

  const serviceLabels = {
    'cv-writing': 'CV writing',
    'cover-letter': 'Cover letter',
    'linkedin-profile': 'LinkedIn profile revamp',
    'linkedin-marketing': 'LinkedIn marketing strategy',
    'linkedin-premium': 'LinkedIn Premium setup',
    biography: 'Professional biography',
    'company-profile': 'Company profile',
    'interview-coaching': 'Interview coaching',
    'content-writing': 'Content writing',
    multiple: 'Multiple services',
    'silver-package': 'Silver Career Boost',
    'gold-package': 'Gold Career Accelerator',
    'platinum-package': 'Platinum Executive Suite',
    'career-transition': 'Career transition package',
    'job-application': 'Job application package',
    '90-day-boost': '90-day career boost',
    'recruiter-access': 'Recruiter direct access',
    consultation: 'Free consultation',
  };

  const setFieldError = (field, message) => {
    const wrap = field.closest('.form-field');
    if (!wrap) return;
    const errorEl = wrap.querySelector('.form-field__error');
    wrap.classList.toggle('is-invalid', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  };

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validate = () => {
    let valid = true;
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const service = form.querySelector('[name="service"]');
    const message = form.querySelector('[name="message"]');
    const hp = form.querySelector('[name="hp"]');

    if (hp?.value) {
      return false;
    }

    if (!name?.value.trim()) {
      setFieldError(name, 'Please enter your name.');
      valid = false;
    } else {
      setFieldError(name, '');
    }

    if (!email?.value.trim() || !validateEmail(email.value.trim())) {
      setFieldError(email, 'Please enter a valid email address.');
      valid = false;
    } else {
      setFieldError(email, '');
    }

    if (!service?.value) {
      setFieldError(service, 'Please select a service.');
      valid = false;
    } else {
      setFieldError(service, '');
    }

    if (!message?.value.trim() || message.value.trim().length < 20) {
      setFieldError(message, 'Please add a message of at least 20 characters.');
      valid = false;
    } else {
      setFieldError(message, '');
    }

    return valid;
  };

  const showStatus = (message, isError = false) => {
    if (!statusEl) return;
    statusEl.hidden = !message;
    statusEl.textContent = message || '';
    statusEl.className = `contact-form__status${isError ? ' contact-form__status--error' : ''}`;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    showStatus('');

    if (!validate()) {
      showStatus('Please fix the highlighted fields and try again.', true);
      form.querySelector('.form-field.is-invalid input, .form-field.is-invalid select, .form-field.is-invalid textarea')?.focus();
      return;
    }

    const data = new FormData(form);
    const name = String(data.get('name')).trim();
    const email = String(data.get('email')).trim();
    const phone = String(data.get('phone') || '').trim();
    const service = String(data.get('service'));
    const timeline = String(data.get('timeline') || '').trim();
    const message = String(data.get('message')).trim();

    const paramService = params.get('service');
    const serviceLabel =
      (paramService && serviceLabels[paramService]) || serviceLabels[service] || service;
    const subject = encodeURIComponent(`TheResumer inquiry — ${serviceLabel}`);
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Service: ${serviceLabel}`,
      timeline ? `Timeline: ${timeline}` : null,
      '',
      message,
    ].filter(Boolean);

    const body = encodeURIComponent(bodyLines.join('\n'));
    const mailto = `mailto:${FORM_EMAIL}?subject=${subject}&body=${body}`;

    form.classList.add('is-hidden');
    if (success) {
      success.hidden = false;
      success.focus();
    }

    window.setTimeout(() => {
      window.location.href = mailto;
    }, 400);
  });

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      if (field.closest('.form-field')?.classList.contains('is-invalid')) {
        setFieldError(field, '');
      }
    });
  });
})();
