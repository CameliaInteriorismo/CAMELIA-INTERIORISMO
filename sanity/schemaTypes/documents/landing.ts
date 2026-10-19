import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Las rutas que ya existen en la raíz de la web. Una página de zona con uno de
 * estos slugs nunca se vería (la ruta fija gana a la dinámica), así que el
 * panel no deja guardarla.
 */
const RUTAS_OCUPADAS = [
  "estudio",
  "metodologia",
  "servicios",
  "proyectos",
  "tienda",
  "contacto",
  "carrito",
  "cuentanos-tu-proyecto",
  "articulos",
  "aviso-legal",
  "politica-de-privacidad",
  "politica-de-cookies",
  "accesibilidad",
  "studio",
  "api",
];

const preguntas = defineArrayMember({
  type: "object",
  name: "faqItem",
  fields: [
    defineField({
      name: "question",
      title: "Pregunta",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Respuesta",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});

/**
 * Una página por zona o por servicio: «Interiorismo en Alzira y la Ribera»,
 * «Interiorismo para obra nueva»… Es lo que encuentra quien busca en Google
 * algo concreto, así que cada una tiene que enseñar obras reales de lo que
 * promete. Nada de copiar la misma página cambiando el pueblo.
 */
export const landingPage = defineType({
  name: "landingPage",
  title: "Página de zona o servicio",
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
      description:
        "El que se lee sobre la foto y el que mira Google. Di qué y dónde: «Interiorismo y reforma integral en Alzira y la Ribera».",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Dirección",
      type: "slug",
      group: "content",
      description:
        "Lo que va detrás de cameliainteriorismo.com/. Corta y con las palabras que se buscan: «interiorismo-alzira».",
      options: { source: "title", maxLength: 60 },
      validation: (rule) =>
        rule.required().custom((slug) => {
          const actual = slug?.current;
          if (actual && RUTAS_OCUPADAS.includes(actual)) {
            return `«${actual}» ya es otra página de la web.`;
          }
          return true;
        }),
    }),
    defineField({
      name: "heroImage",
      title: "Foto de cabecera",
      type: "imageWithAlt",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImagePosition",
      title: "Encuadre de la foto",
      type: "string",
      group: "content",
      description: 'Valores CSS: "center", "center 30%"… Vacío = centrada.',
    }),
    defineField({
      name: "introTitle",
      title: "Título de la entradilla",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "introText",
      title: "Entradilla",
      type: "paragraphs",
      group: "content",
    }),
    defineField({
      name: "sections",
      title: "Bloques de texto",
      type: "array",
      group: "content",
      description:
        "Qué hacemos aquí, cómo trabajamos, en qué pueblos… Cada bloque, un título y sus párrafos.",
      of: [
        defineArrayMember({
          type: "object",
          name: "landingSection",
          fields: [
            defineField({
              name: "title",
              title: "Título",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "paragraphs",
              title: "Párrafos",
              type: "paragraphs",
            }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
    defineField({
      name: "projectsTitle",
      title: "Título de los proyectos",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "projects",
      title: "Proyectos",
      type: "array",
      group: "content",
      description:
        "Obras reales de esta zona o de este tipo. Es lo que hace creíble la página.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
    }),
    defineField({
      name: "faqTitle",
      title: "Título de las preguntas",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "faq",
      title: "Preguntas frecuentes",
      type: "array",
      group: "content",
      of: [preguntas],
    }),
    defineField({
      name: "cta",
      title: "Banner final",
      type: "ctaBanner",
      group: "content",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current", media: "heroImage" },
    prepare: ({ title, slug, media }) => ({
      title,
      subtitle: slug ? `/${slug}` : "Sin dirección",
      media,
    }),
  },
});

/**
 * El cuerpo de un artículo: párrafos con subtítulos, listas, citas, enlaces y
 * fotos entre medias. Más que el `richText` de los legales, que solo tiene
 * párrafos.
 */
export const articleBody = defineType({
  name: "articleBody",
  title: "Texto del artículo",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Párrafo", value: "normal" },
        { title: "Subtítulo", value: "h2" },
        { title: "Subtítulo menor", value: "h3" },
        { title: "Cita", value: "blockquote" },
      ],
      lists: [
        { title: "Lista", value: "bullet" },
        { title: "Lista numerada", value: "number" },
      ],
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
              defineField({
                name: "href",
                type: "string",
                title: "Destino",
                description:
                  "Ruta interna como /servicios, o una URL completa que empiece por https://",
                validation: (rule) => rule.required(),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: "imageWithAlt", title: "Foto" }),
  ],
});

/**
 * Un artículo de la web: uno al mes, con datos propios (precios, plazos,
 * licencias, un proyecto explicado). Lo prepara el agente de marketing y lo
 * publica una persona.
 */
export const article = defineType({
  name: "article",
  title: "Artículo",
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
      title: "Dirección",
      type: "slug",
      group: "content",
      description: "Lo que va detrás de /articulos/.",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Fecha",
      type: "date",
      group: "content",
      options: { dateFormat: "DD/MM/YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Resumen",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "Dos frases. Sale en el listado y, si el SEO está vacío, en Google.",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "coverImage",
      title: "Foto principal",
      type: "imageWithAlt",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Texto",
      type: "articleBody",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projects",
      title: "Proyectos relacionados",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Más recientes",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", date: "date", media: "coverImage" },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date ? date.split("-").reverse().join("/") : "Sin fecha",
      media,
    }),
  },
});
