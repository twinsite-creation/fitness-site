/* Video gallery
   1. Cards: the play button starts the clip from data-video-src (when it is set);
      until then the card only shows its preview.
   2. Mobile swipe gallery: pagination (lines + 01 / 06) follows the scroll,
      tapping a line jumps to that clip. */
(() => {
  /* ---------- 1. Play / pause ---------- */
  document.querySelectorAll('[data-video]').forEach((card) => {
    const button = card.querySelector('[data-video-toggle]');
    if (!button) return;
    let video = card.querySelector('video');

    const sync = () => {
      const playing = video && !video.paused && !video.ended;
      card.classList.toggle('is-playing', Boolean(playing));
      button.setAttribute('aria-pressed', String(Boolean(playing)));
    };

    const toggle = () => {
      const src = card.dataset.videoSrc;
      if (!video && !src) return;              // no clip yet — preview only
      if (!video) {
        video = document.createElement('video');
        video.className = 'video__media';
        video.src = src;
        video.playsInline = true;
        video.preload = 'metadata';
        card.prepend(video);
        ['play', 'pause', 'ended'].forEach((type) => video.addEventListener(type, sync));
        video.addEventListener('click', toggle);
      }
      if (video.paused || video.ended) video.play().catch(() => {});
      else video.pause();
    };

    button.addEventListener('click', toggle);
    if (video) {
      ['play', 'pause', 'ended'].forEach((type) => video.addEventListener(type, sync));
      video.addEventListener('click', toggle);
    }
  });

  /* ---------- 2. Mobile gallery pagination ---------- */
  const gallery = document.querySelector('[data-video-gallery]');
  if (!gallery) return;
  const track = gallery.querySelector('[data-video-track]');
  const items = [...track.children];
  const dotsList = gallery.querySelector('.video__dots');
  const indexEl = gallery.querySelector('[data-video-index]');
  const totalEl = gallery.querySelector('[data-video-total]');
  const pad = (n) => String(n).padStart(2, '0');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Scroll position at which an item sits at the start of the track
  // (the track is position: relative, so offsetLeft is measured from it)
  const startOf = (item) => item.offsetLeft - (parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0);

  totalEl.textContent = pad(items.length);
  const dots = items.map((item, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<button class="video__dot" type="button" aria-label="Video ${i + 1} of ${items.length}"><span aria-hidden="true"></span></button>`;
    const button = li.firstElementChild;
    button.addEventListener('click', () => {
      // Scroll only the gallery sideways (never the page)
      track.scrollTo({
        left: startOf(item),
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
      });
    });
    dotsList.append(li);
    return button;
  });

  let current = -1;
  const setCurrent = (i) => {
    if (i === current) return;
    current = i;
    dots.forEach((dot, n) => {
      dot.classList.toggle('is-active', n === i);
      dot.setAttribute('aria-current', n === i ? 'true' : 'false');
    });
    indexEl.textContent = pad(i + 1);
  };

  // The clip closest to the left edge of the track is the current one
  const update = () => {
    const left = track.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    items.forEach((item, i) => {
      const dist = Math.abs(startOf(item) - left);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    // At the very end the last card counts as current
    if (left + track.clientWidth >= track.scrollWidth - 2) best = items.length - 1;
    setCurrent(best);
  };

  track.addEventListener('scroll', update, { passive: true });   // cheap: 6 cards
  window.addEventListener('resize', update);
  update();
})();
