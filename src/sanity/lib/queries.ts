import { groq } from "next-sanity";

/**
 * Fragmento de imagen. Trae los metadatos que Sanity calcula al subir el
 * fichero: dimensiones (para que next/image reserve el hueco y la página no
 * dé saltos) y lqip (el difuminado de carga, gratis).
 */
/**
 * Lo que la web necesita de una imagen.
 *
 * `crop` y `hotspot` viajan a propósito: son el recorte y el punto de interés
 * que se ajustan en el Studio. Sin ellos aquí, ajustarlos en el panel no
 * cambiaba nada en la web, porque el dato nunca llegaba a salir de Sanity.
 */
const IMAGE = groq`{
  alt,
  crop,
  hotspot,
  asset->{ _id, metadata { lqip, dimensions } }
}`;

const SEO = groq`{ title, description, ogTitle, ogDescription, ogImage ${IMAGE} }`;

// --------------------------------------------------------------- proyectos

/** El listado. Solo lo que pinta la cuadrícula, nada más. */
export const PROJECTS_QUERY = groq`
  *[_type == "project" && defined(slug.current)] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    cardImage ${IMAGE}
  }
`;

/** Las rutas a prerenderizar. Un proyecto nuevo entra aquí solo. */
export const PROJECT_SLUGS_QUERY = groq`
  *[_type == "project" && defined(slug.current)].slug.current
`;

export const PROJECT_QUERY = groq`
  *[_type == "project" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    year,
    location,
    province,
    "services": services[]->title,
    paragraphs,
    heroVideo,
    "heroVideoFile": heroVideoFile.asset->url,
    heroImage ${IMAGE},
    galleryBlocks[] {
      _key,
      horizontal ${IMAGE},
      vertical1 ${IMAGE},
      vertical2 ${IMAGE}
    },
    seo ${SEO}
  }
`;

// --------------------------------------------------------------- productos

/**
 * `available != false` y no `available == true`: un producto creado antes de
 * que existiera el campo no lo tiene, y debe seguir viéndose. Solo se oculta
 * cuando alguien lo desmarca a conciencia.
 *
 * Desmarcar "Disponible" lo retira del listado, de las piezas relacionadas y
 * de su propia ficha, pero el documento sigue en Sanity: volver a marcarlo lo
 * devuelve a la web tal cual estaba.
 */
const AVAILABLE = `_type == "product" && defined(slug.current) && available != false`;

export const PRODUCTS_QUERY = groq`
  *[${AVAILABLE}] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    price,
    available,
    "category": category->title,
    image ${IMAGE},
    // Los acabados los necesita la tarjeta del listado: al pasar el cursor
    // asoma su muestrario y elegir uno cambia la foto sin entrar en la ficha.
    // El componente ya lo hacía; lo que faltaba era el dato.
    finishes[] { _key, name, color, images[] ${IMAGE} }
  }
`;

export const PRODUCT_SLUGS_QUERY = groq`
  *[${AVAILABLE}].slug.current
`;

export const PRODUCT_QUERY = groq`
  *[${AVAILABLE} && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    price,
    available,
    description,
    "category": category->title,
    image ${IMAGE},
    gallery[] ${IMAGE},
    finishes[] { _key, name, color, images[] ${IMAGE} },
    details,
    seo ${SEO},
    // Piezas de la misma categoría, sin incluirse a sí misma.
    "related": *[${AVAILABLE} && category._ref == ^.category._ref && slug.current != $slug] | order(order asc) {
      _id, name, "slug": slug.current, price, image ${IMAGE}
    }
  }
`;

/** Categorías presentes en el catálogo, para el filtro del Shop. */
export const PRODUCT_CATEGORIES_QUERY = groq`
  *[_type == "productCategory"] | order(order asc) {
    "title": title,
    "count": count(*[_type == "product" && available != false && references(^._id)])
  }[count > 0].title
`;

// -------------------------------------------------------------------- blog

export const POSTS_QUERY = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    titleLines,
    subtitle,
    "slug": slug.current,
    publishedAt,
    image ${IMAGE}
  }
`;

export const POST_SLUGS_QUERY = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`;

export const POST_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    titleLines,
    subtitle,
    "slug": slug.current,
    publishedAt,
    author,
    categories,
    image ${IMAGE},
    leadImage ${IMAGE},
    body[] {
      ...,
      _type == "galleryPair" => { _type, _key, left ${IMAGE}, right ${IMAGE} },
      _type == "gallerySingle" => { _type, _key, image ${IMAGE} }
    },
    seo ${SEO}
  }
`;

/**
 * El artículo anterior y el siguiente, por fecha.
 *
 * A propósito NO da la vuelta: en los extremos, el vecino que falta es lo que
 * hace que la ficha ofrezca "Volver" en vez de devolver al lector al primer
 * artículo en silencio. Mismo criterio que tenía getAdjacentPosts.
 */
export const ADJACENT_POSTS_QUERY = groq`{
  "previous": *[_type == "post" && publishedAt > $publishedAt] | order(publishedAt asc)[0] {
    title, titleLines, "slug": slug.current
  },
  "next": *[_type == "post" && publishedAt < $publishedAt] | order(publishedAt desc)[0] {
    title, titleLines, "slug": slug.current
  }
}`;

/**
 * El catálogo que necesita el carrito para poner precio y descripción a cada
 * línea. Sin filtro de disponibilidad a propósito: si una pieza se retira
 * mientras alguien la tiene en el carrito, la línea debe seguir mostrando su
 * información en vez de quedarse coja.
 */
export const CART_PRODUCTS_QUERY = groq`
  *[_type == "product" && defined(slug.current)] {
    _id, name, "slug": slug.current, price, description, image ${IMAGE}
  }
`;

// ----------------------------------------------------------------- páginas

export const ESTUDIO_PAGE_QUERY = groq`
  *[_id == "estudioPage"][0] {
    title,
    sections[] {
      _key, title, subtitle, paragraphs,
      blocks[] { _key, heading, paragraphs },
      image ${IMAGE}
    },
    seo ${SEO}
  }
`;

export const METODOLOGIA_PAGE_QUERY = groq`
  *[_id == "metodologiaPage"][0] {
    title,
    heroImage ${IMAGE},
    heroImagePosition,
    processTitle,
    process[] { _key, label, title, paragraphs, image ${IMAGE} },
    experienceTitle,
    experience[] { _key, title, paragraphs, imageRight, image ${IMAGE} },
    seo ${SEO}
  }
`;

export const SERVICIOS_PAGE_QUERY = groq`
  *[_id == "serviciosPage"][0] {
    title,
    heroImage ${IMAGE},
    heroImagePosition,
    // Los servicios se resuelven por referencia: su texto e imagen se editan
    // en el propio servicio, no aquí, así que no hay dos versiones.
    "phases": phases[]-> { _id, title, longDescription, image ${IMAGE} },
    introTitle, introText, phasesTitle,
    accompanimentTitle,
    accompaniment[] { _key, question, answer, image ${IMAGE} },
    cta { title, text, button, image ${IMAGE} },
    faqTitle,
    faq[] { _key, question, answer },
    seo ${SEO}
  }
`;

export const HOME_PAGE_QUERY = groq`
  *[_id == "homePage"][0] {
    heroVideo,
    "heroVideoFile": heroVideoFile.asset->url,
    heroImage ${IMAGE},
    heroLogo ${IMAGE},
    animatedPhrases,
    servicesTitle,
    servicesCta,
    "services": services[]-> {
      _id, title, shortDescription,
      "image": homeImage ${IMAGE}
    },
    detailTitle,
    // El nombre y el enlace salen del proyecto; la foto es propia de la Home.
    // Los destacados salen solos de los proyectos marcados como tales: la
    // fuente de verdad es el campo del proyecto, no una lista aparte que
    // había que mantener a mano y podía discrepar de él —y discrepaba.
    "featuredProjects": *[
      _type == "project" && featured == true && defined(slug.current)
    ] | order(order asc) {
      "_key": _id,
      name,
      "slug": slug.current,
      "image": homeImage ${IMAGE}
    },
    testimonialsTitle,
    // Las ocultas se descartan aquí, no en el componente: una reseña retirada
    // desde el panel deja de viajar al navegador en vez de llegar y esconderse.
    //
    // El filtro va sobre la REFERENCIA (@->), antes de resolverla. Filtrar
    // después de proyectar no vale: en ese punto el campo visible ya no está
    // entre los campos y la lista se llena de huecos nulos.
    "testimonials": testimonials[@->visible != false]-> {
      _id, quote, author, source, rating
    },
    cta { title, text, button, image ${IMAGE} },
    "partners": partners[]-> { _id, name, size, logo ${IMAGE} },
    seo ${SEO}
  }
`;

/** Cabecera e intro de las páginas de listado. */
export const PROYECTOS_PAGE_QUERY = groq`
  *[_id == "proyectosPage"][0] {
    title, heroImage ${IMAGE}, heroImagePosition,
    introTitle, introText,
    cta { title, text, button, image ${IMAGE} },
    seo ${SEO}
  }
`;

/** Los datos globales: barra, pie, contacto y redes. */
export const SITE_SETTINGS_QUERY = groq`
  *[_id == "siteSettings"][0] {
    siteName,
    email, phone, phoneHref,
    addressStreet, addressFloor, addressLocality,
    openingHours,
    navLinks[] { _key, label, href },
    headerCta,
    menuLabel, cartLabel, loadingLabel,
    footerTagline,
    footerNavTitle, footerContactTitle, footerScheduleTitle,
    footerColumns[] { _key, title, links[] { _key, label, href } },
    footerLegalLinks[] { _key, label, href },
    copyright,
    socials[] { _key, label, url, "icon": icon ${IMAGE}, "iconMenu": iconMenu ${IMAGE} },
    defaultSeo ${SEO}
  }
`;

export const CONTACT_PAGE_QUERY = groq`
  *[_id == "contactPage"][0] {
    title,
    heroImage ${IMAGE},
    heroImagePosition,
    cards[] { _key, kind, title, actionLabel },
    mapTitle, mapLead, mapText, mapAddressLabel, mapActionLabel,
    mapImage ${IMAGE},
    seo ${SEO}
  }
`;

/**
 * Un documento legal completo.
 *
 * Se pide el árbol entero, con sub-apartados incluidos. La estructura del
 * schema es la misma que ya sabe pintar LegalDocument.tsx —párrafos con
 * enlaces, listas, tablas etiqueta/valor, líneas pegadas y sub-apartados—,
 * así que no hay conversión de formato por medio y no se puede perder nada.
 *
 * Lo único que se traduce es el nombre del tipo: Sanity los llama
 * "legalText", "legalList"… y el componente espera "text", "list"… Se hace
 * aquí, en la consulta, para no tocar el renderizador.
 */
const BLOCK_TYPE = groq`
  "type": select(
    _type == "legalText" => "text",
    _type == "legalList" => "list",
    _type == "legalDetails" => "details",
    _type == "legalLines" => "lines",
    _type == "legalSubsection" => "subsection",
    _type
  )
`;

/** Los campos comunes. `items` va sin proyectar: en una lista son textos y
 *  en un bloque de líneas son objetos, y proyectarlo rompería uno de los dos. */
const LEGAL_BLOCK_FIELDS = groq`
  _key,
  ${BLOCK_TYPE},
  paragraphs,
  links[] { text, href },
  items,
  entries[] { label, value, href },
  title
`;

export const LEGAL_DOCUMENT_QUERY = groq`
  *[_type == "legalDocument" && slug.current == $slug][0] {
    title,
    lead,
    sections[] {
      _key, number, title,
      blocks[] {
        ${LEGAL_BLOCK_FIELDS},
        // Los sub-apartados anidan un nivel más de los mismos bloques.
        blocks[] { ${LEGAL_BLOCK_FIELDS} }
      }
    },
    seo ${SEO}
  }
`;

/**
 * Los textos del formulario de proyecto. La estructura (tipo de pantalla,
 * clave de cada respuesta, validación) vive en el código: aquí solo viaja lo
 * que se lee. Ver features/formulario/mergeSteps.ts.
 */
export const PROJECT_FORM_QUERY = groq`
  *[_id == "projectFormPage"][0] {
    steps[] {
      key, title, titleLines, paragraphs, help, helpBold, placeholder, cta,
      options,
      fieldLabels[] { name, label, placeholder },
      groupLabels[] { name, label, options },
      image ${IMAGE}
    },
    seo ${SEO}
  }
`;

/** Las pantallas de cierre: confirmación del carrito y las dos de gracias. */
export const CONFIRMATION_PAGES_QUERY = groq`
  *[_id == "confirmationPages"][0] {
    title,
    orderDataTitle,
    fieldLabels { name, taxId, email, phone, address, postalCode, city, province },
    delivery { title, subtitle, homeLabel, pickupLabel },
    shippingNote,
    submitLabel,
    studioName,
    studioHours,
    studioNote,
    studioDirections { label, href },
    cartThanks { title, text, backLabel },
    formThanks { title, text, backLabel }
  }
`;

/** Los rótulos de /carrito. Solo texto: el carrito en sí vive en el cliente. */
export const CART_PAGE_QUERY = groq`
  *[_id == "cartPage"][0] {
    title,
    taxNote,
    quantityLabel,
    notesLabel,
    notesPlaceholder,
    continueLabel,
    emptyText,
    emptyActionLabel
  }
`;

/** Cabecera y rótulos del Shop. */
export const TIENDA_PAGE_QUERY = groq`
  *[_id == "tiendaPage"][0] {
    title,
    heroImage ${IMAGE},
    heroImagePosition,
    gridTitle,
    filterLabel,
    sortLabel,
    sortOptions { destacados, recientes, precioAsc, precioDesc, nombreAsc },
    taxNote,
    addToCartLabel,
    addedLabel,
    relatedTitle,
    detailLabels { detallesDeLaPieza, materialesYMedidas, envioYEntrega }
  }
`;
