/* Scroll reveal for the whole page: [data-reveal] elements fade in and rise a little
   when they reach the screen.
   - Mark an element with data-reveal in HTML. Neighbours with data-reveal
     (same parent) appear one after another automatically.
   - Hiding starts before the first paint: a tiny script in <head> adds .has-reveal.
   - The Hero has its own animation and has no data-reveal.
   - prefers-reduced-motion: .has-reveal is never added, everything is simply visible. */
(() => {
  const root = document.documentElement;
  if (!root.classList.contains('has-reveal')) return;

  const STEP = 0.09;            // s between neighbours
  const MAX_STEPS = 4;
  const DURATION = 1.1;         // s — same as --dur-slow

  const items = [...document.querySelectorAll('[data-reveal]')];

  // Stagger: position among data-reveal siblings
  items.forEach((el) => {
    if (parseFloat(getComputedStyle(el).getPropertyValue('--reveal-delay')) > 0) return;   // a delay set in CSS wins
    const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty('--reveal-delay', `${Math.min(i, MAX_STEPS) * STEP}s`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      // is-revealed stays for good; is-visible only carries the reveal transition
      target.classList.add('is-visible', 'is-revealed');
      const delay = parseFloat(getComputedStyle(target).getPropertyValue('--reveal-delay')) || 0;
      // Afterwards hand the element back to its own transitions (hover effects etc.)
      setTimeout(() => target.classList.remove('is-visible'), (DURATION + delay) * 1000 + 100);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  items.forEach((el) => observer.observe(el));
})();
