# Task 05 — Booking (demo)

New section "Book a session / Pick *your time*" right after Training formats (`#booking`).
Inspiration: Mindbody class schedule (owner's screenshots) — structure only, our own look.

## Structure
- Format filter: All · Personal · Split · Small group · Online (chips, Barlow 500).
- Day strip: next 14 days. Weekday (mono) + date in a circle. Today = thin ring,
  selected = brand-red circle, days without free sessions dimmed (Sunday = closed).
  Mobile: horizontal swipe; desktop: all 14 in one row.
- Selected date in Bebas + "N sessions" counter (mono).
- Session list: time (mono) · duration · format name · gym/online · spots.
  Group formats show their seats as small dots (taken / free) + "Only N spots left".
  Button "Book"; full sessions → "Full", disabled.
- Book → dialog with a summary (format, date, time) + name, phone, email → "Confirm booking".
  Then the shared success popup with the date and time. The booked spot is taken in the list.

## Data
- Demo only: sessions are generated in `src/js/booking.js` (`BOOKING` object on top:
  weekly template, durations, seats). Taken spots are pseudo-random but stable per day.
- Nothing is sent anywhere yet. Next step: replace the generator with Cal.com
  (`GET /v2/slots`, `POST /v2/bookings`) — the UI stays the same.

## Links
- All "Book a session" links (header, hero, About) now lead to `#booking`.
  The CTA strip and Contacts forms stay as "call me back" requests.
