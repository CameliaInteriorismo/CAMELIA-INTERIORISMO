import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

/**
 * Solo rutas públicas e indexables. Quedan fuera a propósito el carrito, las
 * dos pantallas de "gracias", la confirmación y el Studio: son las mismas que
 * llevan `noindex` en su metadata, así que el sitemap no puede contradecirlas.
 */
const ESTATICAS = [
  "/",
  "/estudio",
  "/servicios",
  "/proyectos",
  "/tienda",
  "/contacto",
  "/cuentanos-tu-proyecto",
  "/articulos",
  "/aviso-legal",
  "/politica-de-privacidad",
  "/politica-de-cookies",
  "/accesibilidad",
];

/** Los slugs salen de Sanity, así que el sitemap no puede inventar URLs. */
const SLUGS = `{
  "proyectos": *[_type == "project" && defined(slug.current)].slug.current,
  "productos": *[_type == "product" && defined(slug.current)].slug.current,
  "zonas": *[_type == "landingPage" && defined(slug.current)].slug.current,
  "articulos": *[_type == "article" && defined(slug.current)].slug.current
}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { proyectos, productos, zonas, articulos } = await sanityFetch<{
    proyectos: string[];
    productos: string[];
    zonas: string[];
    articulos: string[];
  }>({
    query: SLUGS,
    tags: ["project", "product", "landingPage", "article"],
  });

  const rutas = [
    ...ESTATICAS,
    ...(proyectos ?? []).map((s) => `/proyectos/${s}`),
    ...(productos ?? []).map((s) => `/tienda/${s}`),
    ...(zonas ?? []).map((s) => `/${s}`),
    ...(articulos ?? []).map((s) => `/articulos/${s}`),
  ];

  // Set: si un slug se repitiera en Sanity, la URL saldría una sola vez.
  return [...new Set(rutas)].map((ruta) => ({
    url: absoluteUrl(ruta),
    lastModified: new Date(),
  }));
}
