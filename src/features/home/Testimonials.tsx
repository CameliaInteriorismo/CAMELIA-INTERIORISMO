"use client";

import { useState } from "react";
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

export function Testimonials({
  testimonials,
  title,
}: {
  testimonials: Testimonial[];
  title?: string;
}) {
  const [offset, setOffset] = useState(0);
  const count = testimonials.length;
  // Ocultar reseñas desde el panel puede dejar la lista vacía, y el carrusel
  // avanza con un resto sobre `count`: sin esto, dividir entre cero daría un
  // índice NaN y la sección reventaría en vez de simplemente no aparecer.
  if (count === 0) return null;
  const visible = Array.from(
    { length: 3 },
    (_, i) => testimonials[(i + offset) % count],
  );

  return (
    <section className="py-block">
      <Container>
        <h2 className="font-title text-primary text-3xl md:text-4xl">
          <Multiline text={title} />
        </h2>

        <div className="mt-title grid grid-cols-1 gap-8 md:grid-cols-3">
          {visible.map((testimonial, i) => (
            <div key={i} className="border-primary/15 border-t pt-6">
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
              <p className="mt-sm text-sm font-medium">{testimonial.author}</p>
              <p className="text-primary/70 text-xs">{testimonial.source}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-6">
          <button
            type="button"
            aria-label="Testimonio anterior"
            onClick={() => setOffset((o) => (o - 1 + count) % count)}
            className="transition-opacity hover:opacity-60"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Testimonio siguiente"
            onClick={() => setOffset((o) => (o + 1) % count)}
            className="transition-opacity hover:opacity-60"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </Container>
    </section>
  );
}
