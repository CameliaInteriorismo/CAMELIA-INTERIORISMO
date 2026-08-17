import { PageHeroBanner } from "@/components/layout/PageHeroBanner";
import { imageProps } from "@/sanity/lib/image";
import type { SanityImageSource } from "@/sanity/lib/image";

/**
 * La cabecera del Shop. El título, la foto y su encuadre salen de Sanity:
 * los campos ya existían en el panel, pero este componente los tenía
 * escritos a mano y no los leía, así que editarlos allí no cambiaba nada.
 * Los valores de reserva son los que tenía escritos, para que la página no
 * se quede sin cabecera si alguien los vacía.
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
      title={title ?? "Shop"}
      image={imageProps(image)?.src ?? "/assets/tienda/Shop hero.jpg"}
      titleClassName="text-background tracking-[0.02em]"
      imagePosition={imagePosition ?? "center 55%"}
    />
  );
}
