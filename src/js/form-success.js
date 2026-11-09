/* Forms: no backend yet — on submit show the success popup and reset the form */
(() => {
  const popup = document.querySelector('[data-popup]');
  const forms = document.querySelectorAll('.cta-strip__form, .contacts__form');
  if (!popup || !forms.length || typeof popup.showModal !== 'function') return;

  const nameSlot = popup.querySelector('[data-popup-name]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let lastFocus = null;

  const open = (name) => {
    const first = (name || '').trim().split(/\s+/)[0];
    nameSlot.textContent = first ? `, ${first}` : '';
    lastFocus = document.activeElement;
    popup.classList.remove('is-closing');
    popup.showModal();
    document.body.classList.add('is-locked');
  };

  const finishClose = () => {
    popup.classList.remove('is-closing');
    popup.close();
  };

  const close = () => {
    if (!popup.open || popup.classList.contains('is-closing')) return;
    if (reduced.matches) return finishClose();
    popup.classList.add('is-closing');
    popup.querySelector('.popup__card').addEventListener('animationend', finishClose, { once: true });
  };

  popup.addEventListener('close', () => {
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  });

  // Esc → animated close
  popup.addEventListener('cancel', (e) => { e.preventDefault(); close(); });

  // Close button / "Got it" / click on the backdrop
  popup.addEventListener('click', (e) => {
    if (e.target.closest('[data-popup-close]') || e.target === popup) close();
  });

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // TODO: send form data to the real backend / Telegram bot here
      const name = form.elements.name ? form.elements.name.value : '';
      form.reset();
      open(name);
    });
  });
})();
