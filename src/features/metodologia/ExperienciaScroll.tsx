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
import { cn } from "@/utils/cn";

const STEPS = [
  {
    title: "Empezar con confianza",
    body: [
      "Sabemos que iniciar un proyecto así no es una decisión menor. Por eso, desde el primer contacto, buscamos que todo sea claro, cercano y sin presión.",
      "Nos interesa entenderte, pero también que tú entiendas cómo trabajamos y si encajamos. A partir de ahí empieza una relación que va más allá de lo puntual: un acompañamiento real durante todo el proceso.",
    ],
    image: "/assets/metodologia/experiencia-1-empezar.jpg",
    imageRight: true,
  },
  {
    title: "Conectar con la propuesta",
    body: [
      "Cada proyecto comienza escuchando. No solo qué necesitas, sino cómo vives, qué valoras y qué esperas de tu casa.",
      "A partir de ahí, las decisiones dejan de ser una suma de opciones y pasan a tener un hilo conductor. Nuestro trabajo es ordenar todo eso para que el resultado tenga sentido y te represente de forma natural.",
    ],
    image: "/assets/metodologia/experiencia-2-conectar.jpg",
    imageRight: false,
  },
  {
    title: "Tomar decisiones sin desgaste",
    body: [
      "Uno de los mayores retos en una reforma es la cantidad de decisiones que hay que tomar.",
      "Nuestro papel es filtrar, ordenar y proponerte soluciones que ya están pensadas. No se trata de que tengas que elegir constantemente, sino de que puedas avanzar con seguridad, sin dudas innecesarias.",
    ],
    image: "/assets/metodologia/experiencia-3-decisiones.jpg",
    imageRight: true,
  },
  {
    title: "Vivir el proceso con tranquilidad",
    body: [
      "Durante la obra, cuidamos especialmente la relación con el cliente. Sabemos que es una fase delicada, donde pueden aparecer incertidumbres.",
      "Nos encargamos de coordinar todo, anticiparnos a los problemas y mantenerte informado de forma clara. Queremos que sientas que el proyecto está controlado y que puedes confiar en que todo va a avanzar como debe.",
    ],
    image: "/assets/metodologia/experiencia-4-vivir.jpg",
    imageRight: false,
  },
  {
    title: "Construir un resultado a medida",
    body: [
      "El final del proyecto no es solo una entrega, es el momento en el que todo empieza a tener sentido.",
      "Buscamos que el resultado no solo esté bien resuelto, sino que encaje contigo, con tu forma de vivir y con el paso del tiempo. Un espacio que no necesite explicaciones y que se sienta natural desde el primer día.",
    ],
    image: "/assets/metodologia/experiencia-5-construir.jpg",
    imageRight: true,
  },
];

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
  isActive,
  progress,
}: {
  step: (typeof STEPS)[number];
  isFirst: boolean;
  index: number;
  isActive: boolean;
  progress: MotionValue<number>;
}) {
  const total = STEPS.length;
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
            {step.body.map((paragraph, i) => (
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
            src={step.image}
            alt={step.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 40vw, 100vw"
          />
        </div>
      </motion.div>
    </Grid>
  );
}

export function ExperienciaScroll() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = STEPS.length;

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
    <section className="pt-[120px] pb-[100px]">
      <Container>
        <h2 className="font-title text-primary text-center text-3xl uppercase md:text-4xl">
          La experiencia
        </h2>
        <p className="text-primary/75 mt-sm text-center text-sm leading-relaxed">
          Queremos que te sientas acompañado en cada fase del proyecto,
          entendiendo lo que ocurre en todo momento y viviendo el proceso con
          tranquilidad y confianza. Sabemos que diseñar un espacio implica
          muchas decisiones y tiempo, por eso buscamos hacer las cosas de forma
          cercana, clara y bien organizada, cuidando tanto el resultado final
          como la experiencia de todo el camino.
        </p>

        <div ref={stepsRef} className="relative mt-[100px]">
          {/* One continuous, fixed base line for the whole journey — it
              never moves or resizes; only the marker (in each row) does. */}
          <Grid className="pointer-events-none absolute inset-0">
            <div className="relative col-span-1 col-start-6 hidden h-full md:block">
              <div className="bg-primary/12 absolute inset-y-0 left-0 w-px" />
            </div>
          </Grid>

          {STEPS.map((step, index) => (
            <ExperienciaRow
              key={step.title}
              step={step}
              isFirst={index === 0}
              index={index}
              isActive={index === activeIndex}
              progress={unlockProgress}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
