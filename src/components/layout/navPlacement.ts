/**
 * Dónde va la barra de navegación en cada página.
 *
 * En las páginas con portada la barra va en el FLUJO del documento: ocupa sus
 * 80px arriba del todo y se va con el scroll, como una sección más. La portada
 * empieza justo debajo y ocupa el resto de la pantalla, así que ninguna parte
 * de la portada queda escondida detrás de la barra.
 *
 * Dos excepciones, a propósito:
 *
 *   · las FICHAS de proyecto, donde la barra flota transparente sobre la
 *     portada porque esa foto está pensada para verse entera de borde a borde;
 *   · Estudio, que no tiene portada y quiere la barra clavada con su
 *     auto-ocultado propio al bajar.
 *
 * Vive aquí y no dentro del Navbar porque la portada necesita saber lo mismo:
 * si la barra ocupa sitio, la portada no debe volver a descontarlo. Con la
 * regla en dos ficheros distintos, cambiar una página en uno y olvidar el otro
 * deja un hueco de 80px o una portada tapada — justo lo que hay que evitar.
 */

/** Alto de la barra, en píxeles. */
export const NAV_H = 80;

/**
 * Ficha de proyecto: la barra flota sobre la portada. Ojo, es la ficha
 * (`/proyectos/lo-que-sea`), NO el listado `/proyectos`, que va como el resto.
 */
export const isNavFloating = (pathname: string) =>
  pathname.startsWith("/proyectos/") && pathname !== "/proyectos";

/**
 * En el resto del sitio la barra ocupa su sitio arriba del documento y desde
 * ahí se queda pegada mientras bajas: acompaña al usuario todo el scroll y, al
 * volver arriba, aterriza exactamente donde estaba al cargar.
 *
 * Es la MISMA regla para todas —Inicio, Metodología, Servicios, Proyectos,
 * Shop, Blog, Estudio y Contacto—, sin casos especiales por página. Estudio ya
 * no tiene barra clavada ni auto-ocultado propio.
 *
 * Se llama "en el flujo" porque es lo que necesita saber la portada: si la
 * barra ocupa sitio, la portada no debe volver a reservárselo con un margen.
 * Solo las fichas de proyecto flotan, y por eso son las únicas que sí lo
 * reservan.
 */
export const isNavInFlow = (pathname: string) => !isNavFloating(pathname);
