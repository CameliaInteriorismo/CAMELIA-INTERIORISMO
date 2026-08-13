import { defineField, defineType } from "sanity";

/**
 * Imagen con texto alternativo obligatorio.
 *
 * El `alt` no es burocracia: es lo que lee quien navega con lector de
 * pantalla, y la web ya declara conformidad en /accesibilidad. Por eso va
 * como campo requerido y no como opcional que nadie rellena.
 */
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Imagen",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Texto alternativo",
      type: "string",
      description:
        "Describe lo que se ve, para quien no puede verla. Si es puramente decorativa, escribe un guion.",
      validation: (rule) => rule.required(),
    }),
  ],
});

/**
 * Un botón: texto y destino. Se repite en los CTA de Home, Servicios,
 * Proyectos y en el banner global, siempre con la misma forma.
 */
export const link = defineType({
  name: "link",
  title: "Botón",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Texto del botón",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Destino",
      type: "string",
      description:
        "Ruta interna como /contacto, o una URL completa que empiece por https://",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});

/**
 * Bloque de banner con título, texto opcional, botón e imagen de fondo.
 * Es la forma exacta del CtaBanner que se repite en Home, Servicios y
 * Proyectos con distinto contenido.
 */
export const ctaBanner = defineType({
  name: "ctaBanner",
  title: "Banner de llamada a la acción",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "text", title: "Texto", type: "text", rows: 3 }),
    defineField({ name: "button", title: "Botón", type: "link" }),
    defineField({
      name: "image",
      title: "Imagen de fondo",
      type: "imageWithAlt",
    }),
  ],
  preview: { select: { title: "title", media: "image" } },
});

/**
 * Texto editorial largo. Se limita a los estilos que la web sabe pintar hoy
 * (párrafo, negrita, cursiva, enlace, listas) — añadir aquí un H1 o una cita
 * no serviría de nada, porque ningún componente los renderiza.
 */
export const richText = defineType({
  name: "richText",
  title: "Texto",
  type: "array",
  of: [
    {
      type: "block",
      styles: [{ title: "Párrafo", value: "normal" }],
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
    },
  ],
});

/**
 * Varios párrafos sueltos.
 *
 * La web repite este patrón por todas partes (`paragraphs: string[]` en
 * Estudio, Metodología, fichas de proyecto) y los pinta como <p> sucesivos.
 * Se modela tal cual, en vez de como Portable Text, porque no admite
 * formato: son párrafos planos y así el panel no ofrece opciones que luego
 * no se ven.
 */
export const paragraphs = defineType({
  name: "paragraphs",
  title: "Párrafos",
  type: "array",
  of: [{ type: "text", rows: 4 }],
});
