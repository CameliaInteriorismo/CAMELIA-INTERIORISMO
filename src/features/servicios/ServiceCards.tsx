import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Multiline } from "@/features/shared/MultilineText";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";

export type ServiceCard = {
  _id: string;
  title: string;
  shortDescription?: string;
  includes?: string[];
  note?: string;
  image?: SanityImageSource;
};

/**
 * Los tres servicios a la vista, uno junto a otro: qué es cada uno y qué
 * incluye. Sustituye al carrusel de fases, donde solo se leía la primera y
 * las otras dos quedaban plegadas como tiras: quien llegaba no veía de un
 * vistazo qué hacemos.
 */
export function ServiceCards({
  services,
  title,
  intro,
}: {
  services: ServiceCard[];
  title?: string;
  intro?: string;
}) {
  if (services.length === 0) return null;
  return (
    <section className="pt-section">
      <Container>
        {title && (
          <h2 className="font-title text-primary text-3xl md:text-4xl">
            <Multiline text={title} />
          </h2>
        )}
        {intro && (
          <p className="text-primary mt-content max-w-[44rem] text-sm leading-relaxed">
            {intro}
          </p>
        )}
        <div className="mt-content grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
          {services.map((service, i) => {
            const image = imageProps(service.image);
            return (
              <article key={service._id} className="flex flex-col">
                {image && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      placeholder={image.blurDataURL ? "blur" : undefined}
                      blurDataURL={image.blurDataURL}
                      className="object-cover"
                      style={{ objectPosition: image.objectPosition }}
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </div>
                )}
                <p className="text-auxiliary mt-6 text-xs tracking-[0.06em]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-title text-primary mt-1 text-2xl">
                  {service.title}
                </h3>
                {service.shortDescription && (
                  <p className="text-primary mt-sm text-sm leading-relaxed">
                    {service.shortDescription}
                  </p>
                )}
                {(service.includes ?? []).length > 0 && (
                  <ul className="border-primary/15 mt-6 space-y-2 border-t pt-4 text-sm">
                    {(service.includes ?? []).map((linea) => (
                      <li key={linea} className="text-primary flex gap-3">
                        <span aria-hidden className="text-auxiliary">
                          —
                        </span>
                        <span>{linea}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {service.note && (
                  <p className="text-primary mt-6 text-sm font-medium">
                    {service.note}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
