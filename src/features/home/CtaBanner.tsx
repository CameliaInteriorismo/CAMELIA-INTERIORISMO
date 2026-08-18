import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { urlFor } from "@/sanity/lib/image";
import type { CtaBannerData } from "@/features/shared/types";

export function CtaBanner({ cta }: { cta?: CtaBannerData }) {
  const background = cta?.image ? urlFor(cta.image).width(1920).url() : null;
  return (
    <section
      // El aire exterior de arriba vive aquí. Abajo lo pone el `pt-section` de
      // la sección siguiente, así que cada lado tiene UNA sola fuente y nada se
      // suma. El `py` es otra cosa: es el padding INTERNO que separa el
      // recuadro crema del borde de la franja de color, y se queda como está.
      className="bg-auxiliary mt-section py-16"
      style={{
        backgroundImage: background ? `url('${background}')` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container>
        <div className="bg-background gap-md mx-auto flex max-w-3xl flex-col items-center px-8 py-14 text-center">
          {/* El banner va en mayúsculas por diseño, y lo decide aquí: es lo
                único de la web que las lleva por CSS. Los héroes y los títulos
                de contenido se leen tal cual se escriben en el panel. */}
          <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
            {cta?.title}
          </h2>
          {cta?.button && (
            <ButtonLink href={cta.button.href}>{cta.button.label}</ButtonLink>
          )}
        </div>
      </Container>
    </section>
  );
}
