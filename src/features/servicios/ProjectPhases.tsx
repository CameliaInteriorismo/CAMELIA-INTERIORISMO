"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Container, Grid } from "@/components/layout/Container";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/utils/cn";

// TODO(content): en Diseño/SERVICIOS.png el texto de "Fase 02. Ejecución y
// supervisión de obra" habla de mobiliario/decoración, y el de "Fase 03.
// Decoración" habla de industriales/supervisión de obra — el texto de estas
// dos fases parece estar intercambiado en el archivo original (las imágenes
// sí encajan con su propia etiqueta). Reproducido tal cual hasta confirmar
// con el cliente.
const PHASES = [
  {
    label: "01. Interiorismo",
    body: [
      "Diseño con criterio, pensado para durar.",
      "Desarrollamos proyectos de interiorismo para obra nueva y reforma, abordando el espacio desde una base técnica: distribución, iluminación, instalaciones, materiales y carpintería.",
      "Entendemos el diseño como algo que debe sostenerse en el tiempo, tanto en lo funcional como en lo estético. Por eso cada decisión responde a un criterio, no a una tendencia puntual.",
      "El proceso parte de conocer bien al cliente —cómo vive, qué necesita y qué le representa— para traducirlo en un proyecto coherente, bien resuelto y ejecutable.",
    ],
    image: "/assets/servicios/Interiorismo.jpg",
  },
  {
    label: "Fase 02. Ejecución y supervisión de obra",
    body: [
      "Selección cuidada, sin elementos arbitrarios.",
      "Definimos y seleccionamos todos los elementos que completan el espacio: mobiliario, iluminación decorativa, textiles y piezas auxiliares.",
      "No entendemos la decoración como algo añadido al final, sino como parte del proyecto. Cada pieza se elige por cómo encaja en el conjunto, evitando decisiones aisladas o puramente estéticas.",
      "También nos encargamos del suministro y montaje si el cliente lo desea, para que el resultado final mantenga el nivel de exigencia del proyecto.",
    ],
    image: "/assets/servicios/Ejecucion y supervision.jpg",
  },
  {
    label: "Fase 03. Decoración",
    body: [
      "Rigor en obra, sin intermediarios ni improvisaciones.",
      "Ejecutamos los proyectos con industriales de confianza y bajo la supervisión directa del estudio. Esto nos permite mantener el control real de la obra y asegurar que lo proyectado se construya correctamente.",
      "Coordinamos todos los oficios, resolvemos incidencias y hacemos seguimiento continuo. Además, realizamos reuniones periódicas en obra contigo para que estés al tanto de cada fase.",
      "Solo ejecutamos proyectos diseñados por nosotros. Es la única forma de garantizar coherencia y responsabilidad en el resultado final.",
    ],
    image: "/assets/servicios/Decoracion.jpg",
  },
];

/**
 * Scroll distance each card occupies, as a fraction of the viewport. The
 * block pins for `PHASES.length * this` and the cards advance across it, so
 * it sets how much scrolling one card costs: 0.5 puts a card at roughly one
 * firm trackpad swipe, against the full screen the first version demanded.
 */
const CARD_SCROLL_VH = 0.5;
const CARD_EASE = [0.4, 0, 0.2, 1] as const;
const CARD_DURATION = 0.5;

/**
 * Stacked phase cards, pinned while they advance — the inoffarquitectura
 * pattern the studio pointed at.
 *
 * The block sticks under the navbar and holds there while the page scrolls
 * through a spacer as tall as the whole sequence. During that stretch the
 * cards rise over one another and the composition doesn't move; once the
 * last one has landed the spacer runs out, the block unpins and the page
 * carries on. Scrolling back up runs it in reverse, card by card.
 *
 * The card index comes from that scroll progress, floored — so each card is
 * a discrete step that animates into place, rather than being dragged
 * one-to-one with the wheel. That's what makes it read as a snap.
 *
 * An earlier attempt intercepted the wheel to freeze the page outright. It
 * gave exactly one card per gesture, but a scroll-jacked block can strand a
 * reader if any of its release conditions is wrong, and it left the section
 * with no scroll height of its own — so overshooting the entry left it
 * half off-screen with nothing to pin against. Native scrolling with a real
 * spacer can't fail that way.
 *
 * Below md none of it runs: the cards render in normal document flow.
 */
function PhaseCard({
  phase,
  index,
  activeIndex,
  isDesktop,
  reduceMotion,
  onMeasure,
}: {
  phase: (typeof PHASES)[number];
  index: number;
  activeIndex: number;
  isDesktop: boolean;
  reduceMotion: boolean;
  onMeasure: (index: number, height: number) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => onMeasure(index, el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, onMeasure]);

  // Parked below until its turn, then covering. Cards already passed stay
  // put underneath the ones on top of them.
  const covered = index <= activeIndex;
  const y = !isDesktop || covered ? "0%" : "100%";

  return (
    <motion.div
      ref={cardRef}
      // Always pass `animate`, with `isDesktop` folded into `y` above.
      // useMediaQuery reports false on the first render and flips true after
      // mount; going from `undefined` to an object left Framer with nothing
      // to animate from, so every card stayed at y:0 and the last one simply
      // covered the rest.
      animate={{ y }}
      initial={false}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: CARD_DURATION, ease: CARD_EASE }
      }
      style={{ zIndex: index + 1 }}
      className={cn(
        "bg-background relative md:absolute md:inset-x-0 md:top-0",
        index > 0 && "pt-16 md:pt-0",
      )}
    >
      <Container>
        {/* Caja cerrada por los cuatro lados, con 40px iguales arriba, abajo
            y a los lados. Antes solo había una línea inferior, que no
            delimitaba la tarjeta: al subir una sobre otra no se percibía
            dónde acababa una y empezaba la siguiente. El fondo opaco lo
            pone el contenedor de arriba, así que la tarjeta que sube tapa
            por completo a la de debajo, borde incluido. */}
        <div className="border-primary/[0.13] bg-background border p-[40px]">
          <Grid>
            <div className="col-span-12 md:col-span-5">
              <h3 className="font-title text-primary/20 text-2xl uppercase">
                {phase.label}
              </h3>
              <div className="text-primary/75 mt-md space-y-md text-sm leading-relaxed">
                {phase.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="col-span-12 mt-12 md:col-span-5 md:col-start-8 md:mt-0">
              <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-full">
                <Image
                  src={phase.image}
                  alt={phase.label}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
              </div>
            </div>
          </Grid>
        </div>
      </Container>
    </motion.div>
  );
}

export function ProjectPhases() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const total = PHASES.length;
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduceMotion = useReducedMotion() ?? false;

  const [activeIndex, setActiveIndex] = useState(0);
  const [heights, setHeights] = useState<number[]>(() => PHASES.map(() => 0));

  const handleMeasure = useCallback((index: number, height: number) => {
    setHeights((prev) => {
      if (prev[index] === height) return prev;
      const next = [...prev];
      next[index] = height;
      return next;
    });
  }, []);

  // 0 at the moment the block pins, 1 as it releases.
  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end end"],
  });

  // Floored into a card index: each card holds for its whole slice and then
  // the next one animates over it, which is what gives the discrete step
  // instead of a card dragged along under the finger.
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = Math.min(total - 1, Math.max(0, Math.floor(progress * total)));
    setActiveIndex((current) => (current === next ? current : next));
  });

  const fallback = Math.max(...heights, 1);
  const stageHeight = heights[activeIndex] || fallback;

  return (
    <section className="pt-[100px]">
      {/* The spacer is what the block pins against: as tall as the sequence
          needs, so the page has somewhere to scroll while the composition
          stays put. Without it `sticky` has no range and the block simply
          scrolls away. */}
      <div
        ref={spacerRef}
        className="relative"
        // 100vh + the sequence's own length. The extra viewport matters:
        // with offset ["start start", "end end"] the progress range is the
        // spacer MINUS one viewport, so a bare 150vh spacer ran all three
        // cards inside 450px and a single scroll skipped past two of them.
        style={
          isDesktop
            ? { height: `calc(100vh + 100vh * ${total * CARD_SCROLL_VH})` }
            : undefined
        }
      >
        <div className="md:sticky md:top-[120px]">
          <Container>
            <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
              Cada proyecto,
              <br />a medida
            </h2>
          </Container>

          <motion.div
            className="mt-title relative md:overflow-hidden"
            animate={{ height: isDesktop ? stageHeight : "auto" }}
            initial={false}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: CARD_DURATION, ease: CARD_EASE }
            }
          >
            {PHASES.map((phase, index) => (
              <PhaseCard
                key={phase.label}
                phase={phase}
                index={index}
                activeIndex={activeIndex}
                isDesktop={isDesktop}
                reduceMotion={reduceMotion}
                onMeasure={handleMeasure}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
