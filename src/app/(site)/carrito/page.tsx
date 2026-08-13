import type { Metadata } from "next";
import { CartSummary } from "@/features/carrito/CartSummary";
import type { ProductCardData } from "@/features/tienda/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CART_PRODUCTS_QUERY } from "@/sanity/lib/queries";

/**
 * La página se sirve ya renderizada y se rehace, como mucho, una vez por
 * hora. El webhook de Sanity la caduca antes cuando publicas algo (ver
 * src/app/api/revalidate/route.ts), así que la hora es solo la red de
 * seguridad por si el aviso no llega.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Carrito",
  description: "Camelia Shop — resumen de tu pedido.",
};

export default async function CarritoPage() {
  // El catálogo se resuelve en el servidor y se pasa al resumen: el carrito
  // guarda en el navegador solo el slug, la cantidad y un snapshot de título
  // e imagen, así que el precio y la descripción se leen aquí, frescos.
  const products = await sanityFetch<
    (ProductCardData & { description?: string })[]
  >({ query: CART_PRODUCTS_QUERY, tags: ["product"] });

  return <CartSummary products={products} />;
}
