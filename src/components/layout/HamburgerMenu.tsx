"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/components/layout/Container";

const SOCIAL_LINKS = [
  { label: "Instagram", src: "/assets/icons/menu/instagram.png" },
  { label: "TikTok", src: "/assets/icons/menu/tiktok.png" },
  { label: "LinkedIn", src: "/assets/icons/menu/linkedin.png" },
];

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Estudio", href: "/estudio" },
  { label: "Metodología", href: "/metodologia" },
  { label: "Servicios", href: "/servicios" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Shop", href: "/tienda" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

// The panel is built from vertical columns that drop in one after another,
// per the Interiora reference. The order is deliberately not a plain
// left-to-right sweep — the reference staggers them unevenly, which is what
// gives the reveal its character rather than reading as a mechanical wipe.
const COLUMN_ORDER = [2, 0, 4, 1, 5, 3];
const COLUMN_COUNT = COLUMN_ORDER.length;
const COLUMN_STAGGER = 0.06;
const COLUMN_DURATION = 0.62;
// Content waits for the curtain to be essentially down before it starts.
const CONTENT_DELAY = COLUMN_DURATION * 0.55;
const EASE = [0.76, 0, 0.24, 1] as const;

const columnVariants: Variants = {
  closed: (i: number) => ({
    scaleY: 0,
    transition: {
      duration: COLUMN_DURATION * 0.8,
      ease: EASE,
      delay: COLUMN_ORDER[i] * COLUMN_STAGGER,
    },
  }),
  open: (i: number) => ({
    scaleY: 1,
    transition: {
      duration: COLUMN_DURATION,
      ease: EASE,
      delay: COLUMN_ORDER[i] * COLUMN_STAGGER,
    },
  }),
};

// Links rise into place one after another once the panel has landed, and
// leave together (and fast) so they never linger over a retracting curtain.
const itemVariants: Variants = {
  closed: { opacity: 0, y: 12, transition: { duration: 0.18, ease: EASE } },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay: CONTENT_DELAY + i * 0.055 },
  }),
};

export function HamburgerMenu({
  onNavigate,
  onClose,
}: {
  onNavigate: () => void;
  onClose: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  // There's no visible close control any more (the panel shuts via its
  // wordmark or a click off the links), so Escape is what keeps it
  // dismissable without a mouse — otherwise a keyboard user's only way out
  // would be to activate a link and be navigated somewhere.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    // Clicking anywhere that isn't a link closes the menu. Links close it
    // too (via onNavigate), so the bubbled click here is harmless.
    <motion.div
      className="fixed inset-0 z-40"
      initial="closed"
      animate="open"
      exit="closed"
      onClick={onClose}
    >
      {/* Curtain. Each column clips a slice of the striped backdrop, with
          an inner wrapper COLUMN_COUNT times wider offset by -i columns, so
          the pattern lines up seamlessly across all of them and reads as one
          continuous background. scaleY squashes each column vertically while
          it drops, which is invisible here because the artwork is pure
          vertical stripes with no variation down the y axis. */}
      <div className="absolute inset-0 flex" aria-hidden>
        {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={shouldReduceMotion ? undefined : columnVariants}
            className="bg-primary relative h-full flex-1 origin-top overflow-hidden"
          >
            <div
              className="absolute inset-y-0"
              style={{
                width: `${COLUMN_COUNT * 100}%`,
                left: `-${i * 100}%`,
              }}
            >
              <Image
                src="/assets/menu/Fondo menu hamburgesa.png"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-background relative z-10 flex h-full flex-col overflow-y-auto">
        <Container>
          <div className="flex h-20 shrink-0 items-center justify-end">
            <motion.div custom={0} variants={itemVariants}>
              {/* Closes the menu and returns Home. */}
              <Link
                href="/"
                onClick={onNavigate}
                aria-label="Camelia — inicio"
                className="flex items-center"
              >
                <Image
                  src="/assets/logo/trimmed/Camelia logo crema.png"
                  alt="Camelia"
                  width={828}
                  height={130}
                  priority
                  className="h-6 w-auto"
                />
              </Link>
            </motion.div>
          </div>
        </Container>

        <Container className="flex flex-1 flex-col justify-center">
          {/* Sized down from the previous 40px so the wordmark keeps the
              upper hand: at 30px the links read as calm navigation rather
              than as the headline of the screen. */}
          <nav className="flex flex-col items-end gap-4 py-10">
            {NAV_LINKS.map((link, i) => (
              <motion.div key={link.href} custom={i + 1} variants={itemVariants}>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className="font-title hover:text-auxiliary block text-2xl leading-tight transition-colors duration-300 md:text-3xl"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </Container>

        <Container>
          <motion.div
            custom={NAV_LINKS.length + 1}
            variants={itemVariants}
            className="flex shrink-0 justify-end gap-5 pb-16"
          >
            {SOCIAL_LINKS.map(({ label, src }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="block h-6 w-6"
              >
                <Image
                  src={src}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              </a>
            ))}
          </motion.div>
        </Container>
      </div>
    </motion.div>
  );
}
