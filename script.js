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
// HERO: torn paper covering the screen peels open top/bottom on scroll.
//
// [0]       A single sheet of torn paper fills the whole hero, edges jagged
//           at the seam. Nothing behind it is visible yet.
// [0-100%]  The top half lifts up and away, the bottom half drops down and
//           away (opposite directions, slight rotation for a "torn open"
//           feel). As the gap between them widens, MIGA BANG's portrait and
//           name — sitting on a layer underneath the paper the whole time —
//           become visible through the widening crack, growing into a full
//           reveal by the time the paper has cleared the frame.
// ---------------------------------------------------------------------------
function initHero() {
  const paperTop = document.getElementById('paperTop');
  const paperBottom = document.getElementById('paperBottom');
  const heroReveal = document.getElementById('heroReveal');
  const heroContent = document.getElementById('heroContent');
  const heroScroll = document.getElementById('heroScroll');
  const hero = document.getElementById('hero');
  const heroPin = document.getElementById('heroPin');

  if (!hero || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.set(paperTop, { y: 0, rotate: 0, transformOrigin: '50% 0%' });
  gsap.set(paperBottom, { y: 0, rotate: 0, transformOrigin: '50% 100%' });
  gsap.set(heroReveal, { opacity: 0.55, scale: 1.06 });
  gsap.set(heroContent, { opacity: 0, y: 20 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      pin: heroPin,
      pinSpacing: false,
      onUpdate: (self) => {
        heroScroll.style.opacity = self.progress > 0.02 ? '0' : '1';
      },
    },
  });

  // 0 -> 100%: the two paper halves tear apart and clear the frame
  tl.to(paperTop, { y: '-120%', rotate: -3.5, duration: 1, ease: 'power2.inOut' }, 0)
    .to(paperBottom, { y: '120%', rotate: 3.5, duration: 1, ease: 'power2.inOut' }, 0);

  // what's underneath sharpens and settles as the gap widens
  tl.to(heroReveal, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, 0);

  // 55 -> 100%: the name rises into place once there's enough room to read it
  tl.to(heroContent, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.55);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero);
} else {
  initHero();
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
