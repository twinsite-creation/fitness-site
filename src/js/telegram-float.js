/* Floating Telegram button.
   - Always in the bottom-right corner, so it can be tapped from anywhere on the page.
   - As the footer scrolls in, it glides (with the scroll) onto the Telegram icon in the
     footer and turns into the same outline style; then the real footer icon takes over.
     Scrolling back up sends it back to the corner.
   - The link (href) is taken from the footer icon, so there is only one place to edit.
   - prefers-reduced-motion: no glide — it simply hides when the footer appears. */
(() => {
  const slot = document.querySelector('[data-telegram]');
  const footer = document.querySelector('.footer');
  if (!slot || !footer) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const LEAD = 160;                       // px: the glide starts a bit before the footer shows

  const fab = slot.cloneNode(true);
  fab.className = 'tg-float';
  fab.removeAttribute('data-telegram');
  fab.setAttribute('aria-label', 'Message me on Telegram');
  document.body.append(fab);
  document.documentElement.classList.add('has-tg-float');

  // Resting place of the button (bottom-right corner), measured without any transform
  let rest = null;
  const measure = () => {
    fab.style.transform = 'none';
    rest = fab.getBoundingClientRect();
    update();
  };

  let frame = 0;
  const update = () => {
    frame = 0;
    const box = footer.getBoundingClientRect();
    let p = (window.innerHeight + LEAD - box.top) / (box.height + LEAD);
    p = Math.min(Math.max(p, 0), 1);
    if (reducedMotion.matches) p = p > 0 ? 1 : 0;

    const target = slot.getBoundingClientRect();
    const dx = (target.left + target.width / 2) - (rest.left + rest.width / 2);
    const dy = (target.top + target.height / 2) - (rest.top + rest.height / 2);
    const scale = 1 + (target.width / rest.width - 1) * p;

    fab.style.transform = `translate(${(dx * p).toFixed(1)}px, ${(dy * p).toFixed(1)}px) scale(${scale.toFixed(3)})`;
    fab.style.setProperty('--p', p.toFixed(3));
    document.documentElement.classList.toggle('tg-landed', p >= 0.995);
  };

  const request = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', measure);
  measure();
})();
