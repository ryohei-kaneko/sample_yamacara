const photoWrap  = document.querySelector('.photo-wrap');
const photoTrack = document.querySelector('.photo-track');
const total      = document.querySelectorAll('.photo-slide').length;

let trackX = 0;

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
  dragging = true;
  pointerX = e.clientX;
  baseX    = trackX;
  photoTrack.style.transition = 'none';
  photoWrap.classList.add('is-dragging');
});

window.addEventListener('mousemove', e => {
  if (!dragging) return;
  setTrack(clamp(baseX + (e.clientX - pointerX), maxX(), 0));
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

// ── touch swipe ──
let touchX    = 0;
let touchBase = 0;

photoWrap.addEventListener('touchstart', e => {
  touchX    = e.touches[0].clientX;
  touchBase = trackX;
  photoTrack.style.transition = 'none';
}, { passive: true });

photoWrap.addEventListener('touchmove', e => {
  setTrack(clamp(touchBase + (e.touches[0].clientX - touchX), maxX(), 0));
}, { passive: true });

// ── resize ──
window.addEventListener('resize', () => {
  setTrack(clamp(trackX, maxX(), 0));
});
