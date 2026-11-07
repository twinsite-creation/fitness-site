# Fitness trainer site — project rules

Premium one-page site for a **strength training** coach.
Mood: **drive + premium**. Little text, big type, one clear action: book a session.

**Site language: English** (all copy, placeholders, buttons, alt texts). Chat with the owner in Ukrainian.

## Stack
- Plain HTML + CSS + vanilla JS (no frameworks unless a task says so)
- Mobile-first, breakpoints: 768px / 1200px
- All design values come from `src/styles/tokens.css` — never hard-code hex colors, fonts or spacing

## Brand
- Base: black `--color-bg`
- Brand red `--color-primary` (#A5101E): hero background, buttons, CTAs, accent words. Max ~10% of a page outside the hero.
- Neon purple `--color-neon` (#5D05C7): ONLY glows, blurred background spots, thin neon lines. Never for text or buttons (low contrast).
- Text: warm white `--color-text`, never pure #FFF
- Fonts (Google Fonts):
  - Headlines: Bebas Neue `--font-display`, UPPERCASE, `--lh-tight` (.9), light tracking
  - Subtitles, eyebrows, buttons: Barlow 500 `--font-accent`
  - Body: Manrope `--font-body`
  - Numbers, labels, counters, slider 01–05: JetBrains Mono `--font-mono`
- Proportion: ~70% black, 20% text, 7% red, 3% purple

## Premium rules
- Lots of air: sections use `--space-section` vertically
- Headlines big and tight (`--lh-tight`), short (2–4 words per line)
- Photos: documentary feel — the coach working with a client, not glossy posing. Subtle film grain overlay is welcome.
- Motion: smooth and calm (`--ease-out`), reveal on scroll. Always respect `prefers-reduced-motion`.
- **NEVER animate anything from the cursor**: no mouse parallax, no custom/following cursor, no hover-tilt.
- No stock icons packs, no gradients on text, no drop shadows except `--glow-neon`.

## References
See `references/README.md`. Main hero reference: `references/Hero-Concept.jpeg`. Use references for **structure and composition only** — never copy design, text or icons 1:1.

## Page structure (in order)
1. Header (logo left, nav, burger on mobile)
2. Hero — red panel, full-bleed background photos (no frame), slider 01–05;
   each slide changes text AND photo (`assets/img/slide-hero-01…05.jpg`, same order as slides)
3. Coach — coach cutout in the centre, 3D arc of 12 cards (photos + info) turning behind her head,
   headline + info blocks (coach bottom-left, certificates as barbell plates bottom-right); data in `COACH` (src/js/coach.js)
4. About ("What we will do") — rotating globe of exercise photos (left) + panel (right): exercise, facts, my focus % + avg kcal per 30 min + button
5. CTA strip — name + phone + button in one row
6. Training formats — 4 cards with circular indicators
7. Video gallery ("Inside my sessions") — 6 portrait preview cards (assets/img/about-me-01…06), play button; mobile: swipe + pagination
8. Result — one big animated counter (client result)
9. Contacts — info left, form right
10. Footer

## Workflow
- One task = one file in `tasks/`. Do only what the current task says.
- When done, list what changed and anything left as a placeholder.
