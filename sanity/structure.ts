import type { StructureResolver } from "sanity/structure";

/**
 * El menú lateral del panel.
 *
 * Sin esto, Sanity lista los tipos por orden alfabético y los singletons
 * aparecen como carpetas vacías con un botón de "crear nuevo" que crearía una
 * segunda Home. Aquí se agrupan por cómo se piensa la web —Contenido,
 * Páginas, Global— y cada singleton abre directamente su editor.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Camelia")
    .items([
      S.listItem()
        .title("Ajustes del sitio")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),

      S.divider(),

      S.listItem()
        .title("Páginas")
        .child(
          S.list()
            .title("Páginas")
            .items([
              singleton(S, "homePage", "Inicio"),
              singleton(S, "estudioPage", "Estudio"),
              singleton(S, "metodologiaPage", "Metodología"),
              singleton(S, "serviciosPage", "Servicios"),
              singleton(S, "proyectosPage", "Proyectos"),
              singleton(S, "tiendaPage", "Shop"),
              singleton(S, "blogPage", "Blog"),
              singleton(S, "contactPage", "Contacto"),
              singleton(S, "projectFormPage", "Formulario de proyecto"),
            ]),
        ),

      S.divider(),

      S.documentTypeListItem("project").title("Proyectos"),
      S.documentTypeListItem("product").title("Productos"),
      S.documentTypeListItem("post").title("Blog"),
      S.documentTypeListItem("service").title("Servicios"),

      S.divider(),

      S.listItem()
        .title("Listas")
        .child(
          S.list()
            .title("Listas")
            .items([
              S.documentTypeListItem("testimonial").title("Testimonios"),
              S.documentTypeListItem("partner").title("Marcas colaboradoras"),
              S.documentTypeListItem("productCategory").title(
                "Categorías de producto",
              ),
            ]),
        ),

      S.divider(),

      S.documentTypeListItem("legalDocument").title("Textos legales"),
    ]);

/** Un documento único: se abre directo, sin listado ni "crear nuevo". */
function singleton(
  S: Parameters<StructureResolver>[0],
  schemaType: string,
  title: string,
) {
  return S.listItem()
    .title(title)
    .child(S.document().schemaType(schemaType).documentId(schemaType));
}
