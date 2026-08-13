import { defineField, defineType } from "sanity";

/**
 * Un servicio del estudio.
 *
 * Unifica los tres sitios donde el mismo servicio se escribía por separado:
 * las pestañas de la Home, el acordeón de /servicios y la lista cerrada de
 * servicios que llevaba cada ficha de proyecto. Ahora se escribe una vez y
 * los tres sitios lo leen de aquí.
 *
 * Consecuencia práctica: si creas un servicio nuevo aparece en la Home y en
 * /servicios, y queda disponible para marcarlo en cualquier proyecto.
 */
export const service = defineType({
  name: "service",
  title: "Servicio",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nombre",
      type: "string",
      description:
        'El que se ve en la Home, en /servicios y en las fichas de proyecto. Por ejemplo "Interiorismo".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Identificador",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Descripción corta",
      type: "text",
      rows: 4,
      description: "La que acompaña a la pestaña en la Home.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "longDescription",
      title: "Descripción larga",
      type: "paragraphs",
      description:
        "La que se despliega en el acordeón de /servicios. Si la dejas vacía se usa la corta.",
    }),
    defineField({
      name: "image",
      title: "Imagen",
      type: "imageWithAlt",
      description: "Acompaña a la pestaña en la Home y al panel de /servicios.",
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      description:
        "Manda en la Home y en /servicios. Menor número, antes. Ve de 10 en 10.",
    }),
  ],
  orderings: [
    {
      title: "Orden de la web",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "shortDescription", media: "image" },
  },
});
