import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Un proyecto de interiorismo.
 *
 * Este documento es la ÚNICA fuente de verdad. Antes el mismo proyecto se
 * escribía dos veces —nombre e imagen en ProjectsGrid.tsx, ficha completa en
 * proyecto-detalle/data.ts— y ya habían divergido en el formato del nombre
 * ("LLUM DE VILA" contra "Llum de Vila"). Aquí se escribe una vez y la
 * mayúscula del listado la pone el CSS, que es donde corresponde.
 *
 * Crear uno nuevo y publicarlo basta para que aparezca en /proyectos y para
 * que tenga su ficha en /proyectos/su-slug. No hay que tocar código.
 */
export const project = defineType({
  name: "project",
  title: "Proyecto",
  type: "document",
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "media", title: "Imágenes y vídeo" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      group: "content",
      description:
        'Escríbelo normal ("Llum de Vila"). En el listado sale en mayúsculas por diseño; no hace falta escribirlo así.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      group: "content",
      description:
        "La dirección de la ficha. Pulsa «Generate» para sacarla del nombre. Si la cambias en un proyecto ya publicado, el enlace antiguo deja de funcionar.",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Año",
      type: "string",
      group: "content",
      description: "Se muestra tal cual en la ficha.",
    }),
    defineField({
      name: "location",
      title: "Municipio",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "province",
      title: "Provincia",
      type: "string",
      group: "content",
      description:
        'La ficha escribe "Municipio (Provincia)", salvo cuando coinciden (Valencia), en cuyo caso muestra solo uno.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "services",
      title: "Servicios prestados",
      type: "array",
      group: "content",
      description:
        "Se eligen de los servicios del estudio, no se escriben a mano: así no aparecen variantes como «Proyecto de interiorismo».",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "paragraphs",
      title: "Descripción del proyecto",
      type: "paragraphs",
      group: "content",
      description: "Cada entrada es un párrafo de la ficha.",
    }),

    defineField({
      name: "cardImage",
      title: "Imagen del listado",
      type: "imageWithAlt",
      group: "media",
      description: "La que se ve en la cuadrícula de /proyectos.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "homeImage",
      title: "Foto para la Home",
      type: "imageWithAlt",
      group: "media",
      description:
        "La que sale en la cuadrícula de destacados de la Home. Es un campo aparte de la del listado porque ahí se usa otro encuadre; cambiar una no toca la otra.",
      // Obligatoria solo si el proyecto está destacado: el recuadro de la
      // Home únicamente existe para esos. Exigirla a todos marcaría como
      // incompletos proyectos que están perfectamente terminados.
      validation: (rule) =>
        rule.custom((value, context) =>
          (context.document as { featured?: boolean })?.featured && !value
            ? "Un proyecto destacado necesita su foto para la Home."
            : true,
        ),
    }),
    defineField({
      name: "heroVideoFile",
      title: "Vídeo de cabecera (archivo)",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      group: "media",
      description:
        "Sube aquí el vídeo. Tiene prioridad sobre la URL de Cloudinary, que se conserva como respaldo.",
    }),
    defineField({
      name: "heroVideoPosition",
      title: "Encuadre del vídeo",
      type: "string",
      group: "media",
      description:
        'Qué parte del vídeo se ve cuando se recorta. Acepta valores CSS: "center", "center 30%" o "50% 30%" suben el encuadre. Vacío = centrado.',
    }),
    defineField({
      name: "heroVideo",
      title: "Vídeo de cabecera",
      type: "url",
      group: "media",
      description:
        "URL de Cloudinary. Si lo rellenas, manda sobre la imagen de cabecera. Ejemplo: https://res.cloudinary.com/…/f_auto,q_auto,c_limit,w_1920/nombre.mp4",
    }),
    defineField({
      name: "heroImage",
      title: "Imagen de cabecera",
      type: "imageWithAlt",
      group: "media",
      description: "Se usa solo si no hay vídeo.",
    }),
    defineField({
      name: "galleryBlocks",
      title: "Galería",
      type: "array",
      group: "media",
      description:
        "Cada bloque es siempre la misma composición: una foto apaisada arriba y dos verticales debajo. Añade tantos bloques como necesites; así todos los proyectos se ven igual. Un hueco que dejes vacío conserva su sitio en la página.",
      of: [defineArrayMember({ type: "galleryBlock" })],
    }),
    defineField({
      name: "featured",
      title: "Destacado en la Home",
      type: "boolean",
      group: "content",
      description:
        "Al marcarlo, el proyecto entra solo en la cuadrícula de la Home, con su «Foto para la Home». Al desmarcarlo, sale. No hay que tocar nada en Inicio.",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      group: "content",
      description:
        "Menor número, antes en el listado. Deja hueco entre proyectos (10, 20, 30…) para poder colar uno en medio sin renumerar todo.",
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
    select: { title: "name", subtitle: "location", media: "cardImage" },
  },
});

/** Una imagen sola, a ancho de columna. */
export const gallerySingle = defineType({
  name: "gallerySingle",
  title: "Una imagen",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Imagen",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { media: "image", subtitle: "image.alt" },
    prepare: ({ media, subtitle }) => ({
      title: "Una imagen",
      subtitle,
      media,
    }),
  },
});

/** Dos imágenes en pareja, una al lado de la otra. */
export const galleryPair = defineType({
  name: "galleryPair",
  title: "Pareja de imágenes",
  type: "object",
  fields: [
    defineField({
      name: "left",
      title: "Izquierda",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "right",
      title: "Derecha",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { media: "left", subtitle: "left.alt" },
    prepare: ({ media, subtitle }) => ({
      title: "Pareja de imágenes",
      subtitle,
      media,
    }),
  },
});

/** Un bloque de galería: una apaisada arriba y dos verticales debajo. */
export const galleryBlock = defineType({
  name: "galleryBlock",
  title: "Bloque de galería",
  type: "object",
  fields: [
    defineField({
      name: "horizontal",
      title: "Foto apaisada (arriba)",
      type: "imageWithAlt",
    }),
    defineField({
      name: "vertical1",
      title: "Vertical izquierda",
      type: "imageWithAlt",
    }),
    defineField({
      name: "vertical2",
      title: "Vertical derecha",
      type: "imageWithAlt",
    }),
  ],
  preview: {
    select: { media: "horizontal" },
    prepare: ({ media }) => ({ title: "Bloque de galería", media }),
  },
});
