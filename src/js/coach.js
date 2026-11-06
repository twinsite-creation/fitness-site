/* Coach block: a 3D arc of cards turns slowly BEHIND the coach's head and shoulders.
   - Everything you may want to change lives in the COACH object below.
   - The arc turns right → left, one full turn in TURN_SECONDS, no jumps.
   - Hovering the block only SLOWS it down (never follows the cursor).
   - On scroll the cards drift a bit faster than the coach (light parallax).
   - Stops while off screen; stands still with prefers-reduced-motion. */

const COACH = {
  // Coach photo. Swap this one path for the real file.
  // A .png / .webp with a transparent background is shown as a clean cutout;
  // a .jpg / .jpeg also gets soft dark side edges so it melts into the black.
  // Previous photo (full height): 'assets/img/center-coach.webp' with arcLevel .2
  photo: 'assets/img/center-coach-02.webp',
  photoAlt: 'Anna Koval, strength coach, hand on hip, in a dark gym',
  // Height of the card arc, as a share of the photo height from the top
  // (aim for the coach's neck / shoulders): 0 = top, 1 = bottom
  arcLevel: 0.27,

  name: 'Anna Koval',
  role: 'Strength coach · 8 years in the gym',
  facts: ['8+ years', '300+ clients', '1:1 coaching'],

  // Shown as barbell plates: full title engraved around the rim, short code + year in the centre
  // (where a real plate shows its weight). 1–3 work; `image` = scan for the lightbox
  // (placeholder until the file exists).
  certificates: [
    { code: 'CPT', title: 'Certified Personal Trainer', year: 2019, image: 'assets/img/certificates/cert-01.jpg' },
    { code: 'S&C', title: 'Strength & Conditioning Coach', year: 2021, image: 'assets/img/certificates/cert-02.jpg' },
  ],

  // Arc cards, in order (photos mixed with text cards).
  //   photo: { src: path WITHOUT extension (.webp + .jpg), alt }
  //   info:  { label, value, text, red: true for the brand-red card }
  // Old stock photos (not used now): assets/img/slides/
  cards: [
    { src: 'assets/img/about-me-01', alt: 'Coach correcting a client’s lunge with a resistance band' },
    { src: 'assets/img/about-me-02', alt: 'Coach guiding a client through a kneeling stretch' },
    { value: '300+', text: 'Clients coached' },
    { src: 'assets/img/about-me-03', alt: 'Coach spotting a push-up on a balance trainer' },
    { src: 'assets/img/about-me-04', alt: 'Coach spotting a dumbbell press on the bench' },
    { src: 'assets/img/about-me-05', alt: 'Coach checking a client’s dumbbell row' },
    { label: 'Today’s session', value: 'Leg day', text: '5 × 5 · 90 s rest', red: true },
    { src: 'assets/img/about-me-06', alt: 'Coach adjusting a client’s posture at the squat rack' },
    { src: 'assets/img/about-me-07', alt: 'Coach watching a client’s goblet squat' },
    { value: '+40 kg', text: 'Deadlift in 6 months' },
    { src: 'assets/img/about-me-08', alt: 'Coach spotting a barbell squat' },
    { src: 'assets/img/about-me-09', alt: 'Coach spotting a bench press' },
    { src: 'assets/img/about-me-10', alt: 'Coach guiding a seated row' },
    { value: '1:1', text: 'Coaching, every rep checked' },
    { src: 'assets/img/about-me-11', alt: 'Coach going through a training plan on a tablet' },
  ],
};

(() => {
  const root = document.querySelector('[data-coach]');
  if (!root) return;

  const $ = (sel) => root.querySelector(sel);
  const stage = $('[data-coach-stage]');
  const arc = $('[data-coach-arc]');
  const ring = $('[data-coach-ring]');
  const figure = $('[data-coach-figure]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- 1. Coach info ---------- */
  const photo = $('[data-coach-photo]');
  photo.src = COACH.photo;
  photo.alt = COACH.photoAlt;
  figure.classList.toggle('is-cutout', /\.(png|webp)$/i.test(COACH.photo));
  stage.style.setProperty('--arc-level', COACH.arcLevel);
  // Any photo size works: the frame takes the photo's own proportions
  const fitPhoto = () => {
    if (photo.naturalWidth) figure.style.aspectRatio = `${photo.naturalWidth} / ${photo.naturalHeight}`;
  };
  photo.addEventListener('load', fitPhoto);
  fitPhoto();

  $('[data-coach-name]').textContent = COACH.name;
  $('[data-coach-role]').textContent = COACH.role;
  $('[data-coach-facts]').innerHTML = COACH.facts
    .map((fact) => {
      const [num, ...rest] = fact.split(' ');
      return `<li><span class="coach__fact-num">${num}</span> ${rest.join(' ')}</li>`;
    })
    .join('');

  /* ---------- 2. Certificates as barbell plates ---------- */
  // Matte plate: rim with the engraved title, inner ring, hub with code + year
  const RIM_R = 47;                                   // radius of the engraved text line
  const RIM_LEN = 2 * Math.PI * RIM_R;
  const plate = (cert, i) => {
    const id = `coach-plate-${i}`;
    const engraving = `${cert.title} <tspan class="coach__plate-dot">●</tspan> ${cert.year} <tspan class="coach__plate-dot">●</tspan>`;
    return `
      <svg class="coach__plate" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="${id}-g" cx="40%" cy="35%" r="75%">
            <stop class="coach__plate-hi" offset="0%"/>
            <stop class="coach__plate-lo" offset="100%"/>
          </radialGradient>
          <path id="${id}-p" d="M60 ${60 - RIM_R} a${RIM_R} ${RIM_R} 0 1 1 0 ${RIM_R * 2} a${RIM_R} ${RIM_R} 0 1 1 0 ${-RIM_R * 2}"/>
        </defs>
        <circle class="coach__plate-body" cx="60" cy="60" r="58" fill="url(#${id}-g)"/>
        <circle class="coach__plate-rim" cx="60" cy="60" r="55"/>
        <text class="coach__plate-text">
          <textPath href="#${id}-p" textLength="${(RIM_LEN - 6).toFixed(1)}" lengthAdjust="spacing">${engraving}</textPath>
        </text>
        <circle class="coach__plate-ring" cx="60" cy="60" r="40"/>
        <circle class="coach__plate-hub" cx="60" cy="60" r="25"/>
        <text class="coach__plate-code" x="60" y="62" text-anchor="middle">${cert.code}</text>
        <text class="coach__plate-year" x="60" y="74" text-anchor="middle">${cert.year}</text>
      </svg>`;
  };

  const certList = $('[data-coach-certs]');
  COACH.certificates.forEach((cert, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="coach__award" type="button" aria-label="Open certificate: ${cert.title}, ${cert.year}">
        ${plate(cert, i)}
      </button>`;
    // Use the scan in the lightbox only if the file really exists
    const test = new Image();
    test.onload = () => { cert.loaded = true; };
    test.src = cert.image;
    li.querySelector('button').addEventListener('click', () => openLightbox(i));
    certList.append(li);
  });

  /* ---------- 3. Lightbox ---------- */
  const lightbox = root.querySelector('[data-lightbox]');
  const lbMedia = lightbox.querySelector('[data-lightbox-media]');
  const lbCaption = lightbox.querySelector('[data-lightbox-caption]');

  function openLightbox(i) {
    const cert = COACH.certificates[i];
    lbMedia.innerHTML = cert.loaded
      ? `<img src="${cert.image}" alt="${cert.title} certificate, ${cert.year}">`
      : `<div class="lightbox__placeholder"><span>Certificate scan</span><strong>${cert.title}</strong><span>${cert.year}</span></div>`;
    lbCaption.textContent = `${cert.title} — ${cert.year}`;
    lightbox.showModal();                       // Esc closes a <dialog> by itself
  }
  lightbox.querySelector('[data-lightbox-close]').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (e) => {   // click on the dark background
    if (e.target === lightbox) lightbox.close();
  });

  /* ---------- 4. Reveal on scroll: handled by reveal.js ([data-reveal]) ---------- */

  /* ---------- 5. Arc cards ---------- */
  // The arc needs enough cards around the circle; a short list is repeated
  // (copies sit on the opposite side, so the same card is never on screen twice).
  // 15 cards now → no repeats.
  const MIN_TILES = 14;
  const GAP = 0.2;                // space between cards, as a share of card width
  const copies = Math.max(1, Math.ceil(MIN_TILES / COACH.cards.length));
  const tiles = Array.from({ length: copies }, () => COACH.cards).flat();
  const step = 360 / tiles.length;
  tiles.forEach((card, i) => {
    const isCopy = i >= COACH.cards.length;
    const li = document.createElement('li');
    li.className = 'coach__tile';
    li.style.setProperty('--angle', `${(i * step).toFixed(2)}deg`);
    if (isCopy) li.setAttribute('aria-hidden', 'true');   // read each card only once
    if (card.src) {
      li.classList.add('coach__tile--photo');
      li.innerHTML = `
        <picture>
          <source type="image/webp" data-srcset="${card.src}.webp">
          <img data-src="${card.src}.jpg" alt="${isCopy ? '' : card.alt}" width="640" height="960" decoding="async">
        </picture>`;
    } else {
      li.classList.add('coach__tile--info');
      if (card.red) li.classList.add('is-red');
      li.innerHTML = `
        ${card.label ? `<span class="coach__tile-label">${card.label}</span>` : ''}
        <span class="coach__tile-value${/\d/.test(card.value) ? '' : ' is-word'}">${card.value}</span>
        <span class="coach__tile-text">${card.text}</span>`;
    }
    ring.append(li);
  });

  // Load the photos shortly before the block scrolls into view
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    ring.querySelectorAll('source[data-srcset]').forEach((s) => { s.srcset = s.dataset.srcset; });
    ring.querySelectorAll('img[data-src]').forEach((img) => { img.src = img.dataset.src; });
    obs.disconnect();
  }, { rootMargin: '800px 0px' }).observe(stage);

  /* ---------- 6. Motion: turn + hover slow-down + scroll parallax ---------- */
  const TURN_SECONDS = 80;        // one full turn = every card passes twice (≈40 s per card cycle)
  const HOVER_SPEED = 0.3;        // hover → 30% of the normal speed
  const PARALLAX_CARDS = 70;      // px the cards drift over the whole scroll pass
  const PARALLAX_COACH = 24;      // px the coach drifts (less → cards feel faster)

  // Cylinder radius from the card width: neighbours always sit GAP apart,
  // on every screen size (card sizes come from CSS breakpoints)
  let radius = 0;
  const measure = () => {
    const cardW = ring.firstElementChild.offsetWidth;
    radius = (cardW * (1 + GAP)) / (2 * Math.sin(Math.PI / tiles.length));
    ring.style.setProperty('--ring-r', `${radius.toFixed(1)}px`);
  };

  let angle = 0;
  let speed = 1;                  // 1 = normal, eased towards the target
  let hovering = false;

  const render = () => {
    ring.style.transform = `translateZ(${-radius}px) rotateY(${angle.toFixed(3)}deg)`;

    // Scroll parallax: -1 (block below the screen centre) … 1 (above it)
    if (!reducedMotion.matches) {
      const box = stage.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1,
        (window.innerHeight / 2 - (box.top + box.height / 2)) / window.innerHeight));
      arc.style.transform = `translate3d(0, ${(-progress * PARALLAX_CARDS).toFixed(1)}px, 0)`;
      figure.style.transform = `translate3d(0, ${(-progress * PARALLAX_COACH).toFixed(1)}px, 0)`;
    }
  };

  let running = false;
  let last = 0;
  const tick = (now) => {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    speed += ((hovering ? HOVER_SPEED : 1) - speed) * Math.min(dt * 2.5, 1);
    angle = (angle - (360 / TURN_SECONDS) * speed * dt) % 360;   // right → left
    render();
    requestAnimationFrame(tick);
  };
  const start = () => {
    if (running || reducedMotion.matches) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(tick);
  };
  const stop = () => { running = false; };

  let onScreen = false;
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    onScreen ? start() : stop();
  }).observe(stage);

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      stop();
      arc.style.transform = '';
      figure.style.transform = '';
      render();
    } else if (onScreen) start();
  });

  // Hover on the block slows the turn down (mouse only)
  stage.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hovering = true; });
  stage.addEventListener('pointerleave', () => { hovering = false; });

  // Radius comes from CSS (--ring-r), so it follows the breakpoints
  new ResizeObserver(() => { measure(); render(); }).observe(stage);
  measure();
  angle = -step / 2;              // at rest no card hides exactly behind the coach
  render();
})();
