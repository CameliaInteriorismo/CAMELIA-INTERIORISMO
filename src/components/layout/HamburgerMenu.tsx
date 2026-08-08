"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { SOCIALS_MENU, SOCIAL_URLS } from "@/features/contacto/data";

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

// One block, one movement. The panel drops in from above the viewport on
// open and continues downward and out on close — the whole thing travelling
// together, contents included, with no per-column stagger and nothing
// animating on its own. Replaces the earlier column curtain.
const DURATION = 0.45;
const EASE = [0.4, 0, 0.2, 1] as const;

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
      className="bg-primary fixed inset-0 z-40 overflow-hidden"
      // Baja desde arriba al abrir y se retira por arriba al cerrar: el
      // mismo recorrido en los dos sentidos, como una persiana. Panel y
      // contenido viajan juntos; nada de dentro se anima por su cuenta.
      initial={shouldReduceMotion ? { opacity: 0 } : { y: "-100%" }}
      animate={shouldReduceMotion ? { opacity: 1 } : { y: "0%" }}
      exit={shouldReduceMotion ? { opacity: 0 } : { y: "-100%" }}
      transition={{ duration: DURATION, ease: EASE }}
      onClick={onClose}
    >
      {/* Striped backdrop, one plain layer now that there are no columns
          to keep in register. */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/assets/menu/Fondo menu hamburgesa.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="text-background relative z-10 flex h-full flex-col overflow-y-auto">
        <Container>
          <div className="flex h-20 shrink-0 items-center justify-end">
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
          </div>
        </Container>

        <Container className="flex flex-1 flex-col justify-center">
          {/* Sized down from the previous 40px so the wordmark keeps the
              upper hand: at 30px the links read as calm navigation rather
              than as the headline of the screen. */}
          <nav className="flex flex-col items-end gap-4 py-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                className="font-title hover:text-auxiliary block text-2xl leading-tight transition-colors duration-300 md:text-3xl"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Container>

        <Container>
          <div className="flex shrink-0 justify-end gap-5 pb-16">
            {SOCIALS_MENU.map(({ label, src }) => {
              const href = SOCIAL_URLS[label];
              const icon = (
                <Image
                  src={src}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              );
              // No URL yet (LinkedIn): render the mark, but not as a link —
              // an anchor to "#" looks clickable and goes nowhere.
              return href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="block h-6 w-6 transition-opacity duration-300 hover:opacity-70"
                >
                  {icon}
                </a>
              ) : (
                <span key={label} aria-hidden className="block h-6 w-6">
                  {icon}
                </span>
              );
            })}
          </div>
        </Container>
      </div>
    </motion.div>
  );
}
