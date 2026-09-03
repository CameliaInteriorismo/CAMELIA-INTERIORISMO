# Cómo restaurar el blog

Copia de seguridad hecha al quitar el blog de la web (petición explícita:
"lo quitamos por completo... guarda una copia del formato porque si en algún
momento se vuelve a poner sería igual que el que hay ahora").

**Lo que NO hizo falta tocar, porque nunca se borró:**
- Los 2 documentos `post` existentes en Sanity — intactos en el dataset.
- El documento singleton `blogPage` — intacto en el dataset.
- Los tipos de esquema `post` y `blogPage` (`sanity/schemaTypes/documents/post.ts`
  y la definición `blogPage` en `sanity/schemaTypes/singletons/pages.ts`) —
  siguen registrados en `sanity/schemaTypes/index.ts`. Se hizo así a propósito:
  si se quita el registro del esquema mientras existen documentos de ese tipo,
  Sanity Studio los marca como "Unknown type". Dejarlo registrado es gratis y
  evita ese aviso.
- El campo `navLinks`/`footerColumns` de `siteSettings` sigue existiendo con
  su forma de siempre; solo se quitó la ENTRADA "Blog" del array (ver abajo).

**Lo que SÍ se quitó del código y está copiado aquí:**
- `app/blog/page.tsx` y `app/blog/[slug]/page.tsx` → rutas de Next
- `features/blog/*.tsx` y `data.ts` → componentes
- `schemaTypes/post.ts` → una copia de referencia (el original SIGUE en
  `sanity/schemaTypes/documents/post.ts`, esto es solo por si algún día ese
  también hay que tocarlo)

## Para volver a poner el blog

1. Copiar de vuelta:
   - `content-backup/blog-backup/app/blog/` → `src/app/(site)/blog/`
   - `content-backup/blog-backup/features/blog/` → `src/features/blog/`

2. En `src/sanity/lib/queries.ts`, reinsertar (justo antes del comentario
   "El catálogo que necesita el carrito..."):

```ts
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
```

3. En `src/sanity/lib/fetch.ts`, en el tipo `SanityTag`, reinsertar
   `| "post"` y `| "blogPage"` (estaban entre `"service"` y `"partner"`, y
   entre `"tiendaPage"` y `"contactPage"` respectivamente).

4. En `src/sanity/lib/revalidation.ts`, reinsertar en `MAP`:

```ts
  post: {
    tags: ["post"],
    paths: [page("/blog"), page("/blog/[slug]")],
  },
```
   (iba justo después de la entrada `product`), y:
```ts
  blogPage: { tags: ["blogPage"], paths: [page("/blog")] },
```
   (iba justo después de `tiendaPage`). Además, en `SITE_SETTINGS.tags`,
   volver a añadir `"post"` (después de `"product"`) y `"blogPage"`
   (después de `"tiendaPage"`).

5. En `src/app/sitemap.ts`:
   - Volver a añadir `"/blog"` a `ESTATICAS` (iba después de `"/tienda"`).
   - En `SLUGS`, volver a añadir `"articulos": *[_type == "post" && defined(slug.current)].slug.current`.
   - En `sanityFetch(...)`, añadir `"post"` a `tags: [...]`.
   - En `rutas`, volver a añadir `...(articulos ?? []).map((s) => \`/blog/${s}\`)`.

6. En `src/components/seo/JsonLd.tsx`, reinsertar la función (iba después de
   `sitioWeb()`):

```ts
export function articulo(post: {
  title: string;
  slug: string;
  subtitle?: string;
  publishedAt?: string;
  author?: string;
  imagen?: string;
}) {
  return limpio({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.subtitle,
    image: post.imagen,
    datePublished: post.publishedAt,
    // Organización, no persona: los artículos los firma el estudio, no una
    // persona concreta. El campo `author` de Sanity está hoy vacío en los dos
    // artículos, así que se declara el estudio; si algún día se rellena en el
    // panel, ese valor manda.
    author: {
      "@type": "Organization",
      name: post.author || "Camelia Interiorismo",
    },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    url: absoluteUrl(`/blog/${post.slug}`),
  });
}
```

7. En `sanity/structure.ts`, reinsertar en el menú de "Ajustes de páginas":
```ts
              singleton(S, "blogPage", "Blog"),
```
   (iba después de `tiendaPage`), y en el árbol principal:
```ts
      S.documentTypeListItem("post").title("Blog"),
```
   (iba después de `product`).

8. En Sanity Studio, en Ajustes del sitio → Navegación (y en la columna del
   pie), volver a añadir el enlace "Blog" → `/blog`. No hace falta tocar
   ningún esquema para esto: es solo rellenar el campo, igual que cualquier
   otro enlace del menú.

9. `npx tsc --noEmit` y probar `/blog` y `/blog/[un-slug-real]` en local
   antes de dar por bueno.

Los 2 documentos `post` y el documento `blogPage` nunca se tocaron — en
cuanto las rutas vuelvan, deberían aparecer con su contenido de siempre.
