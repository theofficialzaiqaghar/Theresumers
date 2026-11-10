(() => {
  const STORAGE_KEY = 'theresumer-lang';
  const DEFAULT_LANG = 'en';

  const STRINGS = {
    en: {
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.services': 'Services',
      'nav.portfolio': 'Portfolio',
      'nav.faq': 'FAQ',
      'nav.contact': 'Contact',
      'nav.consult': 'Request a consultation',
      'nav.getStarted': 'Get started',
      'nav.allServices': 'All services',
      'nav.langLabel': 'Language',
      'footer.explore': 'Explore',
      'footer.services': 'Services',
      'footer.privacy': 'Privacy policy',
      'saudi.eyebrow': 'Saudi Arabia & GCC',
      'saudi.title': 'Why we stand out in Saudi Arabia',
      'saudi.lead':
        'From Riyadh to Dubai, employers expect GCC-ready documents—not generic templates. This is what THE RESUMER delivers every day.',
      'saudi.1': '20+ active partnerships with leading recruiters and headhunters across Saudi Arabia',
      'saudi.2': '100% Saudi market understanding of local business culture and expectations',
      'saudi.3': 'Industry-specific expertise across all major GCC sectors',
      'saudi.4': 'Bilingual Arabic and English professional writing',
      'saudi.5': 'Fast turnaround without compromising on quality',
      'saudi.6': 'Confidentiality guaranteed for every client',
      'testi.stories': 'Real success stories',
      'testi.exec': 'Executive testimonials',
      'testi.viewFaq': 'Read full FAQ',
      'home.faqTeaser': 'Questions about refunds, revisions, ATS, or the Saudi market?',
    },
    ar: {
      'nav.home': 'الرئيسية',
      'nav.about': 'من نحن',
      'nav.services': 'الخدمات',
      'nav.portfolio': 'أعمالنا',
      'nav.faq': 'الأسئلة الشائعة',
      'nav.contact': 'تواصل',
      'nav.consult': 'احجز استشارة',
      'nav.getStarted': 'ابدأ الآن',
      'nav.allServices': 'كل الخدمات',
      'nav.langLabel': 'اللغة',
      'footer.explore': 'استكشف',
      'footer.services': 'الخدمات',
      'footer.privacy': 'سياسة الخصوصية',
      'saudi.eyebrow': 'السعودية والخليج',
      'saudi.title': 'لماذا نتميز في المملكة العربية السعودية',
      'saudi.lead':
        'من الرياض إلى دبي، يتوقع أصحاب العمل مستندات مهنية جاهزة لسوق الخليج—وليس قوالب عامة. هذا ما يقدمه ذا ريزيومر.',
      'saudi.1': 'أكثر من 20 شراكة مع مسؤولي التوظيف والباحثين عن الكفاءات في السعودية',
      'saudi.2': 'فهم كامل لثقافة الأعمال وتوقعات سوق المملكة',
      'saudi.3': 'خبرة قطاعية في جميع القطاعات الرئيسية في الخليج',
      'saudi.4': 'كتابة احترافية ثنائية اللغة العربية والإنجليزية',
      'saudi.5': 'تسليم سريع دون التنازل عن الجودة',
      'saudi.6': 'سرية تامة لجميع العملاء',
      'testi.stories': 'قصص نجاح حقيقية',
      'testi.exec': 'شهادات تنفيذية',
      'testi.viewFaq': 'اقرأ الأسئلة الشائعة كاملة',
      'home.faqTeaser': 'أسئلة عن الاسترداد أو المراجعات أو ATS أو سوق السعودية؟',
    },
  };

  const getStoredLang = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'ar' ? 'ar' : DEFAULT_LANG;
  };

  const ensureArabicFont = () => {
    if (document.getElementById('font-noto-arabic')) return;
    const link = document.createElement('link');
    link.id = 'font-noto-arabic';
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  };

  const applyStrings = (lang) => {
    const pack = STRINGS[lang] || STRINGS.en;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key || !pack[key]) return;
      el.textContent = pack[key];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (pack[key]) el.setAttribute('aria-label', pack[key]);
    });
  };

  const updateLangButtons = (lang) => {
    document.querySelectorAll('[data-set-lang]').forEach((btn) => {
      const active = btn.getAttribute('data-set-lang') === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  };

  const setLang = (lang) => {
    const useAr = lang === 'ar';
    document.documentElement.lang = useAr ? 'ar' : 'en-GB';
    document.documentElement.dir = useAr ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-ar', useAr);
    if (useAr) ensureArabicFont();
    localStorage.setItem(STORAGE_KEY, useAr ? 'ar' : 'en');
    applyStrings(useAr ? 'ar' : 'en');
    updateLangButtons(useAr ? 'ar' : 'en');
    document.dispatchEvent(
      new CustomEvent('theresumer:lang', { detail: { lang: useAr ? 'ar' : 'en' } })
    );
  };

  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-set-lang]');
    if (!btn) return;
    setLang(btn.getAttribute('data-set-lang'));
  });

  setLang(getStoredLang());

  window.TheResumerI18n = { setLang, STRINGS };
})();
