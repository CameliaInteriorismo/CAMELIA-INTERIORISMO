import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Imagen de Sanity → URL. `auto("format")` deja que Sanity sirva webp o avif
 * según el navegador, igual que hacía `next/image` con los ficheros locales.
 */
export function urlFor(source: Image) {
  return builder.image(source).auto("format").fit("max");
}

/**
 * Lo que necesita `next/image` de una imagen de Sanity, en una sola llamada.
 *
 * `width`/`height` salen de los metadatos que Sanity guarda al subir el
 * fichero, no de una suposición: sin ellos `next/image` no puede reservar el
 * hueco y la página da saltos al cargar.
 *
 * `blurDataURL` es el LQIP que Sanity genera solo — un placeholder difuminado
 * gratis, sin trabajo extra por nuestra parte.
 */
export type SanityImageSource = Image & {
  alt?: string;
  /** El recorte y el punto de interés que se fijan en el Studio. */
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; height: number; width: number };
  asset?: {
    _ref?: string;
    _id?: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width: number; height: number };
    };
  };
};

/**
 * El punto de interés del Studio, como `object-position` de CSS.
 *
 * Los recuadros del diseño tienen una proporción fija y las fotos se pintan
 * con `object-cover`, que por defecto recorta por el centro. Eso es lo que
 * hacía inútil mover el punto de interés en el panel: la foto llegaba
 * entera y el navegador siempre se quedaba con el centro.
 *
 * Se traduce a porcentajes en vez de pedirle a Sanity una imagen ya recortada
 * porque así el recuadro, su proporción y el `object-cover` del diseño se
 * quedan exactamente como están: lo único que cambia es QUÉ parte de la foto
 * queda a la vista. Sin punto de interés definido se devuelve `undefined` y
 * el navegador sigue centrando, que es el comportamiento de siempre.
 */
function objectPositionFrom(source: SanityImageSource): string | undefined {
  const { x, y } = source.hotspot ?? {};
  if (typeof x !== "number" || typeof y !== "number") return undefined;
  return `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`;
}

export function imageProps(source: SanityImageSource | undefined | null) {
  if (!source?.asset) return null;
  const dimensions = source.asset.metadata?.dimensions;
  return {
    src: urlFor(source).url(),
    width: dimensions?.width ?? 1600,
    height: dimensions?.height ?? 1200,
    blurDataURL: source.asset.metadata?.lqip,
    // Un guion es la convención del panel para "decorativa" (ver el campo
    // `alt` de imageWithAlt). Se traduce aquí, en el único sitio por el que
    // pasan todas las imágenes de Sanity, porque en el HTML tiene que llegar
    // como cadena vacía: un lector de pantalla anuncia `alt="-"` como
    // contenido, que es justo lo contrario de lo que se quiso marcar.
    alt: source.alt?.trim() === "-" ? "" : (source.alt ?? ""),
    objectPosition: objectPositionFrom(source),
  };
}
