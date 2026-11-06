/* Result counter: counts up from 0 to data-target when the block scrolls into view.
   Without JS or with prefers-reduced-motion the final number is simply shown. */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const DURATION = 2000;                       // ms

  document.querySelectorAll('[data-counter]').forEach((counter) => {
    const valueEl = counter.querySelector('[data-counter-value]');
    const target = Number(counter.dataset.target);
    if (!valueEl || !target) return;
    valueEl.textContent = '0';

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / DURATION, 1);
        const eased = 1 - Math.pow(1 - t, 4);  // fast start, soft finish
        valueEl.textContent = Math.round(target * eased);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    observer.observe(counter);
  });
})();
