import { PageHeroBanner } from "@/components/layout/PageHeroBanner";
import { imageProps } from "@/sanity/lib/image";
import type { SanityImageSource } from "@/sanity/lib/image";

/**
 * La cabecera de Servicios. El título, la foto y su encuadre salen de
 * Sanity, igual que en el Shop y Metodología: los campos ya existían y la
 * consulta ya los traía, pero este componente no recibía ninguno, así que
 * la foto subida al panel no llegaba a pintarse nunca. Los valores de
 * reserva son los que tenía escritos, para que la página no se quede sin
 * cabecera si alguien los vacía.
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
      title={title ?? "Servicios"}
      image={imageProps(image)?.src ?? "/assets/servicios/Servicio hero.jpg"}
      titleClassName="text-background tracking-[0.02em]"
      imagePosition={imagePosition ?? "center 58%"}
    />
  );
}
