import type { Metadata } from "next";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

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
  /**
   * Ruta canónica de la página, empezando por "/". Al pasarla, la página
   * declara su canonical absoluta y su `og:url`. Se omite en las páginas
   * `noindex`, que no deben anunciar canonical.
   */
  path?: string,
): Metadata {
  const title = seo?.title || fallback.title;
  const description = seo?.description || fallback.description;
  const ogImage = imageProps(seo?.ogImage)?.src ?? fallback.image;
  const url = path ? absoluteUrl(path) : undefined;
  const ogTitle = seo?.ogTitle || title;
  const ogDescription = seo?.ogDescription || description;
  const images = ogImage ? [{ url: ogImage }] : undefined;

  return {
    title,
    description,
    // Solo cuando la página declara su ruta: una canonical vacía o adivinada
    // sería peor que ninguna.
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      type: "website",
      locale: "es_ES",
      siteName: SITE_NAME,
      url,
      title: ogTitle,
      description: ogDescription,
      images,
    },
    // Mismos datos que Open Graph: no hay `site` ni `creator` porque el
    // proyecto no guarda ningún usuario de X.
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images,
    },
  };
}
