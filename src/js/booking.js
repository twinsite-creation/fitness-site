/* Booking section: format filter → day strip → session list → booking dialog.
   DEMO: sessions are generated here, nothing is sent anywhere.
   Later: replace makeDay() with Cal.com slots (GET /v2/slots) and the submit
   handler with POST /v2/bookings — the markup and styles stay the same. */
(() => {
  const BOOKING = {
    days: 14,                 // how many days ahead are shown
    minHoursAhead: 2,         // today's sessions closer than this are hidden
    place: { gym: 'Gym · Street address', online: 'Online · video call' },
    formats: {
      personal: { name: 'Personal',    min: 60, seats: 1, online: false },
      split:    { name: 'Split',       min: 60, seats: 2, online: false },
      group:    { name: 'Small group', min: 75, seats: 6, online: false },
      online:   { name: 'Online',      min: 45, seats: 1, online: true },
    },
    // Weekly template: 0 = Sunday … 6 = Saturday. [time, format]
    week: {
      0: [],
      1: [['07:00', 'personal'], ['08:30', 'personal'], ['12:00', 'online'], ['17:00', 'split'], ['18:30', 'group'], ['20:00', 'personal']],
      2: [['07:00', 'personal'], ['09:00', 'split'], ['13:00', 'online'], ['18:00', 'personal'], ['19:30', 'group']],
      3: [['07:00', 'personal'], ['08:30', 'personal'], ['12:00', 'online'], ['17:00', 'split'], ['18:30', 'group'], ['20:00', 'personal']],
      4: [['07:00', 'personal'], ['09:00', 'split'], ['13:00', 'online'], ['18:00', 'personal'], ['19:30', 'group']],
      5: [['07:00', 'personal'], ['08:30', 'personal'], ['12:00', 'online'], ['17:00', 'split'], ['18:30', 'group']],
      6: [['09:00', 'group'], ['10:30', 'personal'], ['12:00', 'split']],
    },
  };

  const root = document.querySelector('[data-booking]');
  const dialog = document.querySelector('[data-booking-dialog]');
  if (!root || !dialog) return;

  const $ = (sel, el = root) => el.querySelector(sel);
  const ui = {
    filters: $('[data-booking-filters]'),
    month: $('[data-booking-month]'),
    days: $('[data-booking-days]'),
    date: $('[data-booking-date]'),
    count: $('[data-booking-count]'),
    list: $('[data-booking-list]'),
    empty: $('[data-booking-empty]'),
  };
  const form = $('[data-booking-form]', dialog);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const fmt = (opts) => new Intl.DateTimeFormat('en-US', opts);
  const fWeekday = fmt({ weekday: 'short' });
  const fLong = fmt({ weekday: 'long', month: 'long', day: 'numeric' });
  const fShort = fmt({ weekday: 'short', month: 'short', day: 'numeric' });
  const fMonth = fmt({ month: 'long' });
  const key = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  // Stable pseudo-random number 0…1 from a string (same day → same taken spots)
  const rand = (str) => {
    let h = 2166136261;
    for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return ((h >>> 0) % 1000) / 1000;
  };

  const booked = new Map();          // demo: spots taken in this visit

  const makeDay = (date) => {
    const now = Date.now();
    return BOOKING.week[date.getDay()].map(([time, f]) => {
      const format = BOOKING.formats[f];
      const [h, m] = time.split(':').map(Number);
      const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m);
      const id = `${key(date)}-${time}`;
      const r = rand(id);
      const taken = Math.min(format.seats,
        (format.seats === 1 ? (r < 0.4 ? 1 : 0) : Math.floor(r * (format.seats + 1))) + (booked.get(id) || 0));
      const end = new Date(start.getTime() + format.min * 60000);
      return { id, f, format, start, end, taken, left: format.seats - taken };
    }).filter((s) => s.start.getTime() - now > BOOKING.minHoursAhead * 3600000);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates = Array.from({ length: BOOKING.days }, (_, i) =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));

  const state = { filter: 'all', date: null };
  const visible = (date) => makeDay(date).filter((s) => state.filter === 'all' || s.f === state.filter);
  const hasFree = (date) => visible(date).some((s) => s.left > 0);

  const time = (d) => d.toTimeString().slice(0, 5);   // 24h, e.g. 18:30

  // --- Filters ---
  const renderFilters = () => {
    const items = [['all', 'All'], ...Object.entries(BOOKING.formats).map(([k, v]) => [k, v.name])];
    ui.filters.innerHTML = items.map(([k, name]) =>
      `<button class="booking__chip" type="button" data-filter="${k}" aria-pressed="${k === state.filter}">${name}</button>`).join('');
  };

  // --- Day strip ---
  const renderDays = () => {
    if (!state.date || !hasFree(state.date)) state.date = dates.find(hasFree) || dates[0];
    const first = fMonth.format(dates[0]);
    const last = fMonth.format(dates[dates.length - 1]);
    ui.month.textContent = first === last ? first : `${first} — ${last}`;

    ui.days.innerHTML = dates.map((d, i) => {
      const free = hasFree(d);
      const selected = key(d) === key(state.date);
      const cls = ['booking__day', i === 0 && 'is-today', !free && 'is-off'].filter(Boolean).join(' ');
      const label = `${fLong.format(d)}${i === 0 ? ', today' : ''}${free ? '' : ', no free sessions'}`;
      return `<button class="${cls}" type="button" data-day="${i}" aria-pressed="${selected}" aria-label="${label}"${free ? '' : ' disabled'}>
          <span class="booking__day-name">${i === 0 ? 'Today' : fWeekday.format(d)}</span>
          <span class="booking__day-num">${d.getDate()}</span>
        </button>`;
    }).join('');
  };

  // --- Session list ---
  const seatsHtml = (s) => {
    if (s.format.seats === 1) return '';
    const dots = Array.from({ length: s.format.seats }, (_, i) =>
      `<span class="booking__seat${i < s.taken ? ' is-taken' : ''}"></span>`).join('');
    return `<span class="booking__seats" aria-hidden="true">${dots}</span>`;
  };

  const spotsText = (s) => {
    if (s.left === 0) return '<span class="booking__spots is-full">Fully booked</span>';
    if (s.format.seats === 1) return '<span class="booking__spots">1:1</span>';
    if (s.left <= 2) return `<span class="booking__spots is-low">Only ${s.left} ${s.left === 1 ? 'spot' : 'spots'} left</span>`;
    return `<span class="booking__spots">${s.left} of ${s.format.seats} spots free</span>`;
  };

  const renderList = () => {
    const sessions = visible(state.date);
    ui.date.textContent = fLong.format(state.date);
    const free = sessions.filter((s) => s.left > 0).length;
    ui.count.textContent = sessions.length ? `${String(free).padStart(2, '0')} / ${String(sessions.length).padStart(2, '0')} free` : '';
    ui.empty.hidden = sessions.length > 0;

    ui.list.innerHTML = sessions.map((s) => `
      <li class="booking__item${s.left === 0 ? ' is-full' : ''}">
        <div class="booking__time">
          <span class="booking__start">${time(s.start)}</span>
          <span class="booking__dur">${s.format.min} min</span>
        </div>
        <div class="booking__info">
          <span class="booking__name">${s.format.name}</span>
          <span class="booking__meta">${s.format.online ? BOOKING.place.online : BOOKING.place.gym}</span>
        </div>
        <div class="booking__avail">${seatsHtml(s)}${spotsText(s)}</div>
        <button class="btn ${s.left ? 'btn--primary' : 'booking__btn--full'} booking__btn" type="button"
          data-book="${s.id}"${s.left ? '' : ' disabled'}
          aria-label="${s.left ? `Book ${s.format.name} at ${time(s.start)}` : `${s.format.name} at ${time(s.start)} is full`}">
          ${s.left ? 'Book' : 'Full'}
        </button>
      </li>`).join('');

    if (!reduced.matches) {
      ui.list.classList.remove('is-entering');
      void ui.list.offsetWidth;          // restart the fade-in
      ui.list.classList.add('is-entering');
    }
  };

  const render = () => { renderDays(); renderList(); };

  ui.filters.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    state.filter = btn.dataset.filter;
    ui.filters.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    render();
  });

  ui.days.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-day]');
    if (!btn || btn.disabled) return;
    state.date = dates[Number(btn.dataset.day)];
    ui.days.querySelectorAll('[data-day]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    renderList();
  });

  // --- Dialog ---
  let current = null;
  let lastFocus = null;
  const sum = (name) => $(`[data-booking-summary-${name}]`, dialog);

  const openDialog = (s) => {
    current = s;
    sum('title').textContent = s.format.name;
    sum('date').textContent = fShort.format(s.start);
    sum('time').textContent = `${time(s.start)} – ${time(s.end)}`;
    sum('place').textContent = s.format.online ? BOOKING.place.online : BOOKING.place.gym;
    lastFocus = document.activeElement;
    dialog.classList.remove('is-closing');
    dialog.showModal();
    document.body.classList.add('is-locked');
  };

  const finishClose = () => { dialog.classList.remove('is-closing'); dialog.close(); };
  const closeDialog = (instant) => {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    if (instant || reduced.matches) return finishClose();
    dialog.classList.add('is-closing');
    form.addEventListener('animationend', finishClose, { once: true });
  };

  dialog.addEventListener('close', () => {
    // the success popup may already be open on top — keep the page locked then
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('is-locked');
    if (lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  });
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeDialog(); });
  dialog.addEventListener('click', (e) => {
    if (e.target.closest('[data-booking-close]') || e.target === dialog) closeDialog();
  });

  ui.list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-book]');
    if (!btn || btn.disabled) return;
    const s = visible(state.date).find((x) => x.id === btn.dataset.book);
    if (s && s.left > 0) openDialog(s);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!current) return;
    // TODO (Cal.com): POST /v2/bookings with name, email, phone and current.start
    booked.set(current.id, (booked.get(current.id) || 0) + 1);
    const name = form.elements.name.value;
    const when = `${fShort.format(current.start)} at ${time(current.start)}`;
    const what = current.format.name;
    form.reset();
    lastFocus = null;                     // focus goes to the date heading instead
    closeDialog(true);
    render();
    ui.date.focus({ preventScroll: true });   // success popup returns focus here
    if (window.showSuccessPopup) {
      window.showSuccessPopup(name, {
        label: 'Session booked',
        text: `${what} · ${when}. A confirmation is on its way to your email.`,
      });
    }
  });

  renderFilters();
  render();
})();
