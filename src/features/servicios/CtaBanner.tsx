import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { urlFor } from "@/sanity/lib/image";
import type { CtaBannerData } from "@/features/shared/types";

/**
 * Banner de Servicios. El texto, el botón y la imagen de fondo vienen de
 * Sanity; el marcado y las clases son los de siempre.
 *
 * La imagen va como `background-image` y no con `next/image` — igual que
 * antes, porque la maquetación depende de `background-size: cover` sobre la
 * sección entera, no de un elemento posicionado.
 */
export function CtaBanner({ cta }: { cta?: CtaBannerData }) {
  const background = cta?.image ? urlFor(cta.image).width(1920).url() : null;

  return (
    <section
      className="bg-auxiliary py-16"
      style={{
        backgroundImage: background ? `url('${background}')` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container>
        <div className="bg-background flex flex-col items-start gap-8 px-10 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
              {cta?.title}
            </h2>
            {cta?.text && (
              <p className="text-primary/75 mt-sm max-w-xl text-sm leading-relaxed">
                {cta.text}
              </p>
            )}
          </div>
          {cta?.button && (
            <ButtonLink href={cta.button.href} className="shrink-0">
              {cta.button.label}
            </ButtonLink>
          )}
        </div>
      </Container>
    </section>
  );
}
