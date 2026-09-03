"use client";

import { useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { ArrowLeftIcon, ArrowRightIcon, StarIcon } from "@/components/ui/icons";
import { Multiline } from "@/features/shared/MultilineText";

/**
 * Una reseña de la Home. Son reseñas reales de Google del estudio, que antes
 * se llamaba Vesta Valencia; por eso su origen se guarda en `source` y se
 * edita desde el panel, en vez de darlo por supuesto aquí.
 */
export type Testimonial = {
  _id: string;
  quote: string;
  author: string;
  source?: string;
  rating?: number;
};

/** Las flechas cambian las tres tarjetas de golpe: se lee por bloques. */
const POR_BLOQUE = 3;

/** Curva de salida fuerte: arranca rápido y frena al final. */
const CURVA = "cubic-bezier(0.23, 1, 0.32, 1)";

export function Testimonials({
  testimonials,
  title,
}: {
  testimonials: Testimonial[];
  title?: string;
}) {
  const [bloque, setBloque] = useState(0);
  const sinMovimiento = useReducedMotion();
  const count = testimonials.length;

  /**
   * Las reseñas repartidas en bloques de tres.
   *
   * Si el total no es múltiplo de tres, el último bloque se completa
   * volviendo al principio en vez de dejar huecos: la rejilla siempre tiene
   * sus tres columnas llenas.
   */
  const bloques = useMemo(() => {
    const out: Testimonial[][] = [];
    for (let i = 0; i < count; i += POR_BLOQUE) {
      out.push(
        Array.from(
          { length: POR_BLOQUE },
          (_, k) => testimonials[(i + k) % count],
        ),
      );
    }
    return out;
  }, [testimonials, count]);

  // Ocultar reseñas desde el panel puede dejar la lista vacía, y el carrusel
  // avanza con un resto sobre el número de bloques: sin esto, dividir entre
  // cero daría un índice NaN y la sección reventaría en vez de no aparecer.
  if (count === 0) return null;
  const total = bloques.length;

  return (
    <section className="pt-section">
      <Container>
        <h2 className="font-title text-primary text-3xl md:text-4xl">
          <Multiline text={title} />
        </h2>

        {/*
          Cada columna monta TODAS las reseñas que puede llegar a enseñar,
          apiladas en la misma celda, y solo se ve la del bloque activo.
          Dos cosas salen de ahí:

          - La altura deja de moverse. La fila se dimensiona por la tarjeta
            más alta de todas, no por las tres que se ven, así que al pasar
            de bloque la sección no sube ni baja.
          - La transición no necesita temporizadores: entrante y saliente
            coexisten, y una transición de opacidad se puede interrumpir a
            mitad si alguien pulsa la flecha dos veces seguidas.
        */}
        <div className="mt-content grid grid-cols-1 gap-8 md:grid-cols-3">
          {Array.from({ length: POR_BLOQUE }, (_, columna) => (
            <div key={columna} className="grid">
              {bloques.map((tres, i) => {
                const testimonial = tres[columna];
                const activa = i === bloque;
                // La saliente se va deprisa y sin moverse; la entrante llega
                // después, para que no se solapen los dos textos. El pequeño
                // retardo por columna hace que el cambio caiga en cascada en
                // vez de conmutar de golpe.
                const entrada = sinMovimiento
                  ? "opacity 200ms linear 120ms"
                  : `opacity 200ms ${CURVA} ${110 + columna * 40}ms, transform 200ms ${CURVA} ${110 + columna * 40}ms`;
                const salida = sinMovimiento
                  ? "opacity 120ms linear"
                  : `opacity 120ms ${CURVA}, transform 0ms`;

                return (
                  <div
                    key={i}
                    aria-hidden={!activa}
                    inert={!activa}
                    className="border-primary/15 col-start-1 row-start-1 border-t pt-6"
                    style={{
                      opacity: activa ? 1 : 0,
                      transform:
                        activa || sinMovimiento
                          ? "translateY(0)"
                          : "translateY(8px)",
                      transition: activa ? entrada : salida,
                    }}
                  >
                    <div className="text-primary flex gap-5">
                      {Array.from({ length: testimonial?.rating ?? 5 }).map(
                        (_, star) => (
                          <StarIcon key={star} className="h-3.5 w-3.5" />
                        ),
                      )}
                    </div>
                    <p className="text-primary/80 mt-sm text-sm leading-relaxed">
                      “{testimonial.quote}”
                    </p>
                    <p className="mt-sm text-sm font-medium">
                      {testimonial.author}
                    </p>
                    <p className="text-primary/70 text-xs">
                      {testimonial.source}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-6">
          <button
            type="button"
            aria-label="Tres testimonios anteriores"
            onClick={() => setBloque((b) => (b - 1 + total) % total)}
            className="transition-opacity hover:opacity-60"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Tres testimonios siguientes"
            onClick={() => setBloque((b) => (b + 1) % total)}
            className="transition-opacity hover:opacity-60"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </Container>
    </section>
  );
}
