import type { Metadata } from "next";
import { PageHeader } from "@/features/tienda/PageHeader";
import { ProductsGrid } from "@/features/tienda/ProductsGrid";
import type { ProductCardData, ShopCopy } from "@/features/tienda/types";
import type { SanityImageSource } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PRODUCTS_QUERY, TIENDA_PAGE_QUERY } from "@/sanity/lib/queries";
import { absoluteUrl } from "@/lib/site";

/**
 * La página se sirve ya renderizada y se rehace, como mucho, una vez por
 * hora. El webhook de Sanity la caduca antes cuando publicas algo (ver
 * src/app/api/revalidate/route.ts), así que la hora es solo la red de
 * seguridad por si el aviso no llega.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/tienda") },
  title: "Shop",
  description:
    "Camelia — piezas y objetos seleccionados para vestir y completar tus espacios.",
};

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
