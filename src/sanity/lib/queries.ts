import { groq } from "next-sanity";

/**
 * Fragmento de imagen. Trae los metadatos que Sanity calcula al subir el
 * fichero: dimensiones (para que next/image reserve el hueco y la página no
 * dé saltos) y lqip (el difuminado de carga, gratis).
 */
const IMAGE = groq`{
  alt,
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
    heroImage ${IMAGE},
    gallery {
      imageA ${IMAGE},
      pair1Left ${IMAGE},
      pair1Right ${IMAGE},
      imageB ${IMAGE},
      pair2Left ${IMAGE},
      pair2Right ${IMAGE}
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
    image ${IMAGE}
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
    finishes[] { _key, name, color, image ${IMAGE} },
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
