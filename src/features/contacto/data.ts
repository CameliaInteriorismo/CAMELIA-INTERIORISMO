/**
 * Contact details as written on Diseño/CONTACTO.png.
 *
 * NOTE: these differ from the values in FOOTER.png (which the Footer
 * renders): the email there is info@cameliainteriorismo.com and the phone
 * ends 12 01, and the checkout screen spells the street "Avenida de la
 * Hispanidad, 4". The designs genuinely disagree, so this page follows its
 * own reference rather than silently picking a winner — flagged for the
 * client to reconcile.
 */
export const CONTACT = {
  email: "camelia@interiorismo.com",
  phone: "+34 601 53 13 01",
  phoneHref: "tel:+34601531301",
  addressLines: ["Av. Hispanitat, 4, entresuelo 1", "46600 Alzira (Valencia)"],
  // As written on the map card in the same reference.
  mapCardLines: ["Avenida de la Hispanidad, 4", "46600, Alzira, Valencia"],
} as const;

export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Avenida de la Hispanidad 4, 46600 Alzira, Valencia");

export const SOCIALS = [
  { label: "Instagram", src: "/assets/icons/ins.png" },
  { label: "TikTok", src: "/assets/icons/tiktok.png" },
  { label: "LinkedIn", src: "/assets/icons/linkedin.png" },
] as const;
