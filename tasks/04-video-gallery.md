# Task 04 — Video gallery

Replaces the single video block. Section "On video / Inside *my sessions*".

## Cards
- 6 portrait previews: `assets/img/about-me-01…06.jpg` (+ 640px `.webp` copies used first).
- Card 3:4 (2:3 on desktop), `--radius-l`, brand-red 20% tint + soft dark fade at the bottom.
- Play button as in the reference: glass circle + outlined triangle (pause icon while playing).
- No clips yet: each card has `data-video-src=""`. Put a file path there
  (e.g. `assets/video/session-01.mp4`) and the button plays it inline; empty = preview only.
- Old clip `assets/video/IMG_3602.MOV` is still in the folder, not used.

## Layout
- Mobile (<768): horizontal swipe gallery with scroll-snap, cards 72% wide so the next one peeks.
  Pagination under it: "01 / 06" (JetBrains Mono) + 6 lines, the current one long and `--color-primary`;
  it follows the swipe, tapping a line jumps to that clip. No page-level horizontal scroll.
- Tablet: 3 × 2 grid. Desktop: one row of 6. No pagination.
- Cards reveal on scroll one by one (`data-reveal`).
