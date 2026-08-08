/**
 * Single source of truth for animation timing. Nothing in the project should
 * inline a duration/easing literal — import from here so every animation
 * stays inside the brief's 0.4–0.8s "subtle, calm" range.
 */
export const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;

export const transitionSubtle = {
  duration: 0.5,
  ease: EASE_STANDARD,
};

export const transitionSlow = {
  duration: 0.8,
  ease: EASE_STANDARD,
};
