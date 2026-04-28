const hamburger = document.querySelector('.hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    document.body.classList.toggle('menu-open');
  });

  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
    });
  });
}
