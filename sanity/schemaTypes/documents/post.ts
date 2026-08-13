import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Un artículo del blog.
 *
 * El cuerpo va en Portable Text con un bloque propio para las parejas de
 * imágenes, que es el ritmo que ya tienen los dos artículos existentes
 * (texto, pareja de fotos, texto).
 */
export const post = defineType({
  name: "post",
  title: "Artículo",
  type: "document",
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "media", title: "Imágenes" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleLines",
      title: "Cómo parte el título",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      description:
        "Opcional. El listado y la ficha parten el titular por el mismo sitio en vez de dejarlo al ancho de la pantalla. Escribe cada línea por separado. Si lo dejas vacío, el título se parte solo.",
    }),
    defineField({
      name: "subtitle",
      title: "Subtítulo",
      type: "string",
      group: "content",
      description: "La frase que va bajo la imagen principal.",
    }),
    defineField({
      name: "publishedAt",
      title: "Fecha de publicación",
      type: "datetime",
      group: "content",
      description: "Ordena el listado: lo más reciente primero.",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "string",
      group: "content",
      description: "Opcional. Si lo dejas vacío, no se muestra firma.",
    }),
    defineField({
      name: "categories",
      title: "Etiquetas",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "body",
      title: "Cuerpo del artículo",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Párrafo", value: "normal" }],
          lists: [{ title: "Lista", value: "bullet" }],
          marks: {
            decorators: [
              { title: "Negrita", value: "strong" },
              { title: "Cursiva", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Enlace",
                fields: [
                  {
                    name: "href",
                    type: "string",
                    title: "Destino",
                    validation: (rule) => rule.required(),
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({ type: "galleryPair" }),
        defineArrayMember({ type: "gallerySingle" }),
      ],
    }),

    defineField({
      name: "image",
      title: "Imagen del listado",
      type: "imageWithAlt",
      group: "media",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "leadImage",
      title: "Imagen principal del artículo",
      type: "imageWithAlt",
      group: "media",
      description:
        "La grande que abre la ficha. Puede ser distinta a la del listado.",
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Más recientes primero",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "image" },
  },
});
