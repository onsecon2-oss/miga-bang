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
// HERO: MIGA BANG's photo runs small in a printed newspaper page. As the
// user scrolls, that same photo scales up in place — like the camera
// pushing into the clipping — until it fills the entire screen and becomes
// the full profile image, at which point the elegant title fades in.
//
// [0]        Newspaper texture fills the screen. A small photo "clipping"
//            sits centered with a caption under it, flanked by greeked
//            text columns and a small kicker label — reads as a real page.
// [0-18%]    The kicker, caption and side text columns fade out quickly
//            (as if the camera is already moving past them).
// [0-95%]    The photo frame scales up continuously (transform-origin
//            centered on it) until it covers the full viewport; its filter
//            crossfades from a flat halftone grayscale look to full color.
// [65-100%]  The title (eyebrow / MIGA BANG / subtitle) fades and rises
//            into place over the now full-bleed photo.
// ---------------------------------------------------------------------------
function initHero() {
  const npPage = document.getElementById('npPage');
  const npKicker = document.getElementById('npKicker');
  const npCaption = document.getElementById('npCaption');
  const npPhotoFrame = document.getElementById('npPhotoFrame');
  const npPhoto = document.getElementById('npPhoto');
  const npCols = document.querySelectorAll('.np-col');
  const heroContent = document.getElementById('heroContent');
  const heroScroll = document.getElementById('heroScroll');
  const hero = document.getElementById('hero');
  const heroPin = document.getElementById('heroPin');

  if (!hero || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.set(npPhotoFrame, { transformOrigin: '50% 50%' });
  gsap.set(heroContent, { opacity: 0, y: 20 });

  // how much the photo frame needs to scale so it fully covers the
  // viewport, recomputed on every ScrollTrigger refresh (resize / orientation
  // change) so it always works — including on mobile.
  function requiredScale() {
    const rect = npPhotoFrame.getBoundingClientRect();
    const baseW = rect.width / (gsap.getProperty(npPhotoFrame, 'scale') || 1);
    const baseH = rect.height / (gsap.getProperty(npPhotoFrame, 'scale') || 1);
    if (!baseW || !baseH) return 8;
    return Math.max(window.innerWidth / baseW, window.innerHeight / baseH) * 1.08;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      pin: heroPin,
      pinSpacing: false,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        heroScroll.style.opacity = self.progress > 0.02 ? '0' : '1';
      },
    },
  });

  // 0 -> 18%: the newspaper flavor elements fall away quickly
  tl.to([npKicker, npCaption], { opacity: 0, duration: 0.16, ease: 'power1.in' }, 0)
    .to(npCols, { opacity: 0, x: (i) => (i === 0 ? -20 : 20), duration: 0.16, ease: 'power1.in' }, 0);

  // 0 -> 95%: the clipping scales up to cover the whole screen; its filter
  // relaxes from flat newsprint grayscale into a real, full-color photo
  tl.to(npPhotoFrame, { scale: () => requiredScale(), duration: 0.95, ease: 'power1.inOut' }, 0)
    .to(npPhoto, { filter: 'grayscale(0) contrast(1) brightness(1)', duration: 0.6, ease: 'power1.inOut' }, 0.1);

  // the paper texture itself sinks away behind the enlarging photo
  tl.to(npPage, { opacity: 0.15, scale: 1.1, duration: 0.8, ease: 'power1.in' }, 0.15);

  // 65 -> 100%: the title rises into place over the full-bleed photo
  tl.to(heroContent, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0.65);
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
