/* Header: dark on scroll + mobile burger menu */
(() => {
  const header = document.querySelector('[data-header]');
  const burger = document.querySelector('[data-burger]');
  const nav = document.querySelector('[data-nav]');
  if (!header || !burger || !nav) return;

  // --- Dark + blur after leaving the top ---
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Burger ---
  const desktop = window.matchMedia('(min-width: 1200px)');

  const setOpen = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.querySelector('.visually-hidden').textContent = open ? 'Close menu' : 'Menu';
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
  };

  burger.addEventListener('click', () => {
    setOpen(burger.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      burger.focus();
    }
  });

  desktop.addEventListener('change', () => setOpen(false));
})();
