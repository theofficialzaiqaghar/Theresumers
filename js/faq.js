(() => {
  const root = document.getElementById('faq-root');
  if (!root || !window.FAQ_CATEGORIES) return;

  const getLang = () =>
    document.documentElement.lang?.startsWith('ar') ? 'ar' : 'en';

  const escapeHtml = (str) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const render = () => {
    const lang = getLang();
    let html = '';
    let itemIndex = 0;

    window.FAQ_CATEGORIES.forEach((category) => {
      html += `<section class="faq-category" aria-labelledby="faq-cat-${category.id}">
        <h2 class="faq-category__title" id="faq-cat-${category.id}">${escapeHtml(category.title[lang])}</h2>
        <div class="faq-list">`;

      category.items.forEach((item) => {
        itemIndex += 1;
        const btnId = `faq-btn-${itemIndex}`;
        const panelId = `faq-panel-${itemIndex}`;
        html += `<div class="faq-item">
          <button type="button" aria-expanded="false" aria-controls="${panelId}" id="${btnId}">
            ${escapeHtml(item.q[lang])}
            <svg class="ico" aria-hidden="true"><use href="#i-chevron" /></svg>
          </button>
          <div class="faq-item__panel" id="${panelId}" role="region" aria-labelledby="${btnId}">
            <div class="faq-item__panel-inner">
              <p>${escapeHtml(item.a[lang])}</p>
            </div>
          </div>
        </div>`;
      });

      html += `</div></section>`;
    });

    root.innerHTML = html;
  };

  render();

  document.addEventListener('theresumer:lang', () => {
    render();
  });

  root.addEventListener('click', (event) => {
    const btn = event.target.closest('.faq-item button');
    if (!btn) return;
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('is-open');
    root.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove('is-open');
        openItem.querySelector('button')?.setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.toggle('is-open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
})();
