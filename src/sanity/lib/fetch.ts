import "server-only";
import type { QueryParams } from "next-sanity";
import { client } from "@/sanity/lib/client";

/**
 * Etiquetas de caché. Cada consulta declara de qué tipos de documento
 * depende, y el webhook de Sanity (ver src/app/api/revalidate/route.ts)
 * invalida por esa misma etiqueta cuando publicas un cambio.
 *
 * El resultado práctico: publicas en Sanity y la web se actualiza sola, sin
 * commit ni deploy. Ese es todo el mecanismo.
 */
export type SanityTag =
  | "project"
  | "product"
  | "post"
  | "service"
  | "testimonial"
  | "partner"
  | "siteSettings"
  | "legalDocument"
  | "homePage"
  | "estudioPage"
  | "metodologiaPage"
  | "serviciosPage"
  | "proyectosPage"
  | "tiendaPage"
  | "blogPage"
  | "contactPage"
  | "projectFormPage"
  | "cartPage"
  | "confirmationPages";

/**
 * La caché vive en la RUTA, no aquí.
 *
 * Cada página declara `export const revalidate` y se sirve ya renderizada:
 * el visitante no espera a Sanity. Esta consulta, en cambio, se deja sin
 * cachear a propósito, porque solo se ejecuta cuando la página se regenera —
 * y en ese momento tiene que leer lo último que haya, no una copia vieja.
 *
 * Cachear en las dos capas fue justo el fallo: el webhook marcaba la ruta
 * como caducada, la página se regeneraba, y volvía a componerse con la
 * respuesta antigua que seguía guardada aquí. El cambio no aparecía.
 */
/** Red de seguridad si el webhook nunca llega. */
const ONE_HOUR = 3600;

export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: QueryParams;
  tags: SanityTag[];
}): Promise<T> {
  return client.fetch<T>(query, params, {
    // `tags` se mantiene por si en el futuro la petición pasa por el fetch
    // instrumentado de Next; hoy la invalidación real la hace revalidatePath.
    next: { revalidate: ONE_HOUR, tags },
  });
}
