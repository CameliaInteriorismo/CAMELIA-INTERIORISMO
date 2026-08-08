export type PostBlock =
  | { type: "text"; paragraphs: string[] }
  | { type: "imagePair"; images: [string | undefined, string | undefined] };

const DIR = "/assets/blog";

export type BlogPost = {
  slug: string;
  title: string;
  /**
   * Where the headline breaks, set here rather than left to the container
   * width, so the listing and the post itself always split it at the same
   * editorial point — the way the rest of the site's headings are written
   * (see IntroSection's explicit two-line headings).
   */
  titleLines: string[];
  /** Standfirst under the lead image (Arizona, sentence case). */
  subtitle?: string;
  /** Card thumbnail on /blog and the lead image on the post itself. */
  image?: string;
  leadImage?: string;
  body: PostBlock[];
};

// Copy for "Volver a lo que permanece" is transcribed verbatim from
// Diseño/FICHA BLOG.png — the only post the designs spell out in full.
// "La importancia de la iluminación" appears in Diseño/BLOG.png as a title
// only, so its body stays empty rather than invented; the ficha renders
// whatever exists and simply omits the rest.
//
// No blog photography exists as a standalone asset (both references are
// flattened full-page mockups), so every image slot is left undefined and
// falls through to an explicit PlaceholderImage.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "volver-a-lo-que-permanece",
    title: "Volver a lo que permanece",
    titleLines: ["Volver a lo que", "permanece"],
    subtitle: "Más intención, menos tendencia",
    image: `${DIR}/Volver a lo que permanece.jpg`,
    leadImage: `${DIR}/Volver a lo que permanece foto principal.jpg`,
    body: [
      {
        type: "text",
        paragraphs: [
          "Durante años, el interiorismo ha estado muy marcado por la idea de reducir: menos elementos, menos color, menos presencia. Espacios limpios, casi silenciosos, donde todo parece contenido.",
          "Sin embargo, cada vez es más habitual encontrar una necesidad distinta. No tanto de añadir por añadir, sino de recuperar cierta riqueza en los espacios. Materiales que tengan presencia, combinaciones que aporten profundidad y decisiones que no respondan únicamente a una tendencia puntual.",
          "No se trata de “recargar”, sino de construir espacios con capas. Una moldura, un tejido con textura, una madera con veta visible o una combinación de colores bien medida no son excesos, son herramientas para dar carácter. Cuando estas decisiones se toman con criterio, el resultado no satura, sino que acompaña.",
          "En muchos proyectos, el miedo a equivocarse lleva a simplificar en exceso. Se elige lo neutro, lo seguro, lo que “no molesta”. Pero ese tipo de decisiones, aunque funcionan en el corto plazo, muchas veces dejan espacios que no terminan de sentirse propios.",
        ],
      },
      {
        type: "imagePair",
        images: [
          `${DIR}/Volver a lo que permanece foto 1.jpg`,
          `${DIR}/Volver a lo que permanece foto 2.jpg`,
        ],
      },
      {
        type: "text",
        paragraphs: [
          "Frente a eso, hay otra forma de trabajar: entender el espacio como algo que puede evolucionar, que admite matices y que puede reflejar mejor a quien lo habita. No desde lo llamativo, sino desde lo coherente.",
          "La combinación de materiales, patrones o colores no es una cuestión estética sin más. Es una forma de construir ambientes más completos, con más recorrido en el tiempo. Espacios que no dependen de una imagen inicial, sino que siguen funcionando con el paso de los años.",
          "Quizá el cambio no está en hacer más, sino en atreverse a hacer con más intención.",
        ],
      },
    ],
  },
  {
    slug: "la-importancia-de-la-iluminacion",
    title: "La importancia de la iluminación",
    titleLines: ["La importancia de la", "iluminación"],
    subtitle:
      "La luz no solo ilumina, transforma la forma de vivir un espacio",
    image: `${DIR}/La importancia de la iluminacion.jpg`,
    // Swapped with gallery image 1 — "foto 1" now leads the article and
    // "foto principal" has taken its place in the pair below. The file
    // names keep their original meaning, so only these two references move.
    leadImage: `${DIR}/La importancia de la iluminacion foto 1.jpg`,
    // Same shape as the first post — text, image pair, text — so both
    // fichas lay out identically.
    body: [
      {
        type: "text",
        paragraphs: [
          "La iluminación es uno de los elementos más determinantes en una vivienda, aunque muchas veces se resuelve al final del proyecto y sin el tiempo que realmente requiere.",
          "Entendemos la iluminación en dos niveles: una parte técnica, que garantiza que el espacio funcione correctamente, y una parte decorativa, que construye la atmósfera y define cómo se percibe el espacio.",
          "La iluminación técnica es la que permite usar la vivienda con comodidad en el día a día. Debe estar bien pensada, bien distribuida y responder a cada uso concreto. Sin embargo, por sí sola no es suficiente. Un espacio bien iluminado no siempre es un espacio agradable.",
        ],
      },
      {
        type: "imagePair",
        images: [
          `${DIR}/La importancia de la iluminacion foto principal.jpg`,
          `${DIR}/La importancia de la iluminacion foto 2.jpg`,
        ],
      },
      {
        type: "text",
        paragraphs: [
          "Ahí es donde entra la iluminación decorativa. Lámparas de sobremesa, de pie o puntos de luz más bajos que acompañan el espacio desde otra escala. Este tipo de iluminación introduce matices, genera profundidad y permite que la vivienda se perciba de una forma más cercana.",
          "En una vivienda, la temperatura de color juega un papel fundamental. Siempre trabajamos con luz cálida, evitando tonos fríos que distorsionan la percepción del espacio y lo vuelven más impersonal. En determinados puntos, como iluminación auxiliar, incluso buscamos temperaturas más cálidas, que aporten una sensación mayor de recogimiento.",
          "También es importante entender a qué altura se ilumina. No todo debe resolverse desde el techo. Trabajar la luz a la altura de los ojos permite construir ambientes más equilibrados y menos planos, donde la iluminación no solo cumple una función, sino que acompaña.",
          "Al final del día, la iluminación es lo que queda cuando todo se apaga. Es el momento en el que la casa pasa de ser un espacio funcional a un lugar de descanso. Por eso, más allá de iluminar, se trata de ayudar al cuerpo a entrar en un estado de calma, bajando la intensidad y creando una atmósfera más tranquila.",
          "Una buena iluminación no se nota, pero se siente. Y, muchas veces, es lo que realmente define cómo se vive un espacio.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/**
 * Deliberately does NOT wrap around: at either end of the series the
 * missing neighbour is what tells the ficha to offer "Volver" instead,
 * so the reader is never looped silently back to the first article.
 */
export function getAdjacentPosts(slug: string): {
  previous?: BlogPost;
  next?: BlogPost;
} {
  const index = BLOG_POSTS.findIndex((post) => post.slug === slug);
  if (index === -1) return {};
  return {
    previous: index > 0 ? BLOG_POSTS[index - 1] : undefined,
    next: index < BLOG_POSTS.length - 1 ? BLOG_POSTS[index + 1] : undefined,
  };
}
