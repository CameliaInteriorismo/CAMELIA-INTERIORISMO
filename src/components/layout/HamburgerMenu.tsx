"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { imageProps } from "@/sanity/lib/image";
import type { LinkData } from "@/features/shared/types";
import type { Social } from "@/features/contacto/types";

// The panel drops in from above and retreats the same way. 0.6s rather than
// the earlier 0.45: the contents now reveal *inside* this window, and the
// slightly longer slide gives them room to do it without either half
// feeling rushed.
const DURATION = 0.6;
const EASE = [0.4, 0, 0.2, 1] as const;

// The contents are not a second act. Each one fades up through a short
// vertical drift while the panel is still travelling, top to bottom, so the
// whole thing reads as one movement arriving rather than a menu that opens
// and then fills itself in.
const ITEM_DURATION = 0.4;
const ITEM_SHIFT = 12;
/**
 * Small enough that the reveal reads as a soft cascade rather than a counted
 * sequence — at 45ms across ten items several are always in flight at once.
 */
const ITEM_STAGGER = 0.045;
/**
 * Barely after the panel starts moving. The last item lands at roughly
 * 0.1 + 9×0.045 + 0.4 ≈ 0.9s against the panel's 0.6s, so the two overlap
 * almost end to end instead of queueing.
 */
const ITEM_DELAY = 0.1;

/**
 * Closing is not the reverse: everything leaves with the panel, at once and
 * immediately. Unwinding the cascade would leave links hanging over a
 * surface that has already gone.
 */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: -ITEM_SHIFT },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: ITEM_DURATION,
      ease: EASE,
      delay: ITEM_DELAY + i * ITEM_STAGGER,
    },
  }),
  exit: { opacity: 0, y: 0, transition: { duration: 0.12 } },
};

export function HamburgerMenu({
  links,
  cta,
  socials,
  onNavigate,
  onClose,
}: {
  links: LinkData[];
  /** El mismo `siteSettings.headerCta` que la barra: aquí no se duplica. */
  cta?: LinkData;
  socials: Social[];
  onNavigate: () => void;
  onClose: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  // Reduced motion keeps the panel but drops the per-item choreography —
  // the contents are simply there when it lands.
  const item = (i: number) =>
    shouldReduceMotion
      ? {}
      : ({
          custom: i,
          variants: itemVariants,
          initial: "hidden",
          animate: "open",
          exit: "exit",
        } as const);

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
      // mismo recorrido en los dos sentidos, como una persiana.
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
          src="/images/logos/Patron menu hamburguesa.png"
          alt=""
          fill
          priority
          sizes="100vw"
          // Anclado a la DERECHA: en el fichero las rayas ocupan la mitad
          // izquierda y la derecha es vino limpio, que es justo donde caen las
          // palabras. Centrado —o anclado a la izquierda— al ensanchar el
          // viewport el recorte se comía la zona limpia y las rayas cruzaban
          // el texto. Así la franja limpia queda siempre bajo la navegación.
          className="object-cover object-right"
        />
      </div>

      {/* Sin scroll interno: el menú cabe entero en pantalla. El contenido
          se reparte con flex y la lista se aprieta lo justo para que no
          desborde ni en portátiles cortos. */}
      <div className="text-background relative z-10 flex h-full flex-col overflow-hidden">
        <Container>
          {/* El mismo carril que la navegación: sin él el logotipo sobresalía
              40px a la derecha respecto a las palabras y la raya del borde le
              cruzaba la última letra. Logo y enlaces comparten margen, así que
              se leen como una sola columna. */}
          <div className="flex h-20 shrink-0 items-center justify-end max-lg:pr-10">
            {/* Cierra el menú y vuelve a Inicio. Entra con el panel, sin
                esperar turno: no forma parte de la cadena de enlaces. */}
            <motion.div {...item(0)}>
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

        <Container className="flex min-h-0 flex-1 flex-col justify-center">
          {/* Sized down from the previous 40px so the wordmark keeps the
              upper hand: at 30px the links read as calm navigation rather
              than as the headline of the screen.

              gap-3 y py-6 (antes 4 y 10): con ocho enlaces, el logotipo y
              los iconos, el conjunto tiene que caber sin scroll incluso en
              una pantalla de portátil corta. */}
          {/* En tablet las palabras van pegadas al borde derecho y las rayas
              del patrón les pasaban por encima. Este carril las separa sin
              tocar el patrón ni mover la navegación en móvil ni escritorio. */}
          <nav className="flex flex-col items-end gap-3 py-6 max-lg:pr-10">
            {links.map((link, i) => (
              // +1 because the wordmark above is the first in the sequence.
              <motion.div key={link.href} {...item(i + 1)}>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className="font-title hover:text-auxiliary block text-2xl leading-tight transition-colors duration-300 md:text-3xl"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Bajo md el CTA sale de la barra superior (ver Navbar), y sin
                esto /cuentanos-tu-proyecto se quedaba sin ninguna entrada en
                móvil. Va al cierre de la navegación, donde la lectura
                termina. Comparte el índice del cascadeo con los iconos
                sociales para no retrasarlos en escritorio, donde no se pinta.

                No lleva `onClick`: el panel entero cierra por el `onClick`
                de su raíz, y el clic del enlace burbujea hasta allí — el
                mismo camino que ya usan los enlaces de arriba. */}
            {cta && (
              <motion.div
                {...item(links.length + 1)}
                className="mt-sm md:hidden"
              >
                <ButtonLink
                  href={cta.href}
                  // Crema con el texto en vino: sobre el panel vino, el
                  // `bg-primary` de baseStyles se fundía con el fondo y el
                  // botón se leía como una línea de texto más.
                  //
                  // Los `!` no son un estilo extra, son lo que hace que
                  // ESTOS dos colores ganen: el `cn` del proyecto (ver
                  // utils/cn.ts) concatena sin resolver conflictos, así que
                  // conviven con los de base y decide el orden del CSS, no
                  // el del atributo. Sin ellos el fondo se quedaba en vino
                  // —medido: rgb(63,14,26) sobre rgb(63,14,26)—.
                  className="bg-background! text-primary!"
                >
                  {cta.label}
                </ButtonLink>
              </motion.div>
            )}
          </nav>
        </Container>

        <Container>
          {/* Cierra la cadena, justo detrás del último enlace. pb-10 en vez
              de pb-16 para no forzar el alto total. */}
          <motion.div
            {...item(links.length + 1)}
            // Mismo carril que el logotipo y los enlaces: los tres comparten
            // margen derecho, así que la columna se lee recta de arriba abajo
            // y ninguna raya del patrón les pasa por encima.
            className="flex shrink-0 justify-end gap-5 pb-10 max-lg:pr-10"
          >
            {socials.map((social) => {
              const label = social.label;
              const href = social.url;
              const src = imageProps(social.iconMenu)?.src;
              const icon = src ? (
                <Image
                  src={src}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              ) : null;
              // Una red sin URL: se dibuja la marca, pero no como enlace —
              // an anchor to "#" looks clickable and goes nowhere.
              return href ? (
                <a
                  key={social._key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="block h-6 w-6 transition-opacity duration-300 hover:opacity-70"
                >
                  {icon}
                </a>
              ) : (
                <span key={social._key} aria-hidden className="block h-6 w-6">
                  {icon}
                </span>
              );
            })}
          </motion.div>
        </Container>
      </div>
    </motion.div>
  );
}
