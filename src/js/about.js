/* About: rotating photo globe + training split panel.
   - Globe spins slowly by itself (never follows the cursor).
   - Hover a photo (desktop) → globe eases to a stop, panel shows that exercise.
   - Tap a photo (mobile) or the ‹ › arrows → panel shows it, globe pauses for a moment.
   - Otherwise the panel follows the photo that is currently in front. */
(() => {
  const root = document.querySelector('[data-about]');
  if (!root) return;

  const globe = root.querySelector('[data-globe]');
  const tiles = [...root.querySelectorAll('.globe__tile')];
  const items = [...root.querySelectorAll('.about__slide')];
  const current = root.querySelector('[data-about-current]');
  const indexEl = root.querySelector('[data-about-index]');
  const percentEl = root.querySelector('[data-about-percent]');
  const fillEl = root.querySelector('[data-about-fill]');
  const kcalEl = root.querySelector('[data-about-kcal]');
  const kcalFillEl = root.querySelector('[data-about-kcal-fill]');
  // Bar scales: focus 7% → 84% of the track; 400 kcal = full track
  const FOCUS_SCALE = 12;
  const KCAL_FULL = 400;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Timing: desktop / phone. On a phone the exercise changes faster
  // (no hover there, so the auto change is the main way to see them).
  const phone = window.matchMedia('(max-width: 767px)');
  const T = () => (phone.matches
    ? { speed: 20, autoEvery: 1500, resumeAfter: 2000 }
    : { speed: 6, autoEvery: 2600, resumeAfter: 4000 });
  //  speed: deg per second (6 = one turn per minute)
  //  autoEvery: ms between automatic exercise changes
  //  resumeAfter: ms the globe stays paused after a tap / click / arrow

  /* ---------- 1. Globe geometry ----------
     Photos stay flat (2D, always facing you). Only their POSITIONS move around
     a slightly oval globe; photos going to the back get smaller and fade out.
     Positions [lat, lon] (radians), one per photo, spread as evenly as possible. */
  const OVAL = 0.92;             // height / width of the globe (1 = perfect circle)
  const PERSPECTIVE = 1400;      // px — how strong the depth effect is
  const TILT = (-8 * Math.PI) / 180;   // view the globe slightly from above
  const SHRINK = 0.35;           // side / back photos get up to 35% smaller
  const ZOOM = 1.2;              // selected photo: +20%
  // One position per photo, spread evenly over the globe (golden-angle spiral,
  // poles avoided) — works for any number of photos
  const POSITIONS = tiles.map((_, i) => {
    const y = (1 - (2 * (i + 0.5)) / tiles.length) * 0.9;
    const lon = ((i * 2.399963229728653 + Math.PI) % (2 * Math.PI)) - Math.PI;
    return [Math.asin(y), lon];
  });
  const geo = tiles.map((tile, i) => {
    const [lat, lon] = POSITIONS[i % POSITIONS.length];
    return { tile, lat, lon, cat: tile.dataset.cat, zoom: 1 };
  });

  // Globe radius follows the globe size (CSS: radius = 40% of the globe width)
  let radius = globe.clientWidth * 0.4;
  new ResizeObserver(() => { radius = globe.clientWidth * 0.4; }).observe(globe);

  /* ---------- 2. Panel ---------- */
  let activeCat = null;
  let activeTile = null;
  // Number rolls smoothly to its new value
  const counting = new Map();
  const countTo = (el, to) => {
    cancelAnimationFrame(counting.get(el));
    const from = parseInt(el.textContent, 10) || 0;
    if (reducedMotion.matches) { el.textContent = to; return; }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / 600, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (t < 1) counting.set(el, requestAnimationFrame(step));
    };
    counting.set(el, requestAnimationFrame(step));
  };

  const setActive = (cat, tile = null) => {
    if (tile !== activeTile) {
      activeTile?.classList.remove('is-current');
      tile?.classList.add('is-current');
      activeTile = tile;
    }
    if (cat === activeCat) return;
    activeCat = cat;

    const item = items.find((el) => el.dataset.cat === cat);
    if (!item) return;

    // Crossfade to this exercise's slide (all slides sit in the same spot)
    items.forEach((el) => {
      const on = el === item;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-hidden', String(!on));
    });

    indexEl.textContent = String(items.indexOf(item) + 1).padStart(2, '0');
    const percent = Number(item.dataset.percent);
    const kcal = Number(item.dataset.kcal);
    fillEl.style.setProperty('--w', percent * FOCUS_SCALE);
    kcalFillEl.style.setProperty('--w', Math.min(kcal / KCAL_FULL, 1) * 100);
    countTo(percentEl, percent);
    countTo(kcalEl, kcal);
  };

  /* ---------- 3. Spin ---------- */
  let angle = 0;              // deg
  let speed = T().speed;
  let hovering = false;
  let pausedUntil = 0;        // timestamp for tap / click pauses
  let lastAuto = 0;
  let lastTime = performance.now();
  let running = false;

  // Place every photo for the current angle; returns the photo closest to you
  const render = (dt) => {
    const a = (angle * Math.PI) / 180;
    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);
    let front = null;

    for (const g of geo) {
      const x = radius * Math.cos(g.lat) * Math.sin(g.lon + a);
      const y = -radius * Math.sin(g.lat) * OVAL;
      const z = radius * Math.cos(g.lat) * Math.cos(g.lon + a);
      const y2 = y * cosT - z * sinT;
      const z2 = y * sinT + z * cosT;
      const persp = PERSPECTIVE / (PERSPECTIVE - z2);
      const depth = z2 / radius;                         // 1 = front, -1 = back

      const isActive = g.tile === activeTile;
      g.zoom += ((isActive ? ZOOM : 1) - g.zoom) * Math.min(dt * 8, 1);
      const scale = persp * (1 - SHRINK * (1 - Math.max(depth, 0))) * g.zoom;
      const opacity = Math.min(Math.max((depth - 0.05) / 0.5, 0), 1);

      g.tile.style.transform = `translate(${(x * persp).toFixed(1)}px, ${(y2 * persp).toFixed(1)}px) scale(${scale.toFixed(3)})`;
      g.tile.style.opacity = opacity.toFixed(3);
      g.tile.style.zIndex = Math.round(depth * 100) + 100 + (isActive ? 200 : 0);
      g.tile.classList.toggle('is-back', opacity < 0.3);
      g.depth = depth;

      if (!front || depth > front.depth) front = g;
    }
    return front;
  };

  const tick = (now) => {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    const paused = hovering || now < pausedUntil || reducedMotion.matches;
    const target = paused ? 0 : T().speed;
    speed += (target - speed) * Math.min(dt * 3, 1);   // ease to stop / start
    angle = (angle + speed * dt) % 360;

    const front = render(dt);
    // Switch as soon as a new photo comes to the front (but not more often than autoEvery)
    if (!paused && now - lastAuto > T().autoEvery && front.cat !== activeCat) {
      lastAuto = now;
      current.setAttribute('aria-live', 'off');
      setActive(front.cat, front.tile);
    }

    if (running) requestAnimationFrame(tick);
  };

  const start = () => {
    if (running) return;
    running = true;
    lastTime = performance.now();
    requestAnimationFrame(tick);
  };
  const stop = () => { running = false; };

  // Load the photos shortly before the section scrolls into view
  // (native lazy-loading misses tiles that start off-position)
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    tiles.forEach((tile) => {
      const img = tile.querySelector('img[data-src]');
      if (img) img.src = img.dataset.src;
    });
    obs.disconnect();
  }, { rootMargin: '800px 0px' }).observe(globe);

  // Spin only while the section is on screen
  new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    .observe(globe);

  /* ---------- 4. Interaction ---------- */
  tiles.forEach((tile) => {
    tile.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      hovering = true;
      setActive(tile.dataset.cat, tile);
    });
    tile.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse') return;
      hovering = false;
      lastAuto = performance.now();          // keep this text a moment before auto resumes
    });
    tile.addEventListener('click', () => {
      setActive(tile.dataset.cat, tile);
      pausedUntil = performance.now() + T().resumeAfter;
      lastAuto = pausedUntil;
    });
  });

  // ‹ › arrows: step through exercises (also the keyboard / screen-reader control)
  const step = (dir) => {
    const i = items.findIndex((el) => el.dataset.cat === activeCat);
    const next = items[(i + dir + items.length) % items.length].dataset.cat;
    const match = geo.find((g) => g.cat === next);
    current.setAttribute('aria-live', 'polite');   // announce only user-chosen changes
    setActive(next, match ? match.tile : null);
    pausedUntil = performance.now() + T().resumeAfter;
    lastAuto = pausedUntil;
  };
  root.querySelector('[data-about-prev]').addEventListener('click', () => step(-1));
  root.querySelector('[data-about-next]').addEventListener('click', () => step(1));

  // Initial state: the photo in front
  activeCat = items[0].dataset.cat;
  const first = render(0);
  setActive(first.cat, first.tile);
  render(1);
})();
