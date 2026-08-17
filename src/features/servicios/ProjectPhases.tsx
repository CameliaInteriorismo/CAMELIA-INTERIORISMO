"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Multiline } from "@/features/shared/MultilineText";
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
export function ProjectPhases({
  phases,
  title,
  introTitle,
  introText,
}: {
  phases: ServicePhase[];
  title?: string;
  introTitle?: string;
  introText?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduceMotion = useReducedMotion();
  // The panels still rearrange for someone who asked for less motion — they
  // just arrive instead of sliding.
  const duration = reduceMotion ? 0 : DURATION;
  const rowRef = useRef<HTMLDivElement>(null);
  const [rowWidth, setRowWidth] = useState(0);
  // El alto de la fila lo marca la fase MÁS LARGA, medida de su propio
  // contenido. No es una altura inventada: si mañana se alarga un texto o se
  // añade una fase desde el panel, la fila crece sola. Y como es la misma para
  // todas, cambiar de fase no produce ningún salto — que es justo lo que
  // buscaba la altura fija que había antes, pero sin dejar comprimida a la
  // fase más larga.
  const [tallest, setTallest] = useState(0);
  const baseId = useId();

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const measure = () => {
      setRowWidth(el.clientWidth);
      // Se mide la COLUMNA DE TEXTO, no el panel ni su contenedor: esos dos
      // ya están estirados por `flex-1` y `h-full`, así que medirlos y volver
      // a aplicar el resultado como alto los haría crecer sin fin en cada
      // medición. El texto, en cambio, mide lo que mide.
      //
      // Solo se puede medir el panel visible: los plegados llevan `hidden` y
      // no ocupan. Por eso se guarda el máximo visto — la fase más larga fija
      // el alto en cuanto se abre, y como la primera es la más larga y es la
      // que abre por defecto, ya está desde el primer pintado.
      const texto = el.querySelector<HTMLElement>(
        "[data-phase-panel]:not([hidden]) [data-phase-text]",
      );
      const caja = texto?.parentElement;
      if (texto && caja) {
        const cs = getComputedStyle(caja);
        const panel = getComputedStyle(caja.parentElement as HTMLElement);
        // Se suma también el borde del panel: sin él la altura calculada se
        // queda 2px corta y la fila baila entre 620 y 622 al cambiar de fase.
        const h =
          texto.scrollHeight +
          parseFloat(cs.paddingTop) +
          parseFloat(cs.paddingBottom) +
          parseFloat(panel.borderTopWidth) +
          parseFloat(panel.borderBottomWidth);
        setTallest((prev) => (h > prev ? h : prev));
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [phases, activeIndex]);

  const collapsed = phases.length - 1;
  const openWidth = Math.max(
    0,
    rowWidth - collapsed * SPINE_W - collapsed * GAP,
  );

  return (
    <section className="pt-[100px] pb-[40px]">
      <Container>
        <h2 className="font-title text-primary text-3xl md:text-4xl">
          <Multiline text={introTitle ?? "Diseño de interiores integral"} />
        </h2>
        {/* max-w-4xl y no 2xl: a 42rem la frase se partía justo detrás de
            "completo" y parecía un salto puesto a mano. A 56rem cabe de una
            vez, sin irse al ancho completo del contenedor. */}
        {introText && (
          <p className="text-primary/80 mt-md max-w-4xl text-sm leading-relaxed">
            {introText}
          </p>
        )}
        {/* Mismo tratamiento que "Sea cual sea el punto en el que estés." del
            bloque de acompañamiento: 24px, no un titular grande. Aquí solo
            encabeza las fases, no abre la página. */}
        <h3 className="font-title text-primary mt-md text-2xl">
          <Multiline text={title ?? "Fases de un proyecto Camelia"} />
        </h3>

        <div
          ref={rowRef}
          className="mt-md flex flex-col lg:flex-row lg:items-stretch"
          style={{ gap: `${GAP}px` }}
        >
          {phases.map((phase, index) => {
            const open = index === activeIndex;
            const panelId = `${baseId}-panel-${index}`;
            const tabId = `${baseId}-tab-${index}`;

            return (
              <div
                key={phase._id}
                className="relative overflow-hidden lg:flex lg:shrink-0 lg:flex-col"
                style={
                  {
                    ...(isDesktop && tallest ? { minHeight: tallest } : {}),
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
                    "bg-primary text-background flex w-full items-center gap-4 px-5 py-4 text-left transition-opacity lg:absolute lg:inset-0 lg:w-[72px] lg:flex-col lg:items-center lg:justify-start lg:gap-6 lg:px-0 lg:py-6",
                    open && "lg:pointer-events-none lg:opacity-0",
                    !open && "hover:opacity-90",
                  )}
                  style={{ transitionDuration: `${duration}ms` }}
                >
                  <span className="font-title text-xl leading-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {/* Vertical only from md up — on a phone the bar is
                      horizontal and the title reads normally. */}
                  <span className="font-title text-sm tracking-wide uppercase lg:[writing-mode:vertical-rl]">
                    {phase.title}
                  </span>
                </button>

                {/* The open panel's content. Fixed width on desktop so the
                    copy keeps its line breaks while the panel resizes. */}
                <div
                  id={panelId}
                  data-phase-panel
                  role="region"
                  aria-labelledby={tabId}
                  hidden={!open}
                  className={cn(
                    // En el flujo, no absoluto: es este panel el que da el
                    // alto de la ficha, y por eso el alto lo decide su
                    // contenido más el padding, sin ninguna altura fija ni
                    // mínima. Los plegados van ocultos y quedan a cero, pero
                    // la fila (`items-stretch`) los estira hasta el más alto,
                    // así que todos miden lo mismo y cambiar de fase no da
                    // ningún salto. Añadir o quitar fases no cambia nada.
                    "border-primary/[0.13] bg-background lg:relative lg:ml-auto lg:flex-1 lg:overflow-hidden lg:border",
                    open ? "lg:opacity-100" : "lg:opacity-0",
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
                  <div className="flex h-full flex-col gap-8 p-8 lg:flex-row lg:items-stretch lg:gap-10 lg:p-12">
                    <div
                      data-phase-text
                      className="lg:flex lg:w-1/2 lg:flex-col lg:justify-center"
                    >
                      <h3 className="font-title text-primary/25 text-2xl uppercase">
                        {String(index + 1).padStart(2, "0")}. {phase.title}
                      </h3>
                      <div className="text-primary/75 mt-md space-y-md text-sm leading-relaxed">
                        {(phase.longDescription ?? []).map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                    </div>

                    <div className="relative aspect-[4/5] w-full overflow-hidden lg:aspect-auto lg:h-full lg:w-1/2">
                      <Image
                        src={imageProps(phase.image)?.src ?? ""}
                        alt={phase.title}
                        fill
                        className="object-cover"
                        style={{
                          objectPosition: imageProps(phase.image)
                            ?.objectPosition,
                        }}
                        sizes="(min-width: 1024px) 40vw, 100vw"
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
