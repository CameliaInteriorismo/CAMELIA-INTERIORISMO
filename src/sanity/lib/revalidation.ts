import type { SanityTag } from "@/sanity/lib/fetch";

/**
 * Qué hay que refrescar cuando se publica un documento de cada tipo.
 *
 * Se revalida por DOS vías, y hacen falta las dos:
 *
 * - Por etiqueta (`tags`), que es lo que invalida las respuestas de Sanity
 *   cacheadas por `sanityFetch`.
 * - Por ruta (`paths`), que es lo que invalida la página ya renderizada.
 *   Sin esto no se vería el cambio: el cliente de Sanity no hace las
 *   peticiones con el `fetch` instrumentado de Next —usa su propia capa
 *   HTTP—, así que las etiquetas no llegan a la entrada de caché de la ruta
 *   y `revalidateTag` por sí solo no la toca.
 *
 * En las rutas dinámicas se pasa el patrón con el corchete: revalida todas
 * las fichas de esa ruta de una vez, que es lo que se quiere cuando cambia
 * un servicio referenciado desde varias.
 */
type Revalidation = {
  tags: SanityTag[];
  paths: { path: string; type: "page" | "layout" }[];
};

const page = (path: string) => ({ path, type: "page" as const });

const MAP: Record<string, Revalidation> = {
  project: {
    tags: ["project"],
    paths: [page("/proyectos"), page("/proyectos/[slug]"), page("/")],
  },
  product: {
    tags: ["product"],
    paths: [page("/tienda"), page("/tienda/[slug]"), page("/carrito")],
  },
  post: {
    tags: ["post"],
    paths: [page("/blog"), page("/blog/[slug]")],
  },
  // Un servicio se lee desde la Home, desde /servicios y desde cada ficha de
  // proyecto, así que los tres tienen que refrescarse.
  service: {
    tags: ["service", "project", "homePage", "serviciosPage"],
    paths: [page("/"), page("/servicios"), page("/proyectos/[slug]")],
  },
  testimonial: { tags: ["testimonial", "homePage"], paths: [page("/")] },
  partner: { tags: ["partner", "homePage"], paths: [page("/")] },
  productCategory: {
    tags: ["product", "tiendaPage"],
    paths: [page("/tienda"), page("/tienda/[slug]")],
  },

  homePage: { tags: ["homePage"], paths: [page("/")] },
  estudioPage: { tags: ["estudioPage"], paths: [page("/estudio")] },
  metodologiaPage: {
    tags: ["metodologiaPage"],
    paths: [page("/metodologia")],
  },
  serviciosPage: { tags: ["serviciosPage"], paths: [page("/servicios")] },
  proyectosPage: { tags: ["proyectosPage"], paths: [page("/proyectos")] },
  tiendaPage: { tags: ["tiendaPage"], paths: [page("/tienda")] },
  blogPage: { tags: ["blogPage"], paths: [page("/blog")] },
  contactPage: { tags: ["contactPage"], paths: [page("/contacto")] },
  projectFormPage: {
    tags: ["projectFormPage"],
    paths: [page("/cuentanos-tu-proyecto")],
  },

  cartPage: { tags: ["cartPage"], paths: [page("/carrito")] },

  confirmationPages: {
    tags: ["confirmationPages"],
    paths: [
      page("/carrito/confirmacion"),
      page("/carrito/gracias"),
      page("/cuentanos-tu-proyecto/gracias"),
    ],
  },

  legalDocument: {
    tags: ["legalDocument"],
    paths: [
      page("/aviso-legal"),
      page("/politica-de-privacidad"),
      page("/politica-de-cookies"),
      page("/accesibilidad"),
    ],
  },
};

/**
 * Los ajustes del sitio alimentan la barra, el pie y los datos de contacto,
 * presentes en todas las páginas. Es el único caso que refresca la web
 * entera, y es correcto: revalidar la raíz como "layout" arrastra todo lo
 * que cuelga de ella.
 */
const SITE_SETTINGS: Revalidation = {
  tags: [
    "project",
    "product",
    "post",
    "service",
    "testimonial",
    "partner",
    "siteSettings",
    "legalDocument",
    "homePage",
    "estudioPage",
    "metodologiaPage",
    "serviciosPage",
    "proyectosPage",
    "tiendaPage",
    "blogPage",
    "contactPage",
    "projectFormPage",
    "cartPage",
    "confirmationPages",
  ],
  paths: [{ path: "/", type: "layout" }],
};

export function revalidationFor(documentType: string): Revalidation | null {
  if (documentType === "siteSettings") return SITE_SETTINGS;
  return MAP[documentType] ?? null;
}
