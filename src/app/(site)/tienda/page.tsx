import type { Metadata } from "next";
import { PageHeader } from "@/features/tienda/PageHeader";
import { ProductsGrid } from "@/features/tienda/ProductsGrid";
import type { ProductCardData, ShopCopy } from "@/features/tienda/types";
import type { SanityImageSource } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PRODUCTS_QUERY, TIENDA_PAGE_QUERY } from "@/sanity/lib/queries";
import { metadataFrom } from "@/sanity/lib/seo";

/**
 * La página se sirve ya renderizada y se rehace, como mucho, una vez por
 * hora. El webhook de Sanity la caduca antes cuando publicas algo (ver
 * src/app/api/revalidate/route.ts), así que la hora es solo la red de
 * seguridad por si el aviso no llega.
 */
export const revalidate = 3600;

const FALLBACK = {
  title: "Tienda de interiorismo | Camelia",
  description:
    "Descubre piezas de interiorismo y decoración seleccionadas por Camelia para completar y transformar tus espacios.",
};

/**
 * Pasa por `metadataFrom` como el resto de páginas: era la única que declaraba
 * su metadata a mano y por eso se quedaba sin Open Graph ni Twitter cards.
 * El título va en ABSOLUTO porque ya lleva la marca al final.
 *
 * "Tienda" y no "Shop": el rótulo de la sección sigue siendo Shop, pero en el
 * título buscamos la palabra que se busca.
 *
 * `generateMetadata`, no un objeto estático: `metadataFrom` ahora lee el
 * nombre del sitio de Sanity para el `og:site_name`, y eso ya no puede
 * resolverse en el momento en que se carga el módulo.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await metadataFrom(undefined, FALLBACK, "/tienda")),
    title: { absolute: FALLBACK.title },
  };
}

export default async function TiendaPage() {
  // La consulta ya descarta las piezas marcadas como no disponibles, así que
  // desmarcar "Disponible" en Sanity las retira del listado sin borrarlas.
  const [products, page] = await Promise.all([
    sanityFetch<ProductCardData[]>({
      query: PRODUCTS_QUERY,
      tags: ["product"],
    }),
    sanityFetch<
      | (ShopCopy & {
          title?: string;
          heroImage?: SanityImageSource;
          heroImagePosition?: string;
        })
      | null
    >({ query: TIENDA_PAGE_QUERY, tags: ["tiendaPage"] }),
  ]);

  return (
    <>
      <PageHeader
        title={page?.title}
        image={page?.heroImage}
        imagePosition={page?.heroImagePosition}
      />
      <ProductsGrid products={products} copy={page ?? {}} />
    </>
  );
}
