import { PageHeroBanner } from "@/components/layout/PageHeroBanner";
import { imageProps } from "@/sanity/lib/image";
import type { SanityImageSource } from "@/sanity/lib/image";

/**
 * La cabecera de Metodología. El título, la foto y su encuadre salen de
 * Sanity, igual que en el Shop: los campos ya existían y la consulta ya los
 * traía, pero este componente no recibía ninguno, así que la foto subida al
 * panel no llegaba a pintarse nunca.
 *
 * El título va en el vino de la marca y no en crema como el resto de
 * cabeceras: es la excepción que pide el diseño para esta página.
 */
export function PageHeader({
  title,
  image,
  imagePosition,
}: {
  title?: string;
  image?: SanityImageSource;
  imagePosition?: string;
}) {
  return (
    <PageHeroBanner
      title={title ?? "Metodología"}
      titleClassName="tracking-[0.02em]"
      image={imageProps(image)?.src}
      imagePosition={imagePosition}
    />
  );
}
