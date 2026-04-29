const photoWrap  = document.querySelector('.photo-wrap');
const photoTrack = document.querySelector('.photo-track');
const total      = document.querySelectorAll('.photo-slide').length;

let trackX     = 0;
let cachedMaxX = 0;

const GAP   = 16;
const maxX  = () => -(total - 1) * (photoWrap.offsetWidth + GAP);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function setTrack(x) {
  trackX = x;
  photoTrack.style.transform = `translateX(${x}px)`;
}

// ── mouse drag ──
let dragging = false;
let pointerX = 0;
let baseX    = 0;

photoWrap.addEventListener('mousedown', e => {
  dragging   = true;
  pointerX   = e.clientX;
  baseX      = trackX;
  cachedMaxX = maxX();
  photoTrack.style.transition = 'none';
  photoWrap.classList.add('is-dragging');
});

window.addEventListener('mousemove', e => {
  if (!dragging) return;
  setTrack(clamp(baseX + (e.clientX - pointerX), cachedMaxX, 0));
});

window.addEventListener('mouseup', () => {
  if (!dragging) return;
  dragging = false;
  photoWrap.classList.remove('is-dragging');
});

// ── trackpad ──
photoWrap.addEventListener('wheel', e => {
  if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
  e.preventDefault();
  photoTrack.style.transition = 'none';
  setTrack(clamp(trackX - e.deltaX, maxX(), 0));
}, { passive: false });

// ── touch swipe + momentum ──
let touchX     = 0;
let touchBase  = 0;
let lastX      = 0;
let lastTime   = 0;
let velocity   = 0;
let momentumId = null;

photoWrap.addEventListener('touchstart', e => {
  if (momentumId) { cancelAnimationFrame(momentumId); momentumId = null; }
  touchX     = e.touches[0].clientX;
  touchBase  = trackX;
  cachedMaxX = maxX();
  lastX      = touchX;
  lastTime   = Date.now();
  velocity   = 0;
  photoTrack.style.transition = 'none';
}, { passive: true });

photoWrap.addEventListener('touchmove', e => {
  e.preventDefault();
  const currentX = e.touches[0].clientX;
  const now      = Date.now();
  const dt       = now - lastTime;
  if (dt > 0 && dt < 100) velocity = (currentX - lastX) / dt;
  lastX    = currentX;
  lastTime = now;
  setTrack(clamp(touchBase + (currentX - touchX), cachedMaxX, 0));
}, { passive: false });

photoWrap.addEventListener('touchend', () => {
  velocity = clamp(velocity, -4, 4);

  function step() {
    velocity *= 0.93;
    if (Math.abs(velocity) < 0.05) return;
    const next = clamp(trackX + velocity * 16, cachedMaxX, 0);
    setTrack(next);
    if (next === cachedMaxX || next === 0) return;
    momentumId = requestAnimationFrame(step);
  }

  if (Math.abs(velocity) > 0.05) momentumId = requestAnimationFrame(step);
});

// ── resize ──
window.addEventListener('resize', () => {
  cachedMaxX = maxX();
  setTrack(clamp(trackX, cachedMaxX, 0));
});
