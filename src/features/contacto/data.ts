/**
 * Contact details, shared by the Contacto page, the footer and the menu.
 *
 * La dirección, confirmada por el estudio, se escribe en tres formas y cada
 * una tiene su motivo:
 *
 * - Rotulada (footer, Contacto, tarjeta del mapa, recogida en estudio): tres
 *   líneas apiladas, calle / planta / localidad. Es `addressLines`.
 * - Legal (Aviso Legal, Política de Privacidad): la misma dirección en una
 *   línea, con planta y la provincia entre paréntesis. Va escrita en cada
 *   documento porque el texto legal se transcribe entero, no se compone.
 * - Google Maps: `ADDRESS_ONE_LINE`, deliberadamente **sin la planta**. Un
 *   entresuelo no ayuda a geolocalizar el portal y puede estropear la
 *   búsqueda; Maps necesita calle, número, código postal y municipio.
 *
 * The email is likewise unified: info@cameliainteriorismo.com everywhere,
 * which is the address the footer and all four legal documents already
 * used. The variant CONTACTO.png showed is gone — it sat on a different
 * domain altogether.
 *
 * El teléfono ya está reconciliado en 601 53 13 01. FOOTER.png mostraba una
 * variante acabada en 12 01 que queda descartada; el footer lee `phone` de
 * aquí en lugar de repetirlo escrito a mano, y los textos legales escriben el
 * mismo número agrupado como "601 531 301".
 */
/** Las tres piezas de la dirección, para no repetir ninguna literal. */
const STREET = "Av. Hispanitat, 4";
const FLOOR = "Entresuelo 1";
const LOCALITY = "46600, Alzira, Valencia";

export const CONTACT = {
  email: "info@cameliainteriorismo.com",
  phone: "+34 601 53 13 01",
  phoneHref: "tel:+34601531301",
  /**
   * La dirección rotulada, en tres líneas. Quien la pinte debe recorrer el
   * array entero: cualquier sitio que dé por hecho un número fijo de líneas
   * se dejará una fuera.
   */
  addressLines: [STREET, FLOOR, LOCALITY],
  mapCardLines: [STREET, FLOOR, LOCALITY],
} as const;

/**
 * La dirección en una línea **sin la planta**, que es la que se usa para
 * localizar el estudio: a Google Maps le sirve el portal, y un "Entresuelo 1"
 * en la consulta solo añade ruido a la búsqueda.
 */
export const ADDRESS_ONE_LINE = `${STREET}, ${LOCALITY}`;

/**
 * Every "cómo llegar" / "ver ubicación" control points here. Built from the
 * address string itself so the two can't drift apart.
 */
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(ADDRESS_ONE_LINE);

/**
 * Perfiles oficiales del estudio. Se retiró LinkedIn: no había perfil, así que
 * el icono salía apagado y sin enlazar a
 * estudio: su icono se dibuja como ilustración y no como enlace, en vez de
 * apuntar a "#" y parecer pulsable sin llevar a ninguna parte. Cuando llegue
 * la URL basta con escribirla aquí — el footer, el menú y ContactCards ya
 * cambian solos de <span> a <a>.
 */
export const SOCIAL_URLS = {
  Instagram: "https://instagram.com/camelia.interiorismo",
  TikTok: "https://tiktok.com/@camelia.interiorismo",
} as const;

export type SocialLabel = keyof typeof SOCIAL_URLS;

export const SOCIALS: { label: SocialLabel; src: string }[] = [
  { label: "Instagram", src: "/assets/icons/ins.png" },
  { label: "TikTok", src: "/assets/icons/tiktok.png" },
];

/** Same three, with the menu overlay's cream-on-vino icon set. */
export const SOCIALS_MENU: { label: SocialLabel; src: string }[] = [
  { label: "Instagram", src: "/assets/icons/menu/instagram.png" },
  { label: "TikTok", src: "/assets/icons/menu/tiktok.png" },
];
