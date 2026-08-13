import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Una pieza del Shop.
 *
 * El Shop NO es un ecommerce: no hay pasarela de pago. El carrito recoge una
 * solicitud y el precio es informativo, por eso `price` no es obligatorio —
 * la web ya sabe ocultar el importe cuando no existe (ver ProductHero).
 *
 * Crear uno y publicarlo basta para que aparezca en /tienda, tenga su ficha
 * en /tienda/su-slug y pueda añadirse al carrito.
 */
export const product = defineType({
  name: "product",
  title: "Producto",
  type: "document",
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "media", title: "Imágenes" },
    { name: "detail", title: "Ficha" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      group: "content",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      group: "content",
      to: [{ type: "productCategory" }],
      description:
        "Alimenta el filtro del Shop y la sección de piezas relacionadas. Si creas una categoría nueva, aparece sola en el filtro.",
    }),
    defineField({
      name: "price",
      title: "Precio (€)",
      type: "number",
      group: "content",
      description:
        "Informativo: la web no cobra. Déjalo vacío y la ficha no muestra importe.",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "available",
      title: "Disponible",
      type: "boolean",
      group: "content",
      description:
        "Si lo desmarcas, la pieza sigue viéndose pero no se puede añadir a la solicitud.",
      initialValue: true,
    }),
    defineField({
      name: "description",
      title: "Descripción breve",
      type: "text",
      rows: 3,
      group: "content",
      description: "El texto corto que va bajo el precio en la ficha.",
    }),

    defineField({
      name: "image",
      title: "Imagen principal",
      type: "imageWithAlt",
      group: "media",
      description: "La que se ve en el listado y encabeza la ficha.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Más imágenes",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "imageWithAlt" })],
    }),
    defineField({
      name: "finishes",
      title: "Acabados",
      type: "array",
      group: "media",
      description:
        "Las variantes de color o material. Si un acabado no tiene foto propia, la ficha mantiene la imagen principal.",
      of: [defineArrayMember({ type: "productFinish" })],
    }),

    defineField({
      name: "details",
      title: "Acordeones de la ficha",
      type: "object",
      group: "detail",
      description:
        "Los tres desplegables de la ficha. El que dejes vacío no se muestra.",
      fields: [
        defineField({
          name: "detallesDeLaPieza",
          title: "Detalles de la pieza",
          type: "text",
          rows: 5,
        }),
        defineField({
          name: "materialesYMedidas",
          title: "Materiales y medidas",
          type: "text",
          rows: 5,
        }),
        defineField({
          name: "envioYEntrega",
          title: "Envío y entrega",
          type: "text",
          rows: 5,
        }),
      ],
    }),

    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      group: "content",
      description: "Menor número, antes en el listado. Ve de 10 en 10.",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Orden de la web",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      price: "price",
      media: "image",
      available: "available",
    },
    prepare: ({ title, price, media, available }) => ({
      title,
      subtitle: [
        price != null ? `${price} €` : "sin precio",
        available === false ? "NO DISPONIBLE" : null,
      ]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});

/** Un acabado seleccionable: nombre, muestra de color y foto opcional. */
export const productFinish = defineType({
  name: "productFinish",
  title: "Acabado",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "color",
      title: "Color de la muestra",
      type: "string",
      description:
        "El círculo que se ve en la ficha. En hexadecimal, por ejemplo #3f5232.",
      validation: (rule) =>
        rule
          .required()
          .regex(/^#[0-9a-fA-F]{6}$/, {
            name: "hexadecimal",
            invert: false,
          })
          .error("Escribe un color en formato #rrggbb, por ejemplo #3f5232."),
    }),
    defineField({
      name: "image",
      title: "Foto de este acabado",
      type: "imageWithAlt",
      description:
        "Opcional. Sin ella, al elegir este acabado se mantiene la imagen principal.",
    }),
  ],
  preview: { select: { title: "name", subtitle: "color", media: "image" } },
});

/**
 * Categoría del Shop, como documento y no como lista cerrada en el código:
 * así puedes crear una nueva desde el panel y el filtro la recoge sola.
 */
export const productCategory = defineType({
  name: "productCategory",
  title: "Categoría de producto",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Orden en el filtro",
      type: "number",
    }),
  ],
  preview: { select: { title: "title" } },
});
