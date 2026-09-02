"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { Container, Grid } from "@/components/layout/Container";
import { Multiline } from "@/features/shared/MultilineText";
import { cn } from "@/utils/cn";

import { imageProps, type SanityImageSource } from "@/sanity/lib/image";

export type ExperienceStep = {
  _key: string;
  title: string;
  paragraphs?: string[];
  /** Los pasos alternan el lado de la foto; el dato viaja con el paso. */
  imageRight?: boolean;
  image?: SanityImageSource;
};

// How much of a block's own slice of the shared progress its unlock fade
// ramps over — small, so it still reads as a discrete "unlock" rather than a
// slow continuous fade.
const UNLOCK_RAMP = 0.04;
const MARKER_LAYOUT_ID = "experiencia-marker";

/**
 * Same indicator component as Estudio's IndicatorList (shared `layoutId`
 * marker over a fixed base line), just driven by scroll position instead of
 * a click — see IndicatorList.tsx for the sibling implementation. The base
 * line is one continuous, always-visible element (12% opacity); only the
 * marker (80% opacity, a vertical bar the height of the active row) moves,
 * animating between rows via the shared layoutId exactly like Estudio does
 * between clicks.
 *
 * Text/image opacity is separate: a slice of the section-wide sticky
 * `progress` value, unlocked for good once reached and never fading back —
 * independent of which row currently holds the marker.
 */
function ExperienciaRow({
  step,
  isFirst,
  index,
  total,
  isActive,
  progress,
}: {
  step: ExperienceStep;
  isFirst: boolean;
  index: number;
  /** Cuántos pasos hay en total; antes se leía de la constante global. */
  total: number;
  isActive: boolean;
  progress: MotionValue<number>;
}) {
  const unlockAt = index / total;
  const opacity = useTransform(
    progress,
    [unlockAt, unlockAt + UNLOCK_RAMP],
    [0.3, 1],
  );

  return (
    <Grid className={cn(!isFirst && "mt-24")}>
      <motion.div
        style={{ opacity }}
        className={cn(
          "col-span-12 md:col-span-5 md:row-start-1 md:flex md:flex-col md:justify-center",
          step.imageRight ? "md:col-start-1" : "md:col-start-8",
        )}
      >
        <div>
          <h3 className="font-title text-primary text-2xl">{step.title}</h3>
          <div className="text-primary/75 mt-md space-y-md text-sm leading-relaxed">
            {(step.paragraphs ?? []).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="relative col-span-12 hidden md:col-span-1 md:col-start-6 md:row-start-1 md:block">
        {isActive && (
          <motion.div
            layoutId={MARKER_LAYOUT_ID}
            className="bg-primary/80 absolute top-0 left-0 h-full w-[2px]"
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </div>

      <motion.div
        style={{ opacity }}
        className={cn(
          "col-span-12 mt-8 md:col-span-5 md:row-start-1 md:mt-0",
          step.imageRight ? "md:col-start-8" : "md:col-start-1",
        )}
      >
        <div className="relative aspect-[9/10] w-full overflow-hidden">
          <Image
            src={imageProps(step.image)?.src ?? ""}
            alt={step.title}
            fill
            className="object-cover"
            style={{ objectPosition: imageProps(step.image)?.objectPosition }}
            sizes="(min-width: 768px) 40vw, 100vw"
          />
        </div>
      </motion.div>
    </Grid>
  );
}

export function ExperienciaScroll({
  steps,
  title,
  text,
}: {
  steps: ExperienceStep[];
  title?: string;
  text?: string;
}) {
  const stepsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = steps.length;

  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start end", "end start"],
  });

  // Sticky/monotonic progress driving each block's unlocked state: it only
  // ever grows while scrolling down through the section, holds while
  // scrolling back up within it (nothing already unlocked ever re-locks),
  // and only snaps back to 0 once the section is fully scrolled past above
  // the viewport — leaving and coming back (including via a page
  // navigation, since this is local component state) starts it over.
  const unlockProgress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest <= 0.001) {
      unlockProgress.set(0);
    } else if (latest > unlockProgress.get()) {
      unlockProgress.set(latest);
    }

    // The marker, unlike the opacity above, tracks the live "current" row —
    // it can move back up if the user scrolls back up, same as Estudio's
    // marker can jump back to an earlier item on click.
    const idx = Math.min(total - 1, Math.max(0, Math.floor(latest * total)));
    setActiveIndex(idx);
  });

  return (
    <section className="pt-section">
      <Container>
        {/* Mismo tratamiento que el titular de "El proceso": a la izquierda
            y con tope de medida, para que las dos secciones de la página
            abran igual. */}
        <h2 className="font-title text-primary max-w-3xl text-3xl md:text-4xl">
          <Multiline text={title} />
        </h2>
        {/* Arranca en la misma izquierda que el titular pero, al revés que
            él, no lleva tope de medida: ocupa el ancho del contenedor de
            punta a punta y forma una banda horizontal amplia. Los márgenes
            laterales los pone el Container, los mismos del resto de la web.
            El `max-md:text-left` que había aquí sobra desde que el texto ya
            no se centra en ningún ancho. */}
        <p className="text-primary/75 mt-content text-sm leading-relaxed">
          {text}
        </p>

        {/* Los 100px eran un valor fijo suelto, igual en las tres anchuras. En
            móvil abrían un hueco que hacía leer las filas como otra sección
            distinta de su propia entradilla. Bajo `md` pasa al token de
            bloque (32px); desde `md` se conserva el valor de siempre, que ahí
            funciona. */}
        <div
          ref={stepsRef}
          className="mt-section relative max-md:pl-8 md:mt-[100px]"
        >
          {/* MÓVIL: el mismo carril de Estudio (AboutSections). Uno tenue de
              fondo y, encima, el tramo recorrido, que crece con el bloque que
              el scroll tiene delante. No es navegación —no se pulsa—, solo
              informa de por dónde vas. La atenuación de cada bloque la sigue
              haciendo el `opacity` ligado al scroll que ya existía. */}
          <div className="bg-primary/15 absolute top-0 bottom-0 left-0 w-px md:hidden" />
          <motion.div
            className="bg-primary absolute top-0 left-0 w-px md:hidden"
            animate={{
              height: `${((activeIndex + 1) / Math.max(total, 1)) * 100}%`,
            }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          />
          {/* One continuous, fixed base line for the whole journey — it
              never moves or resizes; only the marker (in each row) does. */}
          <Grid className="pointer-events-none absolute inset-0">
            <div className="relative col-span-1 col-start-6 hidden h-full md:block">
              <div className="bg-primary/12 absolute inset-y-0 left-0 w-px" />
            </div>
          </Grid>

          {steps.map((step, index) => (
            <ExperienciaRow
              key={step.title}
              step={step}
              isFirst={index === 0}
              index={index}
              total={total}
              isActive={index === activeIndex}
              progress={unlockProgress}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
