import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Registers the ScrollTrigger plugin exactly once. Call before creating any
 * ScrollTrigger-based timeline (currently only the Home hero uses this).
 */
export function ensureGsapRegistered() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
