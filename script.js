document.getElementById('year').textContent = new Date().getFullYear();

// NAV background on scroll
const nav = document.getElementById('nav');
const onNavScroll = () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onNavScroll, { passive: true });
onNavScroll();

// ---------------------------------------------------------------------------
// INTRO SPLASH: a full black screen with the name floating in it. Scroll is
// locked while it's up. Clicking anywhere, pressing Enter, or the first
// scroll/wheel/touch gesture dismisses it with a soft fade, revealing the
// calm hero scene underneath.
// ---------------------------------------------------------------------------
function initIntro() {
  const intro = document.getElementById('introScreen');
  const heroContent = document.getElementById('heroContent');
  if (!intro) return;

  document.documentElement.style.overflow = 'hidden';
  let dismissed = false;

  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    intro.classList.add('dismissed');
    document.documentElement.style.overflow = '';
    if (heroContent) heroContent.classList.add('in-view');
    window.removeEventListener('wheel', onFirstScroll);
    window.removeEventListener('touchmove', onFirstScroll);
    window.removeEventListener('keydown', onKey);
    setTimeout(() => { intro.style.display = 'none'; }, 850);
  }

  function onFirstScroll() { dismiss(); }
  function onKey(e) { if (e.key === 'Enter' || e.key === ' ') dismiss(); }

  intro.addEventListener('click', dismiss);
  window.addEventListener('wheel', onFirstScroll, { passive: true });
  window.addEventListener('touchmove', onFirstScroll, { passive: true });
  window.addEventListener('keydown', onKey);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initIntro);
} else {
  initIntro();
}

// Reveal-on-scroll for sections
const revealTargets = document.querySelectorAll(
  '.about-grid, .career-list, .awards-grid, .perf-list, .gallery-item, .highlight-inner, .contact-inner, .reveal-text'
);
revealTargets.forEach((el) => el.classList.add('will-reveal'));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => io.observe(el));
