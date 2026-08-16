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

/** Las páginas donde la barra va en el flujo y se va con el scroll. */
export const isNavInFlow = (pathname: string) =>
  !isNavFloating(pathname) &&
  (pathname === "/" ||
    pathname === "/metodologia" ||
    pathname === "/servicios" ||
    pathname === "/proyectos" ||
    pathname === "/tienda" ||
    // Solo el listado tiene portada; una entrada abre directa en su título.
    pathname === "/blog" ||
    // Estudio y Contacto se comportan como las demás: Estudio deja de llevar
    // barra clavada con auto-ocultado, y Contacto deja de llevarla pegada.
    pathname === "/estudio" ||
    pathname === "/contacto");
