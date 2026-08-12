/**
 * Contact details, shared by the Contacto page, the footer and the menu.
 *
 * La dirección está unificada en toda la web por indicación del estudio, y
 * en valenciano: "Av. de la Hispanitat, 4 — 46600, Alzira, Valencia". Es la
 * forma que se escribe en cada referencia a la ubicación, en los textos
 * legales y en la consulta de Google Maps. Las variantes anteriores (la
 * castellanizada, la que llevaba planta, y "Alzira, Valencia (España)") ya
 * no aparecen en ningún sitio.
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
export const CONTACT = {
  email: "info@cameliainteriorismo.com",
  phone: "+34 601 53 13 01",
  phoneHref: "tel:+34601531301",
  /** The one address. Used wherever the studio's location is written out. */
  addressLines: ["Av. de la Hispanitat, 4", "46600, Alzira, Valencia"],
  mapCardLines: ["Av. de la Hispanitat, 4", "46600, Alzira, Valencia"],
} as const;

/** Single line, for places that can't stack two (the footer's list). */
export const ADDRESS_ONE_LINE = CONTACT.addressLines.join(", ");

/**
 * Every "cómo llegar" / "ver ubicación" control points here. Built from the
 * address string itself so the two can't drift apart.
 */
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(ADDRESS_ONE_LINE);

/**
 * Perfiles oficiales. LinkedIn se queda de momento sin URL, por decisión del
 * estudio: su icono se dibuja como ilustración y no como enlace, en vez de
 * apuntar a "#" y parecer pulsable sin llevar a ninguna parte. Cuando llegue
 * la URL basta con escribirla aquí — el footer, el menú y ContactCards ya
 * cambian solos de <span> a <a>.
 */
export const SOCIAL_URLS = {
  Instagram: "https://instagram.com/camelia.interiorismo",
  TikTok: "https://tiktok.com/@camelia.interiorismo",
  LinkedIn: undefined,
} as const;

export type SocialLabel = keyof typeof SOCIAL_URLS;

export const SOCIALS: { label: SocialLabel; src: string }[] = [
  { label: "Instagram", src: "/assets/icons/ins.png" },
  { label: "TikTok", src: "/assets/icons/tiktok.png" },
  { label: "LinkedIn", src: "/assets/icons/linkedin.png" },
];

/** Same three, with the menu overlay's cream-on-vino icon set. */
export const SOCIALS_MENU: { label: SocialLabel; src: string }[] = [
  { label: "Instagram", src: "/assets/icons/menu/instagram.png" },
  { label: "TikTok", src: "/assets/icons/menu/tiktok.png" },
  { label: "LinkedIn", src: "/assets/icons/menu/linkedin.png" },
];
