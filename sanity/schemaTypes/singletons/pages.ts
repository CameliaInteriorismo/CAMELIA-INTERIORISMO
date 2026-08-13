import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Una página = un documento único. No se crean más ejemplares: la estructura
 * del Studio (ver sanity/structure.ts) los abre directamente en su editor, sin
 * pasar por un listado vacío.
 *
 * Lo que NO está aquí, por ser diseño y no contenido: el número de columnas,
 * los tiempos de las animaciones, el orden de las secciones dentro de la
 * página. Cambiar eso son cambios de maquetación, no de contenido.
 */

const seoField = defineField({
  name: "seo",
  title: "SEO",
  type: "seo",
  group: "seo",
});
const groups = [
  { name: "content", title: "Contenido", default: true },
  { name: "seo", title: "SEO" },
];

export const homePage = defineType({
  name: "homePage",
  title: "Página · Inicio",
  type: "document",
  groups,
  fields: [
    defineField({
      name: "heroVideo",
      title: "Vídeo de portada",
      type: "url",
      group: "content",
      description:
        "URL de Cloudinary. El logotipo animado va encima; eso es diseño y no se toca desde aquí.",
    }),
    defineField({
      name: "heroImage",
      title: "Imagen de portada",
      type: "imageWithAlt",
      group: "content",
      description: "Solo se usa si no hay vídeo.",
    }),
    defineField({
      name: "animatedPhrases",
      title: "Frases del carrusel",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      description:
        "Las frases que desfilan bajo la portada. La velocidad y la dirección son diseño.",
    }),
    defineField({
      name: "servicesTitle",
      title: "Título de la sección de servicios",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "services",
      title: "Servicios que se muestran",
      type: "array",
      group: "content",
      description:
        "Se eligen de los servicios del estudio. Para cambiar su texto o su foto, edita el servicio.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
    }),
    defineField({
      name: "detailTitle",
      title: "Título de la cuadrícula de detalles",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "detailImages",
      title: "Imágenes de la cuadrícula",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "imageWithAlt" })],
    }),
    defineField({
      name: "featuredProjects",
      title: "Proyectos destacados",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
    }),
    defineField({
      name: "testimonialsTitle",
      title: "Título de los testimonios",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "testimonials",
      title: "Testimonios que se muestran",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "testimonial" }] }),
      ],
    }),
    defineField({
      name: "cta",
      title: "Banner final",
      type: "ctaBanner",
      group: "content",
    }),
    defineField({
      name: "partnersTitle",
      title: "Título de las marcas",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "partners",
      title: "Marcas que se muestran",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "partner" }] })],
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Página · Inicio" }) },
});

export const estudioPage = defineType({
  name: "estudioPage",
  title: "Página · Estudio",
  type: "document",
  groups,
  fields: [
    defineField({
      name: "title",
      title: "Título de la página",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "sections",
      title: "Bloques",
      type: "array",
      group: "content",
      description:
        "Sobre nosotros, Dirección creativa, Dirección ejecutiva… Añade los que quieras: se pintan en este orden, alternando el lado de la foto.",
      of: [
        defineArrayMember({
          type: "object",
          name: "aboutSection",
          fields: [
            defineField({
              name: "title",
              title: "Título",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "subtitle",
              title: "Subtítulo",
              type: "string",
              description: 'El que va en mayúsculas: "LAURA CASTILLO".',
            }),
            defineField({
              name: "paragraphs",
              title: "Texto",
              type: "paragraphs",
            }),
            defineField({
              name: "image",
              title: "Imagen",
              type: "imageWithAlt",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "subtitle", media: "image" },
          },
        }),
      ],
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Página · Estudio" }) },
});

export const metodologiaPage = defineType({
  name: "metodologiaPage",
  title: "Página · Metodología",
  type: "document",
  groups,
  fields: [
    defineField({
      name: "title",
      title: "Título de la página",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "heroImage",
      title: "Imagen de cabecera",
      type: "imageWithAlt",
      group: "content",
    }),
    defineField({
      name: "processTitle",
      title: "Título del proceso",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "process",
      title: "Fases del proceso",
      type: "array",
      group: "content",
      description:
        "La numeración la pone la web sola, según el orden de esta lista.",
      of: [
        defineArrayMember({
          type: "object",
          name: "processStep",
          fields: [
            defineField({
              name: "label",
              title: "Nombre corto (pestaña)",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Titular",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "paragraphs",
              title: "Texto",
              type: "paragraphs",
            }),
            defineField({
              name: "image",
              title: "Imagen",
              type: "imageWithAlt",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "title", media: "image" },
          },
        }),
      ],
    }),
    defineField({
      name: "experienceTitle",
      title: "Título de la experiencia",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "experience",
      title: "Pasos de la experiencia",
      type: "array",
      group: "content",
      description:
        "Los que se van revelando al bajar. El efecto de scroll es diseño y no cambia al añadir o quitar pasos.",
      of: [
        defineArrayMember({
          type: "object",
          name: "experienceStep",
          fields: [
            defineField({
              name: "title",
              title: "Título",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "paragraphs",
              title: "Texto",
              type: "paragraphs",
            }),
            defineField({
              name: "image",
              title: "Imagen",
              type: "imageWithAlt",
            }),
          ],
          preview: { select: { title: "title", media: "image" } },
        }),
      ],
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Página · Metodología" }) },
});

export const serviciosPage = defineType({
  name: "serviciosPage",
  title: "Página · Servicios",
  type: "document",
  groups,
  fields: [
    defineField({
      name: "title",
      title: "Título de la página",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "heroImage",
      title: "Imagen de cabecera",
      type: "imageWithAlt",
      group: "content",
    }),
    defineField({
      name: "phases",
      title: "Servicios del acordeón",
      type: "array",
      group: "content",
      description:
        "Se eligen de los servicios del estudio. Su texto e imagen se editan en el propio servicio, no aquí.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
    }),
    defineField({
      name: "accompanimentTitle",
      title: "Título del acompañamiento",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "accompaniment",
      title: "Tipos de acompañamiento",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "accompanimentItem",
          fields: [
            defineField({
              name: "question",
              title: "Título",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Texto",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "image",
              title: "Imagen",
              type: "imageWithAlt",
            }),
          ],
          preview: {
            select: { title: "question", subtitle: "answer", media: "image" },
          },
        }),
      ],
    }),
    defineField({
      name: "cta",
      title: "Banner",
      type: "ctaBanner",
      group: "content",
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
      of: [
        defineArrayMember({
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
        }),
      ],
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Página · Servicios" }) },
});

export const proyectosPage = defineType({
  name: "proyectosPage",
  title: "Página · Proyectos",
  type: "document",
  groups,
  fields: [
    defineField({
      name: "title",
      title: "Título de la página",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "heroImage",
      title: "Imagen de cabecera",
      type: "imageWithAlt",
      group: "content",
    }),
    defineField({
      name: "introTitle",
      title: "Título de la introducción",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "introText",
      title: "Texto de la introducción",
      type: "text",
      rows: 4,
      group: "content",
    }),
    defineField({
      name: "cta",
      title: "Banner final",
      type: "ctaBanner",
      group: "content",
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Página · Proyectos" }) },
});

export const tiendaPage = defineType({
  name: "tiendaPage",
  title: "Página · Shop",
  type: "document",
  groups,
  fields: [
    defineField({
      name: "title",
      title: "Título de la página",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "heroImage",
      title: "Imagen de cabecera",
      type: "imageWithAlt",
      group: "content",
    }),
    defineField({
      name: "introText",
      title: "Texto de introducción",
      type: "text",
      rows: 4,
      group: "content",
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Página · Shop" }) },
});

export const blogPage = defineType({
  name: "blogPage",
  title: "Página · Blog",
  type: "document",
  groups,
  fields: [
    defineField({
      name: "title",
      title: "Título de la página",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "heroImage",
      title: "Imagen de cabecera",
      type: "imageWithAlt",
      group: "content",
    }),
    defineField({
      name: "introText",
      title: "Texto de introducción",
      type: "text",
      rows: 4,
      group: "content",
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Página · Blog" }) },
});

export const contactPage = defineType({
  name: "contactPage",
  title: "Página · Contacto",
  type: "document",
  groups,
  fields: [
    defineField({
      name: "title",
      title: "Título de la página",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "heroImage",
      title: "Imagen de cabecera",
      type: "imageWithAlt",
      group: "content",
    }),
    defineField({
      name: "cards",
      title: "Tarjetas de contacto",
      type: "array",
      group: "content",
      description:
        "Escríbenos, Llámanos, Visítanos, Síguenos. Los datos (correo, teléfono, dirección) salen de Ajustes del sitio; aquí solo se editan los rótulos.",
      of: [
        defineArrayMember({
          type: "object",
          name: "contactCard",
          fields: [
            defineField({
              name: "kind",
              title: "Tipo",
              type: "string",
              description: "Determina qué dato pinta la tarjeta.",
              options: {
                list: [
                  { title: "Correo electrónico", value: "email" },
                  { title: "Teléfono", value: "phone" },
                  { title: "Dirección", value: "address" },
                  { title: "Redes sociales", value: "social" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Rótulo",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "actionLabel",
              title: "Texto del enlace",
              type: "string",
            }),
          ],
          preview: { select: { title: "title", subtitle: "kind" } },
        }),
      ],
    }),
    defineField({
      name: "mapTitle",
      title: "Título del mapa",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "mapText",
      title: "Texto del mapa",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "mapImage",
      title: "Imagen del mapa",
      type: "imageWithAlt",
      group: "content",
    }),
    defineField({
      name: "mapActionLabel",
      title: "Texto del enlace del mapa",
      type: "string",
      group: "content",
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Página · Contacto" }) },
});

/**
 * El formulario de «Cuéntanos tu proyecto», 16 pasos.
 *
 * Editable: títulos, ayudas, opciones, imágenes y textos de los campos.
 * Bloqueado en el código: `kind` (qué tipo de pantalla es) y `name` (la clave
 * con la que se guarda la respuesta). Esos dos alimentan la validación y el
 * envío; tocarlos desde el panel dejaría el formulario sin validar o
 * perdiendo respuestas, así que no se exponen.
 */
export const projectFormPage = defineType({
  name: "projectFormPage",
  title: "Página · Formulario de proyecto",
  type: "document",
  groups,
  fields: [
    defineField({
      name: "steps",
      title: "Pasos",
      type: "array",
      group: "content",
      description:
        "Cada paso es una pantalla. Puedes cambiar textos, opciones e imágenes, y reordenarlos. El tipo de pantalla y la clave técnica no se editan aquí: los fija el código para que la validación siga funcionando.",
      of: [defineArrayMember({ type: "formStep" })],
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Página · Formulario de proyecto" }) },
});

export const formStep = defineType({
  name: "formStep",
  title: "Paso",
  type: "object",
  fields: [
    defineField({
      name: "key",
      title: "Clave técnica",
      type: "string",
      readOnly: true,
      description:
        "La fija el código: identifica el paso y la respuesta que guarda. Se muestra solo para que sepas qué paso estás editando.",
    }),
    defineField({ name: "title", title: "Título", type: "string" }),
    defineField({
      name: "titleLines",
      title: "Título en varias líneas",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Solo en la pantalla de bienvenida.",
    }),
    defineField({ name: "paragraphs", title: "Texto", type: "paragraphs" }),
    defineField({
      name: "help",
      title: "Texto de ayuda",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "helpBold",
      title: "Parte de la ayuda en negrita",
      type: "string",
      description: "Escríbela tal cual aparece arriba.",
    }),
    defineField({
      name: "placeholder",
      title: "Texto guía del campo",
      type: "string",
    }),
    defineField({ name: "cta", title: "Texto del botón", type: "string" }),
    defineField({
      name: "options",
      title: "Opciones",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description:
        "Solo en pasos de elección. Puedes añadir o quitar opciones libremente.",
    }),
    defineField({
      name: "fieldLabels",
      title: "Rótulos de los campos",
      type: "array",
      description:
        "Solo el texto visible de cada campo. La clave con la que se guarda la respuesta la fija el código.",
      of: [
        defineArrayMember({
          type: "object",
          name: "fieldLabel",
          fields: [
            defineField({
              name: "name",
              title: "Clave técnica",
              type: "string",
              readOnly: true,
            }),
            defineField({ name: "label", title: "Rótulo", type: "string" }),
            defineField({
              name: "placeholder",
              title: "Texto guía",
              type: "string",
            }),
          ],
          preview: { select: { title: "label", subtitle: "name" } },
        }),
      ],
    }),
    defineField({
      name: "groupLabels",
      title: "Rótulos de los grupos de opciones",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "groupLabel",
          fields: [
            defineField({
              name: "name",
              title: "Clave técnica",
              type: "string",
              readOnly: true,
            }),
            defineField({ name: "label", title: "Rótulo", type: "string" }),
            defineField({
              name: "options",
              title: "Opciones",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: { select: { title: "label", subtitle: "name" } },
        }),
      ],
    }),
    defineField({ name: "image", title: "Imagen", type: "imageWithAlt" }),
  ],
  preview: {
    select: { title: "title", key: "key", media: "image" },
    prepare: ({ title, key, media }) => ({
      title: title || key,
      subtitle: key,
      media,
    }),
  },
});
