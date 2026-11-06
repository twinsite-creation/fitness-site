/* Hero: slider 01–05 — text and background photo change together */
(() => {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  /* ---------- 1. Slider ---------- */
  const slides = [...hero.querySelectorAll('[data-slide]')];
  const images = [...hero.querySelectorAll('[data-slide-image]')];
  const dots = [...hero.querySelectorAll('[data-dot]')];
  const live = hero.querySelector('[data-slides]');
  const toggle = hero.querySelector('[data-slider-toggle]');
  let current = 0;
  let userPaused = false;

  // is-active = shown; is-prev = the one leaving (stays under the new photo while it fades in)
  const setState = (items, prev) => items.forEach((el, i) => {
    el.classList.toggle('is-active', i === current);
    el.classList.toggle('is-prev', i === prev && prev !== current);
  });

  const goTo = (index) => {
    const prev = current;
    current = (index + slides.length) % slides.length;
    setState(slides, prev);
    setState(images, prev);
    slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== current)));
    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('is-active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (!userPaused) schedule(interval);
    else remaining = interval;
  };

  // Autoplay runs until the visitor presses Pause (no pause on hover/focus)
  const setPaused = (paused) => {
    if (paused && !userPaused) {
      clearTimeout(timer);
      remaining -= performance.now() - startedAt;
    } else if (!paused && userPaused) {
      schedule(remaining);
    }
    userPaused = paused;
    hero.classList.toggle('is-paused', paused);
    toggle.textContent = paused ? 'Play' : 'Pause';
    toggle.setAttribute('aria-pressed', String(paused));
    // Announce slide changes only when they are not automatic
    live.setAttribute('aria-live', paused ? 'polite' : 'off');
  };

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Arrow keys move between slides when a number has focus
  hero.querySelector('[data-slider-nav]').addEventListener('keydown', (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    goTo(current + step);
    dots[current].focus();
  });

  // Autoplay timer (the progress line in CSS only shows it)
  const interval = parseFloat(getComputedStyle(hero).getPropertyValue('--slide-interval')) * 1000 || 6000;
  let timer = null;
  let startedAt = 0;
  let remaining = interval;

  const schedule = (ms) => {
    clearTimeout(timer);
    startedAt = performance.now();
    remaining = ms;
    timer = setTimeout(() => goTo(current + 1), ms);
  };

  toggle.addEventListener('click', () => setPaused(!userPaused));

  hero.classList.add('is-playing');
  goTo(0);
  setPaused(false);
})();
