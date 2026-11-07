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
      name: "sizes",
      title: "Medidas",
      type: "array",
      group: "content",
      description:
        "Solo si la pieza se hace en varias medidas (por ejemplo, un cabecero " +
        "para cada ancho de cama). Cada medida lleva su precio; la primera es " +
        "la que sale elegida. Con medidas, el listado enseña «Desde» y el " +
        "precio de arriba: pon ahí el de la medida más barata.",
      of: [defineArrayMember({ type: "productSize" })],
    }),
    defineField({
      name: "priceWithoutVat",
      title: "Precio sin IVA delante",
      type: "boolean",
      group: "content",
      description:
        "Para los servicios, como los árboles de Navidad: la ficha enseña " +
        "«245 € + IVA» y debajo el total con IVA. Los precios se siguen " +
        "escribiendo con IVA.",
      initialValue: false,
    }),
    defineField({
      name: "badge",
      title: "Etiqueta sobre la foto",
      type: "string",
      group: "content",
      description:
        "Va encima de la foto, en el listado y en la ficha. Por ejemplo: " +
        "«Unidades limitadas · Por tiempo limitado». Vacía, no sale.",
    }),
    defineField({
      name: "notice",
      title: "Aviso",
      type: "string",
      group: "content",
      description:
        "Una línea encima del precio. Por ejemplo: «Reservas hasta el 25 de " +
        "noviembre · Unidades limitadas».",
    }),
    defineField({
      name: "optionsNote",
      title: "Nota de las opciones",
      type: "text",
      rows: 2,
      group: "content",
      description:
        "Va debajo de los desplegables para explicar cómo elegir (por " +
        "ejemplo, cuándo decorar a 1 cara o a 2 caras).",
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

/**
 * Un acabado seleccionable: nombre, muestra de color y sus fotos.
 *
 * Las fotos cuelgan del acabado, no del producto: así cada imagen queda
 * atada al acabado que retrata y no hay forma de perder esa relación, que
 * es justo lo que pasaría con una galería suelta a nivel de producto.
 *
 * La ficha de hoy enseña una sola foto por acabado —la primera—, pero el
 * array admite las que hagan falta. Las demás quedan guardadas y asociadas,
 * listas para cuando la ficha crezca, sin volver a tocar el modelo.
 */
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
      name: "images",
      title: "Fotos de este acabado",
      type: "array",
      description:
        "Fotos de este acabado en concreto. La primera es la que se ve en la " +
        "ficha al elegirlo; arrástralas para cambiar cuál va primera. Las " +
        "demás quedan guardadas para más adelante. Sin ninguna foto, al " +
        "elegir el acabado se mantiene la imagen principal del producto.",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      options: { layout: "grid" },
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "color", media: "images.0" },
  },
});

/**
 * Una medida de la pieza con su precio, para lo que se fabrica en varios
 * tamaños. El nombre es lo que lee el cliente («Cama de 150 · 170 × 120 cm»)
 * y lo que llega en el correo de la solicitud.
 */
export const productSize = defineType({
  name: "productSize",
  title: "Medida",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      description: "Por ejemplo: Cama de 150 · 170 × 120 cm",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Precio (€)",
      type: "number",
      description: "Vacío: la ficha no enseña importe con esta medida.",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "altura",
      title: "Altura",
      type: "string",
      description:
        "Solo para el configurador (los árboles). Si las medidas llevan " +
        "altura y decoración, la ficha enseña dos desplegables, «Altura» y " +
        "«Decoración», en vez de «Medida». Escribe la altura igual en todas " +
        "las que la comparten.",
    }),
    defineField({
      name: "caras",
      title: "Decoración",
      type: "string",
      description: "Por ejemplo: «A 1 cara · en una esquina».",
    }),
    defineField({
      name: "extra",
      title: "Es un extra",
      type: "boolean",
      description:
        "Un añadido que se marca con una casilla (las luces del árbol) y va " +
        "en su propia línea de la solicitud. Ponle la misma altura que el " +
        "árbol al que acompaña.",
    }),
  ],
  preview: {
    select: { title: "name", price: "price" },
    prepare: ({ title, price }) => ({
      title,
      subtitle: price != null ? `${price} €` : "sin precio",
    }),
  },
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
