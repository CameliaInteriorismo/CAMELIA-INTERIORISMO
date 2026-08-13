import type { SanityImageSource } from "@/sanity/lib/image";

/** Un botón: texto y destino. */
export type LinkData = { label: string; href: string };

/**
 * El banner de llamada a la acción que se repite en Home, Servicios y
 * Proyectos con distinto contenido y el mismo marcado.
 */
export type CtaBannerData = {
  title?: string;
  text?: string;
  button?: LinkData;
  image?: SanityImageSource;
};
