"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Shrinks an element's font just enough to keep its content on one line
// (rather than letting the browser wrap it) when it would otherwise
// overflow — e.g. a ficha with all three, long service names on a narrow
// viewport. Never grows past the breakpoint's own size, only shrinks.
function fitOneLine(el: HTMLElement | null): number | null {
  if (!el) return null;
  el.style.fontSize = "";
  const available = el.parentElement?.clientWidth ?? 0;
  const natural = el.scrollWidth;
  if (natural > available && available > 0) {
    const base = parseFloat(getComputedStyle(el).fontSize);
    return Math.floor(base * (available / natural) * 0.98 * 100) / 100;
  }
  return null;
}

const labelClass = "font-title text-primary uppercase tracking-[0.05em]";
const valueClass = "text-primary/75";
const dividerClass = "text-primary/40";

export function ProjectInfo({
  year,
  location,
  services,
}: {
  year: string;
  location: string;
  /** Nombres de los servicios, resueltos desde las referencias de Sanity. */
  services: string[];
}) {
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const enUnaLinea = useMediaQuery("(min-width: 768px)");
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const [line1FontSize, setLine1FontSize] = useState<number | null>(null);
  const [line2FontSize, setLine2FontSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    function fit() {
      setLine1FontSize(fitOneLine(line1Ref.current));
      setLine2FontSize(fitOneLine(line2Ref.current));
    }

    let cancelled = false;
    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => {
      if (!cancelled) fit();
    });
    window.addEventListener("resize", fit);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", fit);
    };
  }, [location, services]);

  return (
    <section className="mt-[100px]">
      <Container>
        <div className="space-y-3 text-base sm:text-lg md:text-xl">
          <p
            ref={line1Ref}
            // Igual que la línea de servicios: a 320px "Año | Ubicación" no
            // cabe ni encogiendo, así que en móvil se deja envolver con su
            // tamaño natural. Desde md vuelve al ajuste medido.
            style={
              enUnaLinea && line1FontSize
                ? { fontSize: line1FontSize }
                : undefined
            }
            className={enUnaLinea ? "whitespace-nowrap" : "whitespace-normal"}
          >
            <span className={labelClass}>Año:</span>{" "}
            <span className={valueClass}>{year}</span>
            <span
              className={`${dividerClass} mx-4 max-md:hidden`}
              aria-hidden="true"
            >
              |
            </span>
            {/* Envolviendo, la barra vertical quedaba suelta al final de una
                línea; en móvil cada dato ocupa la suya. */}
            <span className="max-md:block" />
            <span className={labelClass}>Ubicación:</span>{" "}
            <span className={valueClass}>{location}</span>
          </p>

          <p
            ref={line2Ref}
            // La línea se encoge para caber de una vez, pero en un móvil eso
            // la dejaba ilegible o cortada: ahí se deja envolver con su tamaño
            // natural. Desde md vuelve al ajuste medido de siempre.
            style={
              enUnaLinea && line2FontSize
                ? { fontSize: line2FontSize }
                : undefined
            }
            className={enUnaLinea ? "whitespace-nowrap" : "whitespace-normal"}
          >
            <span className={labelClass}>Servicios:</span>{" "}
            {services.map((service, index) => (
              // Envolviendo, el punto separador quedaba colgando al final de
              // una línea. En móvil cada servicio ocupa la suya y el separador
              // desaparece; desde md vuelve la enumeración en línea.
              <span key={service} className="max-md:block">
                {index > 0 && (
                  <span
                    className={`${dividerClass} mx-3 max-md:hidden`}
                    aria-hidden="true"
                  >
                    ·
                  </span>
                )}
                <span className={valueClass}>{service}</span>
              </span>
            ))}
          </p>
        </div>
      </Container>
    </section>
  );
}
