import type { Metadata } from "next";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SEO_DEFAULTS_QUERY } from "@/sanity/lib/queries";

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
export async function metadataFrom(
  seo: SeoFields,
  fallback: { title: string; description: string; image?: string },
  /**
   * Ruta canónica de la página, empezando por "/". Al pasarla, la página
   * declara su canonical absoluta y su `og:url`. Se omite en las páginas
   * `noindex`, que no deben anunciar canonical.
   */
  path?: string,
): Promise<Metadata> {
  const title = seo?.title || fallback.title;
  const description = seo?.description || fallback.description;
  const url = path ? absoluteUrl(path) : undefined;
  const ogTitle = seo?.ogTitle || title;
  const ogDescription = seo?.ogDescription || description;
  // "Nombre del sitio" en Sanity se leía para los correos pero no para
  // esto: el `og:site_name` que sale en las vistas previas de redes
  // sociales usaba siempre el valor fijo del código, así que cambiarlo en
  // el panel no tenía ningún efecto ahí.
  const settings = await sanityFetch<{
    siteName?: string;
    defaultOgImage?: SanityImageSource;
  } | null>({
    query: SITE_SEO_DEFAULTS_QUERY,
    tags: ["siteSettings"],
  });
  const siteName = settings?.siteName || SITE_NAME;
  // Imagen para compartir, por este orden: la propia de la página en Sanity,
  // la que el código tenga para esa página (p. ej. la portada de un proyecto)
  // y, si no hay ninguna, la imagen por defecto de "SEO por defecto". Sin ese
  // último escalón, la mayoría de páginas se compartían sin foto.
  const ogImage =
    imageProps(seo?.ogImage)?.src ??
    fallback.image ??
    imageProps(settings?.defaultOgImage)?.src;
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
      siteName,
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
