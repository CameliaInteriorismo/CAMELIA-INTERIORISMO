"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type MotionValue,
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

/** How far a card rises as it comes in. Small on purpose — a drift, not a slide. */
const ENTER_Y = 56;
/** And how far the one underneath drifts on as it's covered. */
const EXIT_Y = -28;
/** The outgoing card dims to this rather than going dark, so the cross-fade stays light. */
const EXIT_OPACITY = 0.35;

/**
 * Piecewise-linear lookup, clamped at both ends. `stops` must increase.
 * Used instead of Framer's useTransform so the value is computed here and
 * written straight to the node — see the note in PhaseCard.
 */
function interpolate(value: number, stops: number[], outputs: number[]) {
  const last = stops.length - 1;
  if (value <= stops[0]) return outputs[0];
  if (value >= stops[last]) return outputs[last];
  for (let i = 1; i <= last; i++) {
    if (value <= stops[i]) {
      const span = stops[i] - stops[i - 1];
      const t = span === 0 ? 0 : (value - stops[i - 1]) / span;
      return outputs[i - 1] + (outputs[i] - outputs[i - 1]) * t;
    }
  }
  return outputs[last];
}

/**
 * Stacked phase cards, pinned while they advance — the inoffarquitectura
 * pattern the studio pointed at.
 *
 * The block sticks under the navbar and holds there while the page scrolls
 * through a spacer as tall as the whole sequence. During that stretch the
 * cards cross over one another and the composition doesn't move; once the
 * last one has landed the spacer runs out, the block unpins and the page
 * carries on. Scrolling back up runs it in reverse.
 *
 * Every card is tied *continuously* to scroll position — position and
 * opacity are read straight off the scroll, so a card is wherever the
 * scroll says it is at that instant and follows the finger exactly. An
 * earlier version floored the progress into a card index and animated
 * between whole steps on a timer, which is what made it snap: the card
 * jumped on its own clock instead of tracking the gesture. Nothing here
 * runs on a duration any more.
 *
 * The incoming card rises {@link ENTER_Y}px while fading up from nothing;
 * the one it covers drifts {@link EXIT_Y}px on and dims to
 * {@link EXIT_OPACITY}. The two overlap, so the handover reads as a soft
 * dissolve rather than a card being dealt on top.
 *
 * Below md none of it runs: the cards render in normal document flow.
 */
function PhaseCard({
  phase,
  index,
  total,
  isDesktop,
  reduceMotion,
  scrollYProgress,
  onMeasure,
}: {
  phase: (typeof PHASES)[number];
  index: number;
  total: number;
  isDesktop: boolean;
  reduceMotion: boolean;
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

  // Stops across the whole sequence's progress: this card finishes arriving
  // at `mid` and is fully covered by `exit`.
  //
  // Every stop has to stay inside 0..1 and strictly increase. Framer hands
  // these straight to the Web Animations API as keyframe offsets, and a
  // negative one throws outright ("Offsets must be monotonically
  // non-decreasing") — which is why the first card can't be given the
  // `(index - 1) / total` entrance the others get. It has no entrance at
  // all: it's already in place when the block pins, and only ever exits.
  // The last card is the mirror image — it arrives and then holds, because
  // there's nothing after it to dim for.
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const enter = (index - 1) / total;
  const mid = index / total;
  const exit = (index + 1) / total;

  const stops = useMemo(() => {
    if (isFirst && isLast) return [0, 1];
    if (isFirst) return [mid, exit];
    if (isLast) return [enter, mid];
    return [enter, mid, exit];
  }, [isFirst, isLast, enter, mid, exit]);

  const yOutput = useMemo(() => {
    const rise = reduceMotion ? 0 : ENTER_Y;
    const drift = reduceMotion ? 0 : EXIT_Y;
    if (isFirst && isLast) return [0, 0];
    if (isFirst) return [0, drift];
    if (isLast) return [rise, 0];
    return [rise, 0, drift];
  }, [isFirst, isLast, reduceMotion]);

  const opacityOutput = useMemo(() => {
    if (isFirst && isLast) return [1, 1];
    if (isFirst) return [1, EXIT_OPACITY];
    if (isLast) return [0, 1];
    return [0, 1, EXIT_OPACITY];
  }, [isFirst, isLast]);

  // Styles are written straight onto the node on every scroll change rather
  // than going through a MotionValue bound to `style`.
  //
  // Framer hands accelerated properties like opacity to the Web Animations
  // API and scrubs them from its own frame loop. That's a fine optimisation
  // until the loop is starved — then the element sits frozen on its first
  // keyframe while the scroll has moved on, which showed up here as the last
  // card never appearing at the end of the sequence. Writing the values
  // directly removes the indirection: the element is always exactly where
  // the current scroll position says it should be, in both directions, and
  // it costs no React render.
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const el = cardRef.current;
    if (!el || !isDesktop) return;
    el.style.transform = `translateY(${interpolate(progress, stops, yOutput)}px)`;
    el.style.opacity = String(interpolate(progress, stops, opacityOutput));
  });

  // First paint, and whenever the breakpoint flips: without this the cards
  // sit unstyled until the first scroll event arrives.
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (!isDesktop) {
      el.style.transform = "";
      el.style.opacity = "";
      return;
    }
    const progress = scrollYProgress.get();
    el.style.transform = `translateY(${interpolate(progress, stops, yOutput)}px)`;
    el.style.opacity = String(interpolate(progress, stops, opacityOutput));
  }, [isDesktop, scrollYProgress, stops, yOutput, opacityOutput]);

  return (
    <div
      ref={cardRef}
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
    </div>
  );
}

export function ProjectPhases() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const total = PHASES.length;
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduceMotion = useReducedMotion() ?? false;

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

  // The stage grows and shrinks with the cards instead of jumping between
  // their heights: cards differ by a few dozen pixels, and a stepped height
  // would show up as a nudge at the exact moment of the handover. Written
  // straight to the node for the same reason as the cards' own styles.
  const stageRef = useRef<HTMLDivElement>(null);
  const fallback = Math.max(...heights, 1);
  const heightStops = useMemo(
    () => PHASES.map((_, i) => i / total).concat(1),
    [total],
  );
  const heightOutput = useMemo(() => {
    const measured = heights.map((h) => h || fallback);
    return measured.concat(measured[measured.length - 1]);
  }, [heights, fallback]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const el = stageRef.current;
    if (!el || !isDesktop) return;
    el.style.height = `${interpolate(progress, heightStops, heightOutput)}px`;
  });

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    el.style.height = isDesktop
      ? `${interpolate(scrollYProgress.get(), heightStops, heightOutput)}px`
      : "";
  }, [isDesktop, scrollYProgress, heightStops, heightOutput]);

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

          <div ref={stageRef} className="mt-title relative md:overflow-hidden">
            {PHASES.map((phase, index) => (
              <PhaseCard
                key={phase.label}
                phase={phase}
                index={index}
                total={total}
                isDesktop={isDesktop}
                reduceMotion={reduceMotion}
                scrollYProgress={scrollYProgress}
                onMeasure={handleMeasure}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
