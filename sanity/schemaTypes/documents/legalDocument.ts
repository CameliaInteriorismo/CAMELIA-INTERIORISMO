import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Aviso Legal, Política de Privacidad, Política de Cookies y Accesibilidad.
 *
 * NO se aplanan a Portable Text a propósito. Estos documentos tienen tablas
 * de identificación del titular (etiqueta / valor / enlace), listas, bloques
 * de líneas pegadas para direcciones postales y apartados anidados. Portable
 * Text convertiría todo eso en párrafos sueltos y se perdería la estructura
 * que exige un texto legal. Por eso el esquema reproduce exactamente los
 * mismos tipos de bloque que ya sabe pintar LegalDocument.tsx.
 */
export const legalDocument = defineType({
  name: "legalDocument",
  title: "Documento legal",
  type: "document",
  groups: [
    { name: "content", title: "Contenido", default: true },
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
      description:
        "Debe coincidir con la ruta de la web: aviso-legal, politica-de-privacidad, politica-de-cookies o accesibilidad. Cambiarlo rompe el enlace del pie de página.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lead",
      title: "Entradilla",
      type: "paragraphs",
      group: "content",
      description: "Los párrafos que van antes del primer apartado numerado.",
    }),
    defineField({
      name: "sections",
      title: "Apartados",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "legalSection" })],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});

export const legalSection = defineType({
  name: "legalSection",
  title: "Apartado",
  type: "object",
  fields: [
    defineField({
      name: "number",
      title: "Número",
      type: "string",
      description: 'Sale delante del título: "1. Responsable…".',
    }),
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "blocks",
      title: "Contenido",
      type: "array",
      of: [
        defineArrayMember({ type: "legalText" }),
        defineArrayMember({ type: "legalList" }),
        defineArrayMember({ type: "legalDetails" }),
        defineArrayMember({ type: "legalLines" }),
        defineArrayMember({ type: "legalSubsection" }),
      ],
    }),
  ],
  preview: {
    select: { number: "number", title: "title" },
    prepare: ({ number, title }) => ({
      title: number ? `${number}. ${title}` : title,
    }),
  },
});

/**
 * Comprueba que cada enlace embebido sigue encontrando su frase.
 *
 * El renderizador busca el texto del enlace LITERALMENTE dentro de los
 * párrafos (ver withLinks en LegalDocument.tsx). Si alguien edita el párrafo
 * y cambia una coma, la frase deja de encontrarse y el enlace desaparece sin
 * que nadie se entere. Esta validación lo convierte en un error visible en el
 * panel, antes de publicar.
 */
function validateInlineLinks(
  block:
    | {
        paragraphs?: string[];
        links?: { text?: string; href?: string }[];
      }
    | undefined,
) {
  const links = block?.links ?? [];
  if (links.length === 0) return true;

  const haystack = (block?.paragraphs ?? []).join("\n");
  const orphans = links
    .map((link) => link?.text)
    .filter((text): text is string => Boolean(text))
    .filter((text) => !haystack.includes(text));

  if (orphans.length === 0) return true;

  const list = orphans.map((text) => `«${text}»`).join(", ");
  return (
    `Estos enlaces ya no encuentran su frase en el texto: ${list}. ` +
    "Corrige la frase del enlace para que coincida exactamente con el párrafo, " +
    "o el enlace no se pintará."
  );
}

export const legalText = defineType({
  name: "legalText",
  title: "Párrafos",
  type: "object",
  // El aviso se pone en el bloque entero, no en cada enlace: la comprobación
  // necesita ver los párrafos y los enlaces a la vez.
  validation: (rule) => rule.custom(validateInlineLinks),
  fields: [
    defineField({ name: "paragraphs", title: "Párrafos", type: "paragraphs" }),
    defineField({
      name: "links",
      title: "Enlaces dentro del texto",
      type: "array",
      description:
        "Para convertir una frase concreta en enlace sin partir el párrafo. La frase debe coincidir EXACTAMENTE con la del párrafo, tildes y puntuación incluidas: si no, el enlace no se pinta y el panel te avisará.",
      of: [
        defineArrayMember({
          type: "object",
          name: "inlineLink",
          fields: [
            defineField({
              name: "text",
              title: "Frase exacta",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "Destino",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "text", subtitle: "href" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { paragraphs: "paragraphs" },
    prepare: ({ paragraphs }) => ({
      title: "Párrafos",
      subtitle: paragraphs?.[0]?.slice(0, 80),
    }),
  },
});

export const legalList = defineType({
  name: "legalList",
  title: "Lista",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Puntos",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 2 })],
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare: ({ items }) => ({
      title: "Lista",
      subtitle: `${items?.length ?? 0} puntos`,
    }),
  },
});

export const legalDetails = defineType({
  name: "legalDetails",
  title: "Tabla de datos",
  type: "object",
  description: "Pares etiqueta / valor, como los datos del titular.",
  fields: [
    defineField({
      name: "entries",
      title: "Filas",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "detailEntry",
          fields: [
            defineField({
              name: "label",
              title: "Etiqueta",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Valor",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "Enlace",
              type: "string",
              description:
                "Opcional. Convierte el valor en enlace: mailto:…, tel:… o https://…",
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { entries: "entries" },
    prepare: ({ entries }) => ({
      title: "Tabla de datos",
      subtitle: `${entries?.length ?? 0} filas`,
    }),
  },
});

export const legalLines = defineType({
  name: "legalLines",
  title: "Líneas juntas",
  type: "object",
  description:
    "Líneas pegadas entre sí, no como párrafos: una dirección postal, un correo suelto.",
  fields: [
    defineField({
      name: "items",
      title: "Líneas",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "legalLine",
          fields: [
            defineField({
              name: "value",
              title: "Texto",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "Enlace",
              type: "string",
              description: "Opcional.",
            }),
          ],
          preview: { select: { title: "value", subtitle: "href" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare: ({ items }) => ({
      title: "Líneas juntas",
      subtitle: items?.[0]?.value,
    }),
  },
});

export const legalSubsection = defineType({
  name: "legalSubsection",
  title: "Sub-apartado",
  type: "object",
  description:
    'Un bloque con título dentro de un apartado: 3.1, "Cookies técnicas"…',
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "blocks",
      title: "Contenido",
      type: "array",
      of: [
        defineArrayMember({ type: "legalText" }),
        defineArrayMember({ type: "legalList" }),
        defineArrayMember({ type: "legalDetails" }),
        defineArrayMember({ type: "legalLines" }),
      ],
    }),
  ],
  preview: { select: { title: "title" } },
});
