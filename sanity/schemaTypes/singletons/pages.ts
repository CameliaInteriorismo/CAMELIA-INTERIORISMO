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
/**
 * El encuadre de la cabecera. Es lo único de presentación que se expone,
 * y con motivo: al cambiar la foto casi siempre hay que reajustar qué parte
 * se ve, y obligar a tocar código para eso haría inútil poder cambiarla.
 */
const heroPositionField = defineField({
  name: "heroImagePosition",
  title: "Encuadre de la cabecera",
  type: "string",
  group: "content",
  description:
    'Qué parte de la foto se ve. "center 35%" sube el encuadre, "center 65%" lo baja. Vacío = centrado.',
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
      name: "heroLogo",
      title: "Logotipo sobre la portada",
      type: "imageWithAlt",
      group: "content",
      description:
        "El logotipo blanco centrado sobre el vídeo. La animación que lo lleva hasta la barra al bajar es diseño y no cambia. Se dibuja dentro de una caja fija con «contain», así que una imagen de otra proporción se ajusta sin deformarse.",
      validation: (rule) => rule.required(),
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
      name: "servicesCta",
      title: "Botón de la sección de servicios",
      type: "link",
      group: "content",
    }),
    defineField({
      name: "detailTitle",
      title: "Título de la cuadrícula de detalles",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "featuredProjects",
      title: "Proyectos destacados",
      type: "array",
      group: "content",
      description:
        "La cuadrícula que enlaza a los proyectos. El nombre y el enlace salen del proyecto elegido; la foto es propia de la Home, porque aquí se usa un encuadre distinto al del listado de /proyectos.",
      of: [
        defineArrayMember({
          type: "object",
          name: "featuredProject",
          fields: [
            defineField({
              name: "project",
              title: "Proyecto",
              type: "reference",
              to: [{ type: "project" }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "image",
              title: "Foto para la Home",
              type: "imageWithAlt",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "project.name", media: "image" },
          },
        }),
      ],
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

/**
 * Un tramo de texto dentro de un bloque de Estudio.
 *
 * Existe porque "Sobre nosotros" se lee en dos partes con nombre propio
 * —"Nuestra historia" y "Nuestra filosofía"— y una lista plana de párrafos no
 * tiene dónde guardarlos. El subtítulo es opcional: las fichas de Laura y de
 * Adrián son un único tramo sin encabezado y siguen igual que antes.
 */
export const aboutBlock = defineType({
  name: "aboutBlock",
  title: "Tramo de texto",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Subtítulo",
      type: "string",
      description: 'Opcional. Por ejemplo "Nuestra historia".',
    }),
    defineField({ name: "paragraphs", title: "Párrafos", type: "paragraphs" }),
  ],
  preview: {
    select: { title: "heading", paragraphs: "paragraphs" },
    prepare: ({ title, paragraphs }) => ({
      title: title || "Texto sin subtítulo",
      subtitle: paragraphs?.[0]?.slice(0, 80),
    }),
  },
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
              name: "blocks",
              title: "Texto",
              type: "array",
              description:
                "Cada bloque es un tramo de texto con su propio subtítulo. El subtítulo es opcional: déjalo vacío y el bloque se lee como texto corrido, que es lo que necesitan las fichas de una persona.",
              of: [defineArrayMember({ type: "aboutBlock" })],
            }),
            defineField({
              name: "paragraphs",
              title: "Texto (formato anterior)",
              type: "paragraphs",
              description:
                "Se conserva para no perder lo que ya estuviera escrito. Si el bloque de arriba tiene contenido, manda ese y esto no se pinta.",
              readOnly: true,
            }),
            defineField({
              name: "image",
              title: "Imagen",
              type: "imageWithAlt",
              validation: (rule) => rule.required(),
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
      validation: (rule) => rule.required(),
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
              validation: (rule) => rule.required(),
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
              name: "imageRight",
              title: "Foto a la derecha",
              type: "boolean",
              description:
                "Los pasos alternan el lado de la foto. Márcalo o desmárcalo si al reordenarlos deja de alternar.",
              initialValue: false,
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
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "title", media: "image" } },
        }),
      ],
    }),
    heroPositionField,
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introTitle",
      title: "Título de la introducción",
      type: "text",
      rows: 2,
      group: "content",
      description: "Cada salto de línea que escribas se respeta.",
    }),
    defineField({
      name: "introText",
      title: "Texto de la introducción",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "phasesTitle",
      title: "Título de las fases",
      type: "text",
      rows: 2,
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
              validation: (rule) => rule.required(),
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
    heroPositionField,
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
      validation: (rule) => rule.required(),
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
      description:
        "Su fondo es un patrón de rayas hecho con CSS, no una foto: por eso no tiene campo de imagen.",
      type: "ctaBannerPlain",
      group: "content",
    }),
    heroPositionField,
    seoField,
  ],
  preview: { prepare: () => ({ title: "Página · Proyectos" }) },
});

export const tiendaPage = defineType({
  name: "tiendaPage",
  title: "Página · Shop",
  type: "document",
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "labels", title: "Rótulos" },
    { name: "seo", title: "SEO" },
  ],
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introText",
      title: "Texto de introducción",
      type: "text",
      rows: 4,
      group: "content",
    }),
    heroPositionField,
    defineField({
      name: "gridTitle",
      title: "Título de la cuadrícula",
      type: "text",
      rows: 2,
      group: "content",
      description:
        'El titular sobre los productos. Cada salto de línea que escribas se respeta: hoy son dos, "Nuestros" y "productos".',
    }),
    defineField({
      name: "filterLabel",
      title: "Rótulo del filtro de categoría",
      type: "string",
      group: "labels",
      description:
        "Las categorías que ofrece el desplegable salen solas de los productos; esto es solo su rótulo.",
    }),
    defineField({
      name: "sortLabel",
      title: "Rótulo del desplegable de orden",
      type: "string",
      group: "labels",
    }),
    defineField({
      name: "sortOptions",
      title: "Opciones de ordenación",
      type: "sortOptionLabels",
      group: "labels",
      description:
        "Solo el texto de cada opción. Cómo ordena cada una lo decide el código.",
    }),
    defineField({
      name: "taxNote",
      title: "Nota junto al precio",
      type: "string",
      group: "labels",
      description: 'Lo que hoy dice "IVA incluido", en la ficha del producto.',
    }),
    defineField({
      name: "addToCartLabel",
      title: "Botón de añadir al carrito",
      type: "string",
      group: "labels",
      description:
        "Solo el texto. Lo que hace el botón al pulsarlo sigue en el código.",
    }),
    defineField({
      name: "addedLabel",
      title: "Botón tras añadir",
      type: "string",
      group: "labels",
      description:
        'Lo que dice el botón el instante posterior a pulsarlo. Hoy "AÑADIDO".',
    }),
    defineField({
      name: "relatedTitle",
      title: "Rótulo de productos relacionados",
      type: "string",
      group: "labels",
    }),
    defineField({
      name: "detailLabels",
      title: "Rótulos de los desplegables de la ficha",
      type: "productDetailLabels",
      group: "labels",
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Página · Shop" }) },
});

/**
 * Los rótulos de los tres desplegables de la ficha de producto.
 *
 * Claves fijas, no lista abierta: cada uno se corresponde con un campo
 * concreto del producto, así que añadir un cuarto rótulo aquí no pintaría
 * nada y quitar uno dejaría su contenido sin título.
 */
export const productDetailLabels = defineType({
  name: "productDetailLabels",
  title: "Rótulos de la ficha",
  type: "object",
  fields: [
    defineField({
      name: "detallesDeLaPieza",
      title: "Detalles de la pieza",
      type: "string",
    }),
    defineField({
      name: "materialesYMedidas",
      title: "Materiales y medidas",
      type: "string",
    }),
    defineField({
      name: "envioYEntrega",
      title: "Envío y entrega",
      type: "string",
    }),
  ],
  preview: { prepare: () => ({ title: "Rótulos de la ficha" }) },
});

/** El texto de cada criterio de ordenación del Shop. El criterio, no. */
export const sortOptionLabels = defineType({
  name: "sortOptionLabels",
  title: "Opciones de ordenación",
  type: "object",
  fields: [
    defineField({ name: "destacados", title: "Destacados", type: "string" }),
    defineField({ name: "recientes", title: "Más recientes", type: "string" }),
    defineField({
      name: "precioAsc",
      title: "Precio: menor a mayor",
      type: "string",
    }),
    defineField({
      name: "precioDesc",
      title: "Precio: mayor a menor",
      type: "string",
    }),
    defineField({ name: "nombreAsc", title: "Nombre A–Z", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Opciones de ordenación" }) },
});

/**
 * Los rótulos de /carrito.
 *
 * Solo texto: las cantidades, los precios y el contenido del carrito los pone
 * el visitante, y el destino de los botones es una ruta fija.
 */
export const cartPage = defineType({
  name: "cartPage",
  title: "Página · Carrito",
  type: "document",
  groups: [
    { name: "content", title: "Resumen", default: true },
    { name: "empty", title: "Carrito vacío" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titular",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "taxNote",
      title: "Nota junto al precio",
      type: "string",
      group: "content",
      description: 'Lo que hoy dice "IVA incluido".',
    }),
    defineField({
      name: "quantityLabel",
      title: "Rótulo de la cantidad",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "notesLabel",
      title: "Rótulo de las observaciones",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "notesPlaceholder",
      title: "Texto guía de las observaciones",
      type: "string",
      group: "content",
      description:
        "El gris que se ve dentro del recuadro mientras está vacío. No se envía.",
    }),
    defineField({
      name: "continueLabel",
      title: "Botón de continuar",
      type: "string",
      group: "content",
      description:
        "Solo el texto. El botón sigue llevando a la pantalla de confirmación.",
    }),
    defineField({
      name: "emptyText",
      title: "Mensaje de carrito vacío",
      type: "string",
      group: "empty",
    }),
    defineField({
      name: "emptyActionLabel",
      title: "Botón de carrito vacío",
      type: "string",
      group: "empty",
      description: "Solo el texto. El botón sigue llevando al Shop.",
    }),
  ],
  preview: { prepare: () => ({ title: "Página · Carrito" }) },
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introText",
      title: "Texto de introducción",
      type: "text",
      rows: 4,
      group: "content",
    }),
    heroPositionField,
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
      validation: (rule) => rule.required(),
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
      name: "mapLead",
      title: "Frase destacada del mapa",
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
      name: "mapAddressLabel",
      title: "Rótulo de la dirección en la tarjeta",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "mapImage",
      title: "Imagen del mapa",
      type: "imageWithAlt",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mapActionLabel",
      title: "Texto del enlace del mapa",
      type: "string",
      group: "content",
    }),
    heroPositionField,
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
    defineField({
      name: "image",
      title: "Imagen",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    // El paso de bienvenida no tiene `title` sino `titleLines`, así que sin
    // esto la lista mostraba su clave técnica ("intro-0") en vez del titular.
    select: {
      title: "title",
      titleLines: "titleLines",
      key: "key",
      media: "image",
    },
    prepare: ({ title, titleLines, key, media }) => ({
      title: title || titleLines?.join(" ") || key,
      subtitle: key,
      media,
    }),
  },
});

/**
 * Las pantallas de cierre: confirmación de la solicitud del carrito y las dos
 * de agradecimiento.
 *
 * Solo contenido. El carrito, el envío, los estados y la validación se quedan
 * en el código: aquí no hay nada que pueda romper un flujo.
 */
export const confirmationPages = defineType({
  name: "confirmationPages",
  title: "Página · Confirmación y gracias",
  type: "document",
  groups: [
    { name: "content", title: "Confirmación", default: true },
    { name: "pickup", title: "Recogida en el estudio" },
    { name: "thanks", title: "Pantallas de gracias" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titular",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "orderDataTitle",
      title: "Rótulo de la columna de datos",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "fieldLabels",
      title: "Rótulos de los campos",
      type: "orderFieldLabels",
      group: "content",
      description:
        "Solo el texto que se ve. La clave interna de cada campo y sus validaciones siguen en el código: cambiar un rótulo aquí no puede romper el formulario.",
    }),
    defineField({
      name: "delivery",
      title: "Método de entrega",
      type: "deliveryLabels",
      group: "content",
    }),
    defineField({
      name: "shippingNote",
      title: "Aviso de gastos de envío",
      type: "text",
      rows: 3,
      group: "content",
      description: "Aparece bajo los campos de la entrega a domicilio.",
    }),
    defineField({
      name: "submitLabel",
      title: "Botón de envío",
      type: "string",
      group: "content",
      description: "Solo el texto. Lo que hace el botón no cambia.",
    }),
    defineField({
      name: "studioName",
      title: "Nombre del estudio (recogida en tienda)",
      type: "string",
      group: "pickup",
      description:
        "El bloque que aparece al elegir «Recoger en el estudio». La dirección y el enlace de Maps salen de Ajustes del sitio.",
    }),
    defineField({
      name: "studioHours",
      title: "Horario (recogida en tienda)",
      type: "string",
      group: "pickup",
    }),
    defineField({
      name: "studioNote",
      title: "Instrucciones adicionales",
      type: "text",
      rows: 3,
      group: "pickup",
      description: "Opcional. Si lo dejas vacío no aparece nada.",
    }),
    defineField({
      name: "studioDirections",
      title: "Cómo llegar",
      type: "directionsLink",
      group: "pickup",
    }),
    defineField({
      name: "cartThanks",
      title: "Gracias · solicitud del Shop",
      type: "thanksScreen",
      group: "thanks",
    }),
    defineField({
      name: "formThanks",
      title: "Gracias · formulario de proyecto",
      type: "thanksScreen",
      group: "thanks",
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Página · Confirmación y gracias" }) },
});

/**
 * Cómo llegar: el enlace bajo el bloque de recogida en el estudio.
 *
 * No reutiliza `link` porque aquí el destino es opcional: dejándolo vacío cae
 * en el enlace de Maps que los ajustes globales ya calculan a partir de la
 * dirección del estudio, y así no hay dos direcciones que desincronizar.
 */
export const directionsLink = defineType({
  name: "directionsLink",
  title: "Cómo llegar",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Texto del enlace", type: "string" }),
    defineField({
      name: "href",
      title: "Destino",
      type: "url",
      description:
        "Opcional. Vacío = se usa el enlace de Google Maps de la dirección del estudio, en Ajustes del sitio.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

/**
 * Los rótulos del formulario de confirmación, uno por campo.
 *
 * Van como objeto de claves fijas y no como array editable: el formulario
 * tiene exactamente estos campos, los fija Zod, y una lista abierta invitaría
 * a añadir rótulos que no pintan nada o a borrar el de un campo que sí existe.
 */
export const orderFieldLabels = defineType({
  name: "orderFieldLabels",
  title: "Rótulos de los campos",
  type: "object",
  options: { columns: 2 },
  fields: [
    defineField({ name: "name", title: "Nombre y apellidos", type: "string" }),
    defineField({ name: "taxId", title: "DNI/NIE o NIF", type: "string" }),
    defineField({ name: "email", title: "Correo electrónico", type: "string" }),
    defineField({ name: "phone", title: "Teléfono", type: "string" }),
    defineField({ name: "address", title: "Dirección", type: "string" }),
    defineField({
      name: "postalCode",
      title: "Código postal",
      type: "string",
    }),
    defineField({ name: "city", title: "Ciudad", type: "string" }),
    defineField({ name: "province", title: "Provincia", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Rótulos de los campos" }) },
});

/**
 * El selector de entrega. Los identificadores internos ("domicilio" y
 * "recogida") no están aquí a propósito: los fija el código y son lo que
 * guarda el carrito. Aquí solo viaja el texto de cada opción.
 */
export const deliveryLabels = defineType({
  name: "deliveryLabels",
  title: "Método de entrega",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Rótulo", type: "string" }),
    defineField({ name: "subtitle", title: "Frase de apoyo", type: "string" }),
    defineField({
      name: "homeLabel",
      title: "Opción de entrega a domicilio",
      type: "string",
    }),
    defineField({
      name: "pickupLabel",
      title: "Opción de recogida en el estudio",
      type: "string",
    }),
  ],
  preview: { select: { title: "title", subtitle: "subtitle" } },
});

export const thanksScreen = defineType({
  name: "thanksScreen",
  title: "Pantalla de gracias",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Titular", type: "string" }),
    defineField({ name: "text", title: "Texto", type: "text", rows: 5 }),
    defineField({
      name: "backLabel",
      title: "Texto del enlace de vuelta",
      type: "string",
    }),
  ],
  preview: { select: { title: "title", subtitle: "text" } },
});
