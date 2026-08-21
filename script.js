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
// HERO: violin spins in place on a white stage, then dissolves into the
// portrait of MIGA BANG actually holding it, and finally the name appears.
//
// [0]       White stage, a single violin centered and large. Nothing else visible.
// [0-55%]   The violin spins in place (multiple full turns) while shrinking
//           slightly, as if being lifted and turned toward playing position.
// [40-72%]  The violin dissolves out while the portrait of MIGA BANG holding
//           the violin crossfades in at roughly the same spot.
// [72-100%] The eyebrow / name / subtitle rise and fade in beneath the portrait.
// ---------------------------------------------------------------------------
function initHero() {
  const violinWrap = document.getElementById('heroViolinWrap');
  const portraitWrap = document.getElementById('heroPortraitWrap');
  const heroContent = document.getElementById('heroContent');
  const heroScroll = document.getElementById('heroScroll');
  const hero = document.getElementById('hero');
  const heroPin = document.getElementById('heroPin');

  if (!hero || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.set(violinWrap, { scale: 1, rotationY: 0, opacity: 1, transformOrigin: '50% 50%', transformPerspective: 1600 });
  gsap.set(portraitWrap, { scale: 0.9, opacity: 0, transformOrigin: '50% 50%' });
  gsap.set(heroContent, { opacity: 0, y: 26 });

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

  // 0 -> 55%: the violin spins in place around its vertical axis (like a
  // product turntable), gently shrinking as it turns
  tl.to(violinWrap, { rotationY: 720, scale: 0.72, duration: 0.55, ease: 'power1.inOut' }, 0)
    .to(violinWrap, { opacity: 0, duration: 0.18, ease: 'power1.in' }, 0.42);

  // 40 -> 72%: the portrait (violin now in her hands) fades into the same spot
  tl.to(portraitWrap, { opacity: 1, scale: 1, duration: 0.32, ease: 'power2.out' }, 0.4);

  // 72 -> 100%: title rises into place beneath the portrait
  tl.to(heroContent, { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' }, 0.72);
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
