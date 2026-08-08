"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
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
 * Scroll-driven stacked cards on desktop only: the section title AND a
 * "stage" holding all three phases absolutely on top of each other are
 * pinned together (right below the navbar, no extra offset), so the title
 * stays put while cards slide underneath it — same `mt-title` gap between
 * title and content as any other section on the site, just pinned instead
 * of scrolling away.
 *
 * Each card is sized to its OWN natural content height — the image
 * column has no fixed aspect ratio on desktop, so Grid's default
 * `align-items: stretch` makes it match the text column's height exactly,
 * whatever that happens to be for that phase's copy. Because cards can
 * therefore differ slightly in height, the stage's own height is not a
 * constant either: it's driven by the same scroll progress as the cards
 * themselves, interpolating from one card's measured height to the next
 * over exactly the slice of scroll where that next card is sliding into
 * place — so the stage "breathes" in sync with the cover transition
 * instead of leaving slack or clipping a taller card.
 *
 * Each card's own `y` is tied to its slice of the group's overall scroll
 * progress — 100% (parked off-screen below) until its turn, animating to
 * 0% (fully covering the previous card) as the user scrolls through, then
 * holding there. Scrolling back up runs the same interpolation in reverse.
 *
 * Below `md`, cards render in normal document flow instead (see the
 * `isDesktop` branches below) — a scroll-jacked stack doesn't translate
 * well to touch, and there's no shared stage to size.
 */
function PhaseCard({
  phase,
  index,
  total,
  isFirst,
  isDesktop,
  scrollYProgress,
  onMeasure,
}: {
  phase: (typeof PHASES)[number];
  index: number;
  total: number;
  isFirst: boolean;
  isDesktop: boolean;
  scrollYProgress: MotionValue<number>;
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

  // The first card is already in place from the start. Each later card
  // slides in (100% -> 0%) over the PREVIOUS card's slice of the overall
  // scroll range, so it finishes covering just as that card's "turn" ends.
  // On mobile the transform is disabled entirely (always 0%).
  const animated = isDesktop && !isFirst;
  // Memoized so useTransform gets stable array references across
  // re-renders (e.g. when `heights` updates in the parent) — recreating
  // these arrays on every render has previously caused Framer's
  // array-based useTransform to silently stop tracking scroll mid-gesture.
  const inputRange = useMemo(
    () => (animated ? [(index - 1) / total, index / total] : [0, 1]),
    [animated, index, total],
  );
  const outputRange = useMemo(
    () => (animated ? ["100%", "0%"] : ["0%", "0%"]),
    [animated],
  );
  const y = useTransform(scrollYProgress, inputRange, outputRange);

  return (
    <motion.div
      ref={cardRef}
      style={{ y, zIndex: index + 1 }}
      className={cn(
        // md:pb-[40px]: breathing room at the bottom of the pinned card
        // before the next one starts covering it. The top gap comes from
        // the shared mt-title between the (now also pinned) section title
        // and this stage — no separate offset needed here.
        "bg-background relative md:absolute md:inset-x-0 md:top-0 md:pb-[40px]",
        !isFirst && "pt-16 md:pt-0",
      )}
    >
      <Container>
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

        {/* Only separator between cards: a hairline hitting 40px below
            wherever the text/image content ends, full-width. */}
        <div className="border-primary/[0.13] mt-[40px] border-t" />
      </Container>
    </motion.div>
  );
}

export function ProjectPhases() {
  const groupRef = useRef<HTMLDivElement>(null);
  const total = PHASES.length;
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [heights, setHeights] = useState<number[]>(() => PHASES.map(() => 0));

  const handleMeasure = useCallback((index: number, height: number) => {
    setHeights((prev) => {
      if (prev[index] === height) return prev;
      const next = [...prev];
      next[index] = height;
      return next;
    });
  }, []);

  const { scrollYProgress } = useScroll({
    target: groupRef,
    offset: ["start start", "end end"],
  });

  const allMeasured = heights.every((h) => h > 0);
  const fallbackHeight = Math.max(...heights, 1);
  const [h0, h1, h2] = allMeasured ? heights : [fallbackHeight, fallbackHeight, fallbackHeight];
  // Memoized for the same reason as PhaseCard's own inputRange/outputRange
  // above — stable references so useTransform keeps tracking scroll
  // instead of silently freezing when `heights` updates.
  const stageInputRange = useMemo(() => [0, 1 / total, 2 / total, 1], [total]);
  const stageOutputRange = useMemo(() => [h0, h1, h2, h2], [h0, h1, h2]);
  const stageHeight = useTransform(scrollYProgress, stageInputRange, stageOutputRange);

  return (
    // pt-[100px]: fixed hero-to-title gap, same on every breakpoint —
    // matches the rest of the site's section spacing. Breathing room from
    // the navbar once the cards are pinned comes entirely from the sticky
    // wrapper's own top-[120px] offset below, not from extra space here.
    <section className="pt-[100px]">
      {/* md:h-[300vh] = PHASES.length * 100vh, one "screen" of scroll per card */}
      <div ref={groupRef} className="relative md:h-[300vh]">
        {/* top-[120px] = navbar's own 80px height + ~40px of breathing
            room: the title (and, per its own mt-title gap, the cards)
            stay pinned there for the whole sequence. */}
        <div className="md:sticky md:top-[120px]">
          <Container>
            <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
              Cada proyecto,
              <br />
              a medida
            </h2>
          </Container>

          <motion.div
            className="relative mt-title md:overflow-hidden"
            style={isDesktop ? { height: stageHeight } : undefined}
          >
            {PHASES.map((phase, index) => (
              <PhaseCard
                key={phase.label}
                phase={phase}
                index={index}
                total={total}
                isFirst={index === 0}
                isDesktop={isDesktop}
                scrollYProgress={scrollYProgress}
                onMeasure={handleMeasure}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
