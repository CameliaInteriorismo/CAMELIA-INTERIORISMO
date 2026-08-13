import { defineField, defineType } from "sanity";

/** Una reseña de cliente, de las que rotan en la Home. */
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonio",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Reseña",
      type: "text",
      rows: 8,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Quién la firma",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "source",
      title: "De dónde viene",
      type: "string",
      description: 'Se muestra bajo el nombre. Por ejemplo "Google Reviews".',
    }),
    defineField({
      name: "rating",
      title: "Estrellas",
      type: "number",
      description: "De 1 a 5. Si lo dejas vacío se muestran 5.",
      validation: (rule) => rule.min(1).max(5).integer(),
      initialValue: 5,
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      description: "Menor número, antes. Ve de 10 en 10.",
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
    select: { title: "author", subtitle: "quote" },
  },
});

/**
 * Un logo del carrusel de marcas de la Home.
 *
 * `widthClass` no es diseño colándose en el CMS: los logos vienen con
 * proporciones muy distintas y algunos necesitan más ancho para no quedar
 * diminutos. Es una excepción consciente y está limitada a tres opciones.
 */
export const partner = defineType({
  name: "partner",
  title: "Marca colaboradora",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logotipo",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "size",
      title: "Tamaño en el carrusel",
      type: "string",
      description:
        "Solo si el logo queda visualmente desequilibrado con el resto. Normal sirve para casi todos.",
      options: {
        list: [
          { title: "Normal", value: "normal" },
          { title: "Ancho", value: "wide" },
          { title: "Extra ancho", value: "extraWide" },
        ],
        layout: "radio",
      },
      initialValue: "normal",
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      description: "Menor número, antes. Ve de 10 en 10.",
    }),
  ],
  orderings: [
    {
      title: "Orden de la web",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: { select: { title: "name", media: "logo" } },
});
