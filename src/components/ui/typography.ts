/**
 * The one H1 scale every page title on the site renders at — the hero
 * banners (Servicios, Proyectos, Metodología, Shop…).
 *
 * Kept as a shared constant rather than repeated per component so the
 * scale physically cannot drift between pages: change it here and every
 * page title moves together.
 *
 * Solo escala: la capitalización la decide el texto que se escriba en Sanity,
 * no el CSS. Forzar mayúsculas aquí hacía imposible fijarla desde el panel.
 */
export const PAGE_TITLE_SCALE = "text-3xl sm:text-4xl md:text-6xl lg:text-7xl";

/**
 * In-page section headings that carry a page title's weight without being
 * the page title ("Ven a conocernos al estudio" over the Contacto map).
 *
 * 45px rather than a round token: measured off Diseño/CONTACTO.png, where
 * "VEN A CONOCERNOS" sets 462px wide inside the 1118px container. At the
 * hero's 72px the same line runs 727px and breaks onto a third line.
 */
export const SECTION_TITLE_SCALE =
  "text-3xl sm:text-4xl md:text-[40px] lg:text-[45px]";

/**
 * The H1 on the legal pages (Aviso Legal, Política de Privacidad, Cookies,
 * Accesibilidad Web).
 *
 * The smallest title on the site by some way, because these pages have no
 * hero to fill and their whole composition sits inside the 576px reading
 * measure: at the 72px page scale, "POLÍTICA DE PRIVACIDAD" runs 863px and
 * breaks in two. 40px puts it at 479px — comfortably on one line, with room
 * for a longer title later — and still reads as the page's title against
 * the 24px clause headings and 14px body below it.
 */
export const LEGAL_TITLE_SCALE = "text-2xl sm:text-3xl md:text-[40px]";
