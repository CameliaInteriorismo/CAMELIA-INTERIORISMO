import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { urlFor } from "@/sanity/lib/image";
import type { CtaBannerData } from "@/features/shared/types";

export function CtaBanner({ cta }: { cta?: CtaBannerData }) {
  // El patrón llega desde Sanity, igual que en home/CtaBanner y
  // servicios/CtaBanner. Antes se dibujaba aquí con un degradado CSS repetido
  // medido a mano, así que cambiarlo obligaba a tocar código; ahora se elige en
  // el panel. Sin imagen no se inventa ningún patrón: queda el fondo base.
  const background = cta?.image ? urlFor(cta.image).width(1920).url() : null;

  return (
    <section
      className="bg-auxiliary mb-[120px] py-20"
      style={{
        backgroundImage: background ? `url('${background}')` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container>
        <div className="bg-background flex flex-col items-center gap-8 px-10 py-16 text-center">
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
