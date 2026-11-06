# 01 — Page skeleton + Hero

## Read first
- `CLAUDE.md`
- `references/README.md` (ref-01 for structure, Hero-Concept / ref-02 for hero)
- `src/styles/tokens.css`

## Do in this task
1. Full HTML skeleton of all 9 sections (see CLAUDE.md) with **English** placeholder texts. Only Header + Hero are fully styled; other sections are just semantic markup with minimal layout.
2. Header: logo (text placeholder) left, nav (About, Formats, Results, Contacts) + red "Book a session" button right. Transparent over hero, becomes dark + blur on scroll. Burger on mobile.
3. Hero (based on Hero-Concept, NOT a copy):
   - Section height: 100svh, min 640px. Inside a red panel (`--color-primary` → `--color-primary-deep` radial gradient) with `--radius-m` and gutter around it on desktop; full-bleed on mobile.
   - Film grain overlay (SVG noise, opacity ~.08).
   - Full-bleed photos `assets/img/slide-hero-01…05.jpg` (object-fit: cover), no frame — one per slide.
   - Shade gradients (`--color-primary-deep`) under the header, behind the text and at the bottom so copy stays readable.
   - Subtle neon purple glow (`--color-neon`, blur, screen blend) near the coach.
   - Left: headline 2 lines UPPERCASE `--font-display` `--fs-hero`, subtitle 1 line (`--font-accent`), link "Book a session →".
   - Right edge: vertical slider nav 01–05 in `--font-mono`; active item has a long line, others dimmed.
   - Slider: 5 slides (headline + subtitle + photo). New photo fades in over the old one and settles from a slight zoom; text rises in line by line, old text drifts up and fades; autoplay 2s that runs until the visitor presses Pause (no pause on hover/focus), keyboard accessible.
   - Mobile: photo full-screen, headline at the bottom over a dark shade, slider numbers horizontal under it.

## Placeholder content
- Slide 1: "STRENGTH / UNDER CONTROL" — "Personal strength training"
- Slide 2: "TECHNIQUE / FIRST" — "Every rep, coached"
- Slide 3: "A PLAN / BUILT FOR YOU" — "Programs shaped around your goals"
- Slide 4: "RESULTS / IN NUMBERS" — "Progress you can see on the bar"
- Slide 5: "START / TODAY" — "Your first session is a meet & greet"

## Done when
- Looks right at 375px, 768px, 1440px
- Headline readable over the photo, contrast OK
- No hex values outside `tokens.css`
- Lighthouse accessibility ≥ 95
