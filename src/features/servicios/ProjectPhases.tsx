"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/utils/cn";

// TODO(content): en Diseño/SERVICIOS.png el texto de "Fase 02. Ejecución y
// supervisión de obra" habla de mobiliario/decoración, y el de "Fase 03.
// Decoración" habla de industriales/supervisión de obra — el texto de estas
// dos fases parece estar intercambiado en el archivo original (las imágenes
// sí encajan con su propia etiqueta). Reproducido tal cual hasta confirmar
// con el cliente.
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";

export type ServicePhase = {
  _id: string;
  title: string;
  longDescription?: string[];
  image?: SanityImageSource;
};

/** Width of a collapsed spine, and the gap between panels. */
const SPINE_W = 72;
const GAP = 8;
/**
 * Fixed panel height on desktop. Every phase carries four paragraphs of
 * similar length, so pinning the height keeps the row from resizing as you
 * switch — a jump there would undo the point of the transition.
 */
const PANEL_H = 520;

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const DURATION = 600;

/**
 * The three services as a horizontal accordion: one panel open, the rest
 * collapsed to vino spines that hold their reading order — the phases before
 * the open one sit to its left, the ones after to its right. Clicking a
 * spine opens it and the row rearranges around it.
 *
 * Widths are plain CSS transitions in pixels, so the browser interpolates
 * the expansion itself and React only ever changes which index is active.
 * The row is measured once (and on resize) because the open panel's content
 * needs a fixed width of its own: without it the copy would re-wrap on every
 * frame of the animation, which reads as the text squirming.
 *
 * Below md the row becomes a column and nothing rotates — each phase is a
 * full-width bar that expands downward, the ordinary accordion a phone
 * expects.
 */
export function ProjectPhases({ phases }: { phases: ServicePhase[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduceMotion = useReducedMotion();
  // The panels still rearrange for someone who asked for less motion — they
  // just arrive instead of sliding.
  const duration = reduceMotion ? 0 : DURATION;
  const rowRef = useRef<HTMLDivElement>(null);
  const [rowWidth, setRowWidth] = useState(0);
  const baseId = useId();

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const measure = () => setRowWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const collapsed = phases.length - 1;
  const openWidth = Math.max(
    0,
    rowWidth - collapsed * SPINE_W - collapsed * GAP,
  );

  return (
    <section className="pt-[100px] pb-[40px]">
      <Container>
        <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
          Cada proyecto,
          <br />a medida
        </h2>

        <div
          ref={rowRef}
          className="mt-title flex flex-col md:flex-row"
          style={{ gap: `${GAP}px` }}
        >
          {phases.map((phase, index) => {
            const open = index === activeIndex;
            const panelId = `${baseId}-panel-${index}`;
            const tabId = `${baseId}-tab-${index}`;

            return (
              <div
                key={phase._id}
                className="relative overflow-hidden md:h-[var(--panel-h)] md:shrink-0"
                style={
                  {
                    "--panel-h": `${PANEL_H}px`,
                    // Only drive width on desktop; stacked, each item is
                    // simply full width.
                    ...(isDesktop && rowWidth
                      ? { width: open ? openWidth : SPINE_W }
                      : {}),
                    transitionProperty: "width",
                    transitionDuration: `${duration}ms`,
                    transitionTimingFunction: EASE,
                  } as React.CSSProperties
                }
              >
                {/* Collapsed spine. Stays mounted while open so the fade has
                    something to cross with, and stops taking clicks. */}
                <button
                  type="button"
                  id={tabId}
                  onClick={() => setActiveIndex(index)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className={cn(
                    "bg-primary text-background flex w-full items-center gap-4 px-5 py-4 text-left transition-opacity md:absolute md:inset-0 md:w-[72px] md:flex-col md:items-center md:justify-start md:gap-6 md:px-0 md:py-6",
                    open && "md:pointer-events-none md:opacity-0",
                    !open && "hover:opacity-90",
                  )}
                  style={{ transitionDuration: `${duration}ms` }}
                >
                  <span className="font-title text-xl leading-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {/* Vertical only from md up — on a phone the bar is
                      horizontal and the title reads normally. */}
                  <span className="font-title text-sm tracking-wide uppercase md:[writing-mode:vertical-rl]">
                    {phase.title}
                  </span>
                </button>

                {/* The open panel's content. Fixed width on desktop so the
                    copy keeps its line breaks while the panel resizes. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={tabId}
                  hidden={!open}
                  className={cn(
                    "border-primary/[0.13] bg-background md:absolute md:inset-y-0 md:right-0 md:overflow-hidden md:border",
                    open ? "md:opacity-100" : "md:opacity-0",
                  )}
                  style={
                    isDesktop && rowWidth
                      ? {
                          width: openWidth,
                          transitionProperty: "opacity",
                          transitionDuration: `${duration}ms`,
                          transitionTimingFunction: EASE,
                        }
                      : undefined
                  }
                >
                  <div className="flex h-full flex-col gap-8 p-6 md:flex-row md:items-stretch md:gap-10 md:p-10">
                    <div className="md:flex md:w-1/2 md:flex-col md:justify-center">
                      <h3 className="font-title text-primary/25 text-2xl uppercase">
                        {String(index + 1).padStart(2, "0")}. {phase.title}
                      </h3>
                      <div className="text-primary/75 mt-md space-y-md text-sm leading-relaxed">
                        {(phase.longDescription ?? []).map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                    </div>

                    <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-full md:w-1/2">
                      <Image
                        src={imageProps(phase.image)?.src ?? ""}
                        alt={phase.title}
                        fill
                        className="object-cover"
                        style={{
                          objectPosition: imageProps(phase.image)
                            ?.objectPosition,
                        }}
                        sizes="(min-width: 768px) 40vw, 100vw"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
