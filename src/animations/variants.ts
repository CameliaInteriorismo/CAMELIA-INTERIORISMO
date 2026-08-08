import type { Variants } from "framer-motion";
import { transitionSubtle } from "@/animations/transitions";

/** Fade-in-on-view, used by any section that reveals once when scrolled into view. */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionSubtle },
};

/** Wraps a group of children that should reveal one after another. */
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

/** Expand/collapse for the shared Accordion primitive (Servicios, Producto). */
export const accordionHeightVariants: Variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1, transition: transitionSubtle },
};

/** Hover overlay for project cards (Home destacados + /proyectos) — opacity only, no scale/move. */
export const hoverOverlayVariants: Variants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: transitionSubtle },
};
