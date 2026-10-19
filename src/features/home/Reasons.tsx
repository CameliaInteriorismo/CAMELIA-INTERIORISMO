import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Multiline } from "@/features/shared/MultilineText";
import type { LinkData } from "@/features/shared/types";

export type Reason = { _key: string; title: string; text?: string };

/**
 * «Por qué Camelia»: lo que nos diferencia, bajo los servicios.
 *
 * Los servicios cuentan QUÉ hacemos; esto cuenta por qué merece la pena
 * venir a un interiorista y no a una constructora. Va en columnas con la
 * misma línea fina arriba que las reseñas, para que se lea como de la casa.
 */
export function Reasons({
  reasons,
  title,
  cta,
}: {
  reasons: Reason[];
  title?: string;
  cta?: LinkData;
}) {
  if (reasons.length === 0) return null;
  return (
    <section className="pt-section">
      <Container>
        {title && (
          <h2 className="font-title text-primary max-w-2xl text-3xl md:text-4xl">
            <Multiline text={title} />
          </h2>
        )}
        <div className="mt-content grid grid-cols-1 gap-8 md:grid-cols-3">
          {reasons.map((reason) => (
            <div key={reason._key} className="border-primary/15 border-t pt-6">
              <h3 className="font-title text-primary text-xl">
                {reason.title}
              </h3>
              {reason.text && (
                <p className="text-primary/80 mt-sm text-sm leading-relaxed">
                  {reason.text}
                </p>
              )}
            </div>
          ))}
        </div>
        {cta?.href && (
          <div className="mt-content">
            <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
          </div>
        )}
      </Container>
    </section>
  );
}
