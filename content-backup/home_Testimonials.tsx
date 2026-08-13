"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { ArrowLeftIcon, ArrowRightIcon, StarIcon } from "@/components/ui/icons";

// Reseñas reales de Google (vestavalencia.com), estudio anterior renombrado a Camelia.
const TESTIMONIALS = [
  {
    quote:
      "Necesitaba un cambio en mi casa que me diese esa calidez de hogar y en Camelia encontré lo que estaba buscando. Laura tiene un estilo y un buen gusto en todo lo que hace. Desde el primer momento confié ciegamente en ella y quedé encantada con el resultado final. Ha pensado al milímetro cada espacio, las calidades de los materiales no pueden ser mejores, los colores que ha combinado y las luces cálidas, me dan esa paz en mi casa que necesitaba.",
    name: "Eva F.",
    source: "Google Reviews",
  },
  {
    quote:
      "Quiero agradecer a Camelia por el excelente trabajo realizado en la reforma de mi hogar. Desde el primer contacto, mostraron profesionalismo, seriedad y compromiso. Cumplieron con los plazos establecidos, cuidando cada detalle y manteniendo siempre una comunicación clara y fluida. El resultado final superó mis expectativas, con acabados de alta calidad y un trato cercano y amable.",
    name: "Rafa A.",
    source: "Google Reviews",
  },
  {
    quote:
      "Un gusto trabajar con gente tan dedicada y profesional. Encantada con la atención personalizada y la capacidad de adaptarse y moldearse a todos los gustos. Muy muy recomendable.",
    name: "Lucía Martí G.",
    source: "Google Reviews",
  },
  {
    quote:
      "Una maravilla. Gente joven con ilusión, bien formada, con buenas ideas y un gran gusto. Asesoramiento tanto a nivel de diseño como técnico, tratando de entender tus necesidades y ajustarse a tu presupuesto. Sin duda, un servicio integral de gran calidad, 100% recomendable.",
    name: "Antonio A.",
    source: "Google Reviews",
  },
  {
    quote:
      "Atención inmejorable desde el primer momento del proyecto. El equipo da importancia a tus prioridades y te hace disfrutar del proceso sin preocupaciones. 100% recomendable.",
    name: "Sandra Pelufo M.",
    source: "Google Reviews",
  },
];

export function Testimonials() {
  const [offset, setOffset] = useState(0);
  const count = TESTIMONIALS.length;
  const visible = Array.from(
    { length: 3 },
    (_, i) => TESTIMONIALS[(i + offset) % count],
  );

  return (
    <section className="py-block">
      <Container>
        <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
          Palabras de quiénes
          <br />
          lo han vivido
        </h2>

        <div className="mt-title grid grid-cols-1 gap-8 md:grid-cols-3">
          {visible.map((testimonial, i) => (
            <div key={i} className="border-primary/15 border-t pt-6">
              <div className="text-primary flex gap-5">
                {Array.from({ length: 5 }).map((_, star) => (
                  <StarIcon key={star} className="h-3.5 w-3.5" />
                ))}
              </div>
              <p className="text-primary/80 mt-sm text-sm leading-relaxed">
                “{testimonial.quote}”
              </p>
              <p className="mt-sm text-sm font-medium">{testimonial.name}</p>
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
