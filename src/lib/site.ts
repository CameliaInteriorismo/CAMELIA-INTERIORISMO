/**
 * El dominio definitivo de producción, en un solo sitio.
 *
 * Hoy la web se sirve desde Vercel y `cameliainteriorismo.com` todavía no
 * apunta aquí, pero el canónico que anunciamos a los buscadores tiene que ser
 * el definitivo desde el primer día: si publicáramos el de Vercel, Google
 * indexaría esa URL y luego habría que redirigir todo.
 *
 * De aquí salen `metadataBase`, las canonicals, el sitemap, el robots y las
 * URLs absolutas de Open Graph y JSON-LD. Cambiar el dominio es cambiar esta
 * línea.
 */
export const SITE_URL = "https://cameliainteriorismo.com";

/** El nombre de la marca tal y como se anuncia en Open Graph y JSON-LD. */
export const SITE_NAME = "Camelia";

/** Une el dominio con una ruta, sin barras duplicadas ni barra final suelta. */
export function absoluteUrl(path = "/") {
  const limpio = path.startsWith("/") ? path : `/${path}`;
  return limpio === "/" ? `${SITE_URL}/` : `${SITE_URL}${limpio}`;
}
