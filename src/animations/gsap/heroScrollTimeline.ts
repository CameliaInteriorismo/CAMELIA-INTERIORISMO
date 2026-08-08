import { ensureGsapRegistered, gsap } from "@/animations/gsap/gsapConfig";

/**
 * Drives the Home hero's single continuous motion: the "CAMELIA" wordmark
 * shrinks/travels from its centered position over the hero video toward the
 * navbar's brand slot, fading out right as it arrives — the navbar's own
 * (independent, React-driven) wordmark crossfades in at that same threshold,
 * see `useHeroStore`/`Navbar.tsx`. `navbarBrandEl` is only read here
 * (getBoundingClientRect) to size the trip accurately; it is never animated
 * directly, since it can unmount/remount when the hamburger menu opens and
 * an inline GSAP style left on it would go stale.
 *
 * Both elements are horizontally centered independently (`left-1/2
 * -translate-x-1/2`) so only the vertical delta and scale ratio need
 * computing — no horizontal alignment work required.
 *
 * This is the only GSAP ScrollTrigger timeline in the project; everything
 * else uses Framer Motion (see src/animations/variants.ts).
 */
export function createHeroScrollTimeline({
  heroEl,
  logoEl,
  navbarBrandEl,
  onProgress,
}: {
  heroEl: HTMLElement;
  logoEl: HTMLElement;
  navbarBrandEl: HTMLElement;
  onProgress?: (progress: number) => void;
}) {
  ensureGsapRegistered();

  const logoRect = logoEl.getBoundingClientRect();
  const navRect = navbarBrandEl.getBoundingClientRect();

  const scale = navRect.height / logoRect.height;
  const deltaY =
    navRect.top + navRect.height / 2 - (logoRect.top + logoRect.height / 2);

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: heroEl,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => onProgress?.(self.progress),
    },
  });

  timeline
    .to(logoEl, { y: deltaY, scale, ease: "none", duration: 0.85 }, 0)
    .to(logoEl, { opacity: 0, ease: "none", duration: 0.15 }, 0.85);

  return timeline;
}
