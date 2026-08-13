import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Lo que aparece en TODAS las páginas: navegación, pie, datos de contacto y
 * redes. Documento único — no se crea más de uno.
 *
 * La dirección se guarda por piezas (calle / planta / localidad) y no como un
 * texto suelto, porque la web la escribe de tres formas distintas y cada una
 * necesita partes diferentes: rotulada en tres líneas, en una línea con
 * planta para los textos legales, y sin planta para Google Maps. Guardarla
 * entera obligaría a repetirla tres veces y a que volviesen a divergir, que
 * es exactamente lo que ya pasó una vez.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Ajustes del sitio",
  type: "document",
  groups: [
    { name: "contact", title: "Contacto", default: true },
    { name: "nav", title: "Navegación" },
    { name: "footer", title: "Pie de página" },
    { name: "social", title: "Redes sociales" },
    { name: "seo", title: "SEO por defecto" },
  ],
  fields: [
    defineField({
      name: "email",
      title: "Correo electrónico",
      type: "string",
      group: "contact",
      description: "Se usa en Contacto, en el pie y en los textos legales.",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Teléfono",
      type: "string",
      group: "contact",
      description: 'Tal como se lee en pantalla: "+34 601 53 13 01".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phoneHref",
      title: "Teléfono para marcar",
      type: "string",
      group: "contact",
      description: 'Sin espacios ni signos: "tel:+34601531301".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "addressStreet",
      title: "Dirección — calle y número",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "addressFloor",
      title: "Dirección — planta",
      type: "string",
      group: "contact",
      description:
        "Sale en el pie y en los textos legales, pero NO en los enlaces de Google Maps: una planta no ayuda a localizar el portal.",
    }),
    defineField({
      name: "addressLocality",
      title: "Dirección — código postal y ciudad",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "openingHours",
      title: "Horario",
      type: "array",
      group: "contact",
      of: [defineArrayMember({ type: "string" })],
      description: "Una línea por entrada, como se ve en el pie.",
    }),

    defineField({
      name: "navLinks",
      title: "Menú principal",
      type: "array",
      group: "nav",
      description:
        "El menú hamburguesa, en orden. Añadir una entrada aquí NO crea la página: apunta a una ruta que ya exista.",
      of: [defineArrayMember({ type: "link" })],
    }),
    defineField({
      name: "headerCta",
      title: "Botón de la barra superior",
      type: "link",
      group: "nav",
    }),

    defineField({
      name: "footerNavTitle",
      title: "Rótulo de la columna de navegación",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "footerContactTitle",
      title: "Rótulo de la columna de contacto",
      type: "string",
      group: "footer",
      description:
        "La columna en sí no se edita aquí: la compone el pie con el correo, el teléfono y la dirección de arriba.",
    }),
    defineField({
      name: "footerScheduleTitle",
      title: "Rótulo de la columna de horario",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "footerColumns",
      title: "Columnas del pie",
      type: "array",
      group: "footer",
      of: [
        defineArrayMember({
          type: "object",
          name: "footerColumn",
          fields: [
            defineField({
              name: "title",
              title: "Título de la columna",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "links",
              title: "Enlaces",
              type: "array",
              of: [defineArrayMember({ type: "link" })],
            }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
    defineField({
      name: "footerLegalLinks",
      title: "Enlaces legales del pie",
      type: "array",
      group: "footer",
      description:
        'El orden importa. "Configuración de cookies" no es una página: abre el panel del banner, y por eso su destino se deja como #cookies.',
      of: [defineArrayMember({ type: "link" })],
    }),
    defineField({
      name: "copyright",
      title: "Aviso de copyright",
      type: "string",
      group: "footer",
    }),

    defineField({
      name: "socials",
      title: "Redes sociales",
      type: "array",
      group: "social",
      description:
        "Una red sin URL se dibuja como icono apagado, no como enlace roto. Deja la URL vacía hasta tenerla.",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({
              name: "label",
              title: "Nombre",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "url", title: "URL", type: "url" }),
            defineField({
              name: "icon",
              title: "Icono para el pie",
              type: "image",
            }),
            defineField({
              name: "iconMenu",
              title: "Icono para el menú",
              type: "image",
              description: "La versión clara, sobre fondo vino.",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "url", media: "icon" },
          },
        }),
      ],
    }),

    defineField({
      name: "defaultSeo",
      title: "SEO por defecto",
      type: "seo",
      group: "seo",
      description:
        "El que se usa cuando una página no tiene el suyo propio. También da el título que acompaña a toda la web en la pestaña.",
    }),
    defineField({
      name: "siteName",
      title: "Nombre del sitio",
      type: "string",
      group: "seo",
      initialValue: "Camelia",
    }),
  ],
  preview: { prepare: () => ({ title: "Ajustes del sitio" }) },
});
