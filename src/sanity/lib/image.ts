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
  asset?: {
    _ref?: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width: number; height: number };
    };
  };
};

export function imageProps(source: SanityImageSource | undefined | null) {
  if (!source?.asset) return null;
  const dimensions = source.asset.metadata?.dimensions;
  return {
    src: urlFor(source).url(),
    width: dimensions?.width ?? 1600,
    height: dimensions?.height ?? 1200,
    blurDataURL: source.asset.metadata?.lqip,
    alt: source.alt ?? "",
  };
}
