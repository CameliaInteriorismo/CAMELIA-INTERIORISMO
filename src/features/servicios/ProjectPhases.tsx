"use client";

import Image from "next/image";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { ChevronDisclosure } from "@/components/ui/Accordion";
import { Multiline } from "@/features/shared/MultilineText";
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

/** Width of a collapsed spine, and the gap between panels en el carrusel. */
const SPINE_W = 72;
const GAP = 8;
/** Separación entre recuadros cuando van apilados (mobile). */
const GAP_STACKED = 16;
/**
 * Ancho mínimo de fila para que el carrusel siga viéndose bien: por debajo
 * de esto, la mitad de foto del panel abierto baja de ~260px y deja de
 * leerse como una foto real. No es un breakpoint de viewport — se mide el
 * ancho real de la fila, así que tablet sigue viendo el carrusel de
 * escritorio mientras quepa, y solo cae al acordeón apilado si de verdad
 * deja de caber.
 */
const MIN_CAROUSEL_ROW = 700;
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const DURATION = 600;

/**
 * The three services as a horizontal carousel: one panel open, the rest
 * collapsed to vino spines that hold their reading order — the phases before
 * the open one sit to its left, the ones after to its right. Clicking a
 * spine opens it and the row rearranges around it.
 *
 * Widths are plain CSS transitions in pixels, so the browser interpolates
 * the expansion itself and React only ever changes which index is active.
 * The row is measured once (and on resize) because the open panel's content
 * needs a fixed width of its own: without it the copy would re-wrap on every
 * frame of the animation, which reads as the text squirming. Esa misma
 * medición decide `isCarousel` — ver `MIN_CAROUSEL_ROW` — así que el propio
 * ancho disponible es lo que elige el modo, no un punto de corte fijo.
 *
 * Apilado (acordeón), cada fase es su propio recuadro con borde — ninguna
 * abierta por defecto ni fila conectada entre ellas — y cada una se abre y
 * cierra de forma independiente, sin afectar a las demás.
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
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  // Solo para el acordeón apilado. En el carrusel sigue habiendo siempre una
  // única fase activa (activeIndex) — aquí cada fase se abre y se cierra
  // sola, sin afectar a las demás, así que pueden quedar varias abiertas a
  // la vez. Ninguna abierta por defecto: el propio chevron ya dice que se
  // puede abrir.
  const [openIndices, setOpenIndices] = useState<Set<number>>(
    () => new Set(),
  );
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

  // El ancho real de la fila decide el modo — ver MIN_CAROUSEL_ROW. Antes de
  // la primera medición (rowWidth en 0) se asume apilado, el modo más
  // seguro; `useLayoutEffect` mide y corrige ANTES de que el navegador
  // pinte, así que esa suposición inicial nunca llega a verse en pantalla.
  const isCarousel = rowWidth >= MIN_CAROUSEL_ROW;

  useLayoutEffect(() => {
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
    <section className="pt-section">
      <Container>
        {/* PRUEBA: título en dos líneas fijado en código, sin pasar por
            `introTitle` — mismo tamaño y color en las dos líneas; la única
            diferencia es la mayúscula, que ya basta para marcar cuál es la
            palabra clave ("integral") sin restarle peso a la aclaración de
            debajo. Si se confirma este texto, hay que decidir si se deja así
            de fijo o se vuelve a conectar con Sanity (un campo de texto
            simple no puede llevar dos tratamientos de caja). */}
        <h2 className="font-title text-primary text-3xl md:text-4xl">
          <span className="block uppercase">Diseño integral</span>
          <span className="block">de interiores</span>
        </h2>
        {/* max-w-4xl y no 2xl: a 42rem la frase se partía justo detrás de
            "completo" y parecía un salto puesto a mano. A 56rem cabe de una
            vez, sin irse al ancho completo del contenedor.

            PRUEBA: mismo motivo que el titular — el subrayado en
            "inseparables" no cabe en un campo de texto plano de Sanity, así
            que de momento el párrafo entero va fijo aquí. */}
        <p className="text-primary/80 mt-content max-w-4xl text-sm leading-relaxed">
          Un proyecto de interiorismo completo con tres fases{" "}
          <span className="underline underline-offset-2">inseparables</span>,
          desde la primera idea hasta el último detalle, para crear el hogar
          que quieres vivir.
        </p>
        {/* Mismo tratamiento que "Sea cual sea el punto en el que estés." del
            bloque de acompañamiento: 24px, no un titular grande. Aquí solo
            encabeza las fases, no abre la página.

            `phasesTitle` llegaba desde Sanity y desde la propia página, pero
            este componente nunca lo pintaba — el campo existe en el panel,
            se puede editar, y no cambiaba nada en la web. */}
        {title && (
          <h3 className="font-title text-primary mt-content text-2xl">
            <Multiline text={title} />
          </h3>
        )}
        <div
          ref={rowRef}
          className={cn(
            "mt-md flex",
            isCarousel ? "flex-row items-stretch" : "flex-col",
          )}
          style={{ gap: isCarousel ? `${GAP}px` : `${GAP_STACKED}px` }}
        >
          {phases.map((phase, index) => {
            const open = isCarousel
              ? index === activeIndex
              : openIndices.has(index);
            // Acordeón apilado + abierta: el recuadro entero pasa a vino, el
            // color de marca, para que se lea de un vistazo cuál es la que
            // estás leyendo ahora — sobre todo importante ahora que pueden
            // quedar varias abiertas a la vez. El carrusel de escritorio no
            // se toca: su panel abierto sigue en crema, como siempre.
            const stackedOpen = !isCarousel && open;
            const panelId = `${baseId}-panel-${index}`;
            const tabId = `${baseId}-tab-${index}`;

            return (
              <div
                key={phase._id}
                className={cn(
                  "relative overflow-hidden",
                  isCarousel
                    ? "flex shrink-0 flex-col"
                    : stackedOpen
                      ? "bg-primary"
                      : "border-primary/15 border",
                )}
                style={
                  {
                    ...(isCarousel && tallest ? { minHeight: tallest } : {}),
                    // Only drive width on the carousel; stacked, each item
                    // is simply full width.
                    ...(isCarousel && rowWidth
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
                  onClick={() => {
                    if (isCarousel) {
                      // En el carrusel sigue habiendo siempre una fase
                      // activa: la fila reparte anchos y sin ninguna abierta
                      // quedaría un vacío a la derecha.
                      setActiveIndex(index);
                      return;
                    }
                    // Acordeón apilado: cada fase se abre y se cierra por sí
                    // sola. Volver a tocar la que ya está abierta la cierra;
                    // abrir otra no toca las demás — pueden quedar varias a
                    // la vez.
                    setOpenIndices((prev) => {
                      const next = new Set(prev);
                      if (next.has(index)) next.delete(index);
                      else next.add(index);
                      return next;
                    });
                  }}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className={cn(
                    "flex w-full items-center text-left transition-opacity",
                    isCarousel
                      ? "absolute inset-0 w-[72px] flex-col items-center justify-start gap-6 bg-primary px-0 py-6 text-background"
                      : "gap-4 px-5 py-5",
                    open && isCarousel && "pointer-events-none opacity-0",
                    !open &&
                      (isCarousel ? "hover:opacity-90" : "hover:opacity-70"),
                  )}
                  style={{ transitionDuration: `${duration}ms` }}
                >
                  <span
                    className={cn(
                      "font-title text-xl leading-none",
                      isCarousel || stackedOpen
                        ? "text-background"
                        : "text-primary",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {/* Vertical solo en el carrusel — apilado, la barra es
                      horizontal y el título se lee normal. */}
                  <span
                    className={cn(
                      "font-title text-sm tracking-wide uppercase",
                      isCarousel
                        ? "text-background [writing-mode:vertical-rl]"
                        : stackedOpen
                          ? "text-background flex-1"
                          : "text-primary flex-1",
                    )}
                  >
                    {phase.title}
                  </span>
                  {/* Chevron solo en el acordeón apilado: en el carrusel el
                      propio ensanchado de la fase ya dice que está abierta. */}
                  {!isCarousel && (
                    <ChevronDisclosure
                      open={open}
                      color={stackedOpen ? "text-background" : "text-primary"}
                    />
                  )}
                </button>

                {/* The open panel's content. Fixed width on the carousel so
                    the copy keeps its line breaks while the panel resizes. */}
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
                    isCarousel
                      ? "border-primary/[0.13] bg-background relative ml-auto flex-1 overflow-hidden border"
                      : stackedOpen
                        ? "bg-primary"
                        : "border-primary/[0.13] bg-background",
                    isCarousel && (open ? "opacity-100" : "opacity-0"),
                  )}
                  style={
                    isCarousel && rowWidth
                      ? {
                          width: openWidth,
                          transitionProperty: "opacity",
                          transitionDuration: `${duration}ms`,
                          transitionTimingFunction: EASE,
                        }
                      : undefined
                  }
                >
                  <div
                    className={cn(
                      "flex h-full gap-8 p-8",
                      isCarousel ? "flex-row items-stretch gap-10 p-12" : "flex-col",
                    )}
                  >
                    <div
                      data-phase-text
                      className={cn(
                        isCarousel && "flex w-1/2 flex-col justify-center",
                      )}
                    >
                      <h3
                        className={cn(
                          "font-title text-2xl uppercase",
                          stackedOpen ? "text-background/40" : "text-primary/25",
                        )}
                      >
                        FASE {String(index + 1).padStart(2, "0")}. {phase.title}
                      </h3>
                      <div
                        className={cn(
                          "mt-md space-y-md text-sm leading-relaxed",
                          stackedOpen ? "text-background/90" : "text-primary/75",
                        )}
                      >
                        {(phase.longDescription ?? []).map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                    </div>

                    <div
                      className={cn(
                        "relative w-full overflow-hidden",
                        isCarousel ? "h-full w-1/2" : "aspect-[4/5]",
                      )}
                    >
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
