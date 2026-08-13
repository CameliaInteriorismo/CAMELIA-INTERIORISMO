import type { Metadata } from "next";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";

export type SeoFields =
  | {
      title?: string;
      description?: string;
      ogTitle?: string;
      ogDescription?: string;
      ogImage?: SanityImageSource;
    }
  | null
  | undefined;

/**
 * Combina el SEO del panel con el que la web ya generaba.
 *
 * El orden es siempre Sanity primero, código después. Es lo que permite
 * conectar el CMS sin tocar el posicionamiento actual: mientras nadie rellene
 * estos campos, cada página conserva exactamente el title y la description
 * que tenía escritos, y solo se sustituye lo que se edite.
 */
export function metadataFrom(
  seo: SeoFields,
  fallback: { title: string; description: string; image?: string },
): Metadata {
  const title = seo?.title || fallback.title;
  const description = seo?.description || fallback.description;
  const ogImage = imageProps(seo?.ogImage)?.src ?? fallback.image;

  return {
    title,
    description,
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}
