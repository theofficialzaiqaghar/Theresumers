(() => {
  const filters = document.querySelectorAll('[data-port-filter]');
  const cards = document.querySelectorAll('[data-port-card]');

  if (!filters.length || !cards.length) return;

  const setFilter = (value) => {
    filters.forEach((btn) => {
      const active = btn.getAttribute('data-port-filter') === value;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    cards.forEach((card) => {
      const cats = (card.getAttribute('data-categories') || '').split(/\s+/);
      const show = value === 'all' || cats.includes(value);
      card.hidden = !show;
    });
  };

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      setFilter(btn.getAttribute('data-port-filter') || 'all');
    });
  });
})();
