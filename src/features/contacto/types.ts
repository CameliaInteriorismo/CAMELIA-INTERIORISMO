import type { SanityImageSource } from "@/sanity/lib/image";

/**
 * Los datos de contacto que la web comparte entre Contacto, el pie, el menú
 * y el bloque de recogida del carrito. Vienen de `siteSettings`.
 *
 * `addressLines` y `mapsUrl` se componen en el servidor a partir de las tres
 * piezas de la dirección: la rotulada lleva planta y la de Maps no, porque un
 * entresuelo no ayuda a geolocalizar el portal.
 */
export type ContactDetails = {
  email: string;
  phone: string;
  phoneHref: string;
  addressLines: string[];
  mapsUrl: string;
  openingHours?: string[];
};

export type Social = {
  _key: string;
  label: string;
  url?: string;
  icon?: SanityImageSource;
  iconMenu?: SanityImageSource;
};

export type ContactCardData = {
  _key: string;
  kind: "email" | "phone" | "address" | "social";
  title: string;
  actionLabel?: string;
};
