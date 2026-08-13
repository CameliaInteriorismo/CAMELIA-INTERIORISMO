import "server-only";
import type { ContactDetails } from "@/features/contacto/types";

type SiteSettingsAddress = {
  email: string;
  phone: string;
  phoneHref: string;
  addressStreet: string;
  addressFloor?: string;
  addressLocality: string;
  openingHours?: string[];
};

/**
 * Compone los datos de contacto que usa la web a partir de las piezas que
 * guarda `siteSettings`.
 *
 * La dirección se guarda separada en calle / planta / localidad porque la web
 * la escribe de tres formas y cada una necesita partes distintas. Aquí se
 * arman las dos que consume el front:
 *
 * - `addressLines`: rotulada, con planta, en líneas.
 * - `mapsUrl`: SIN planta. Google necesita calle, número, código postal y
 *   municipio; el entresuelo solo añade ruido a la búsqueda.
 */
export function toContactDetails(s: SiteSettingsAddress): ContactDetails {
  const addressLines = [
    s.addressStreet,
    s.addressFloor,
    s.addressLocality,
  ].filter((line): line is string => Boolean(line));

  const mapsQuery = [s.addressStreet, s.addressLocality]
    .filter(Boolean)
    .join(", ");

  return {
    email: s.email,
    phone: s.phone,
    phoneHref: s.phoneHref,
    addressLines,
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(mapsQuery),
    openingHours: s.openingHours,
  };
}
