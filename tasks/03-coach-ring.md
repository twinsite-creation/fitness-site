# Task 03 — Coach block with a 3D card arc

New section right after the Hero, before About (About stays unchanged).
Reference: owner's carousel video (mental-health site) — mechanics and composition only.

## Content (all in the `COACH` object, top of `src/js/coach.js`)
- `photo` — coach image; change this one path. `.png/.webp` = transparent cutout,
  `.jpg` = soft dark side edges. Lower body always fades out (mask).
  Any photo proportions work. `arcLevel` = arc height as a share of the photo (aim at neck / shoulders).
  Current: `center-coach-02.webp` (waist-up), arcLevel .27. Previous full-height photo: `center-coach.webp`, arcLevel .2.
- `cards` — 15 arc cards: 11 photos of the coach with clients (`assets/img/about-me-01…11`,
  .webp 640px + .jpg) + 4 info cards (300+ clients · Today's session — Leg day (red) ·
  +40 kg deadlift · 1:1 coaching). Old stock photos in `assets/img/slides/` are no longer used.
- Headline "Just about me" ("Just" in brand red) + one Barlow 500 line.
- Bottom-left: glass card — YOUR COACH / ANNA KOVAL / role / facts, thin red line.
- Bottom-right: certificates as barbell plates (2 now; 1–3 work): matte plate, full title
  + year engraved around the rim (mono, tiny red dots), short code (CPT, S&C) in Bebas + year
  in the hub, where a real plate shows its weight. Hover: rim turns red, nothing moves.
  Click → lightbox with the scan (`assets/img/certificates/cert-01…02.jpg`; placeholder until the file exists).

## Arc
- Cards on a cylinder at neck / shoulder height: `rotateY(angle) translateZ(--ring-r)`,
  container with perspective; back cards hidden (backface), sides fade with a mask.
- The arc spans the full screen width (past the container). Short card lists are repeated
  (MIN_TILES = 14; copies opposite, aria-hidden) — 15 cards now, no repeats; coach.js sets the radius from the
  card width so the gaps stay even on every screen.
- Stage height follows the screen (`100svh − header`), so on a laptop the coach,
  the arc and the coach card fit one screen.
- Card 286×221 desktop / 234×181 tablet / 182×140 mobile (+30%), `--radius-m`, `--color-border`, glass.
- Photos: grayscale `--photo-gray` + brand-red multiply `--photo-tint`, grain.

## Motion
- Turns right → left, endless, rAF, transform only. Full ring turn 80 s = each card passes every 40 s.
- Hover on the block: slows to 30% (never stops, never follows the cursor).
- Scroll: cards drift 70px, coach 24px (light parallax).
- Paused off screen (IntersectionObserver). Static with prefers-reduced-motion (no spin, no parallax).
- Info blocks: fade + rise on scroll, right one 0.15 s later.

## Layout
- ≥1200: info blocks over the bottom corners. 768–1199: two columns under the coach.
  <768: stacked under the coach. No horizontal scroll.
