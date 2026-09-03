import "server-only";

/**
 * De dónde salen las imágenes de los correos.
 *
 * En un correo no valen rutas relativas: el HTML se abre en Gmail o en Mail,
 * no en el sitio, así que cada imagen necesita una URL absoluta y pública.
 *
 * Va en su propia variable y NO en `SITE_URL` porque hoy no son lo mismo:
 * `SITE_URL` apunta al dominio definitivo —que de momento sirve una página de
 * aparcamiento, no la web— mientras que estas imágenes tienen que salir de
 * donde estén realmente accesibles. Cuando el dominio se conecte, se cambia
 * esta variable y nada más.
 */
const BASE = (process.env.EMAIL_ASSETS_URL ?? "").replace(/\/$/, "");

/** La raíz, tal cual, para las `@font-face` de la plantilla. */
export const BASE_ASSETS = BASE;

function asset(path: string) {
  return BASE ? `${BASE}${path}` : "";
}

/**
 * Los tres recursos gráficos del correo.
 *
 * Si `EMAIL_ASSETS_URL` no está puesta, o si el fichero todavía no se ha
 * subido, cada uno devuelve cadena vacía y la plantilla lo omite: el correo
 * sale sobre el burdeos sólido y con el pie en texto. Se ve más sobrio, pero
 * llega entero. Un correo con imágenes rotas sería peor.
 */
export const EMAIL_ASSETS = {
  /**
   * Patrón de rayas del fondo. Es PATRONES-01 reducido a 800px de ancho:
   * el correo mide 600 y a tamaño natural (1920) la raya salía al doble de
   * escala que en el diseño. Mismo dibujo y mismos colores, solo más chico
   * —y de paso pesa menos, que en un correo cuenta.
   */
  patron: asset("/images/emails/patron-email.png"),
  /**
   * El mismo dibujo para el teléfono, compuesto en espejo.
   *
   * En móvil del patrón solo asoman 16px a cada lado del bloque crema, y el
   * dibujo original tiene un ritmo de ~40px: pareja de rayas, hueco del mismo
   * ancho. Así que esa rendija de 16px cae entera en rayas o entera en hueco
   * según el ancho del teléfono, y salía vino liso a un lado y rayas al otro.
   *
   * Esta variante es el mismo patrón —mismos colores, mismos grosores, misma
   * escala— duplicado en espejo. Al ser simétrico, centrarlo hace que los dos
   * lados sean reflejo exacto uno del otro en cualquier ancho de pantalla, no
   * en unos cuantos que se hayan probado. El eje se eligió para que la rendija
   * caiga sobre rayas y no sobre hueco.
   */
  patronMovil: asset("/images/emails/patron-email-movil.png"),
  /** Bloque del pie apaisado, para el correo a 600px. */
  footer: asset("/images/emails/Desktop%20Sign%20Footer.png"),
  /**
   * El mismo pie en composición vertical, para el teléfono. Encoger el
   * apaisado a 288px dejaría los rótulos por debajo de lo legible; esta
   * versión reparte los mismos elementos en alto.
   */
  footerMovil: asset("/images/emails/Mobile%20Sign%20Footer.png"),
  /** Logotipo suelto, por si el pie se compone con texto en vez de imagen. */
  logo: asset("/images/logos/trimmed/Camelia%20logo%20naranja%20actualizado.png"),
} as const;

/** ¿Hay de dónde servir las imágenes? La plantilla decide con esto. */
export const tieneAssets = Boolean(BASE);
