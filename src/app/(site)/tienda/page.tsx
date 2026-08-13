import type { Metadata } from "next";
import { PageHeader } from "@/features/tienda/PageHeader";
import { ProductsGrid } from "@/features/tienda/ProductsGrid";
import type { ProductCardData } from "@/features/tienda/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PRODUCTS_QUERY } from "@/sanity/lib/queries";

/**
 * La página se sirve ya renderizada y se rehace, como mucho, una vez por
 * hora. El webhook de Sanity la caduca antes cuando publicas algo (ver
 * src/app/api/revalidate/route.ts), así que la hora es solo la red de
 * seguridad por si el aviso no llega.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Camelia — piezas y objetos seleccionados para vestir y completar tus espacios.",
};

export default async function TiendaPage() {
  // La consulta ya descarta las piezas marcadas como no disponibles, así que
  // desmarcar "Disponible" en Sanity las retira del listado sin borrarlas.
  const products = await sanityFetch<ProductCardData[]>({
    query: PRODUCTS_QUERY,
    tags: ["product"],
  });

  return (
    <>
      <PageHeader />
      <ProductsGrid products={products} />
    </>
  );
}
