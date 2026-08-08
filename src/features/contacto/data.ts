/**
 * Contact details, shared by the Contacto page, the footer and the menu.
 *
 * The address is now unified across the whole site at the studio's request:
 * every location reference and every Maps link resolves to Avenida de la
 * Hispanidad, 4 — 46600, Alzira, Valencia. The earlier variants ("Av.
 * Hispanitat, 4, entresuelo 1", "Alzira, Valencia (España)") are gone.
 *
 * NOTE: the email and phone are still not reconciled between designs.
 * CONTACTO.png gives camelia@interiorismo.com / +34 601 53 13 01, while
 * FOOTER.png and the legal texts give info@cameliainteriorismo.com and a
 * phone ending 12 01. Left as-is because only the address was in scope —
 * still flagged for the client.
 */
export const CONTACT = {
  email: "camelia@interiorismo.com",
  phone: "+34 601 53 13 01",
  phoneHref: "tel:+34601531301",
  /** The one address. Used wherever the studio's location is written out. */
  addressLines: ["Avenida de la Hispanidad, 4", "46600, Alzira, Valencia"],
  mapCardLines: ["Avenida de la Hispanidad, 4", "46600, Alzira, Valencia"],
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
 * Official profiles. LinkedIn has no URL yet — until the studio supplies
 * one its icon renders as plain artwork rather than a link that goes
 * nowhere, which is why `href` is optional.
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
