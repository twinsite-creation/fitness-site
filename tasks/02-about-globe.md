# 02 — About: training globe

## Idea
Left: a slowly rotating, slightly oval globe of same-size square photos (no radius, natural colors, no inner glow), one exercise type per photo.
Layout: mobile = globe on top, text below; tablet + desktop (≥768px) = two columns 50/50.
Right: what the coach teaches and why — ‹ 01 / 08 › switcher, title, one-line title, facts (Works / Focus / Typical set) — no description paragraph, keeps the column short, share of training week (%), "Book a session". (The full split list was removed.)

## Behaviour
- Globe spins on its own (~1 turn/min). Never follows the cursor.
- Hover a photo (mouse) → globe eases to a stop, panel shows that exercise; leave → spins again.
- Tap a photo (touch) or press ‹ › → panel shows it, globe pauses ~4s.
- No interaction → panel follows the photo in front every ~2.6s.
- Current photo: thin neon edge. Back tiles barely visible.
- Photos load ~800px before the section is reached; globe spins only while on screen.
- Reduced motion: globe stands still, list + taps still work.
- Accessible control = the ‹ › arrows (user-chosen changes are announced, auto changes are not); globe is decorative.

## Content (20 exercises, one photo each — % are placeholders, total 100)
Both lists from the owner summed to 100% each, so every value was halved.

| # | Exercise | % | # | Exercise | % |
|---|---|---|---|---|---|
| 1 | Barbell back squat | 7 | 11 | Front squat | 7 |
| 2 | Deadlift | 6 | 12 | Sumo deadlift | 7 |
| 3 | Hip thrust | 6 | 13 | Walking lunges | 5 |
| 4 | Bench press | 4 | 14 | Leg press | 5 |
| 5 | Romanian deadlift | 5 | 15 | Kettlebell swing | 4 |
| 6 | Bulgarian split squat | 5 | 16 | Farmer’s walk | 4 |
| 7 | Pull-ups / Lat pulldown | 5 | 17 | Incline dumbbell press | 5 |
| 8 | Overhead press | 4 | 18 | Seated cable row | 5 |
| 9 | Dumbbell row | 4 | 19 | Cable glute kickback | 4 |
| 10 | Plank & core work | 4 | 20 | Hanging leg raise | 4 |

Globe: 20 flat landscape (4:3) photos, width = 65% of the globe radius (owner asked +30%). Side neighbours may slightly overlap; the closer photo is on top. 50% = no overlap at all.
Texts live in `index.html` in the hidden list `.about__data` (one `<li>` per exercise: title, text, works, focus, sets; % in `data-percent`).

## Files
- `index.html` — section markup (20 tiles, 20 slides)
- `src/styles/about.css`, `src/js/about.js`
- `assets/img/about/*.jpg` — Unsplash photos, see `assets/img/about/CREDITS.md`

## Update — two numbers per exercise
- Headline: eyebrow "My training split", h2 "Training *I prefer*".
- Panel shows two clear stats for the current exercise:
  1. **My focus** — `data-percent`: share of the clients' training time (bar: 1% = 12% of the track).
  2. **Calories burned** — `data-kcal`: average kcal per 30 min (bar: 400 kcal = full track).
     Note under the stats: "Estimate for a 70 kg person, rest between sets included."
- kcal values are MET-based estimates (strength work ≈ 5–6 MET, kettlebell swing ≈ 9.8):
  squat 220, deadlift 230, hip thrust 180, bench 170, RDL 200, split squat 210, pull-ups 220,
  OHP 170, DB row 160, plank 140, front squat 220, sumo 230, lunges 230, leg press 180,
  KB swing 360, farmer's walk 280, incline DB press 160, cable row 150, kickback 130, leg raise 150.
