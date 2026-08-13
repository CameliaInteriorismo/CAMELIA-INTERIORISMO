import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductHero } from "@/features/tienda/ProductHero";
import { ProductGallery } from "@/features/tienda/ProductGallery";
import { RelatedProducts } from "@/features/tienda/RelatedProducts";
import type { Product } from "@/features/tienda/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PRODUCT_QUERY, PRODUCT_SLUGS_QUERY } from "@/sanity/lib/queries";
import { imageProps } from "@/sanity/lib/image";
import { metadataFrom, type SeoFields } from "@/sanity/lib/seo";

type ProductPageData = Product & { seo?: SeoFields };

/** Las rutas salen de Sanity: publicar una pieza le da su ficha sin código. */
/**
 * La página se sirve ya renderizada y se rehace, como mucho, una vez por
 * hora. El webhook de Sanity la caduca antes cuando publicas algo (ver
 * src/app/api/revalidate/route.ts), así que la hora es solo la red de
 * seguridad por si el aviso no llega.
 */
export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: PRODUCT_SLUGS_QUERY,
    tags: ["product"],
  });
  return slugs.map((slug) => ({ slug }));
}

/** Una pieza publicada después del despliegue se renderiza a la primera visita. */
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await sanityFetch<ProductPageData | null>({
    query: PRODUCT_QUERY,
    params: { slug },
    tags: ["product"],
  });
  if (!product) return {};

  return metadataFrom(product.seo, {
    title: product.name,
    description: `Camelia Shop — ${product.name}.`,
    image: imageProps(product.image)?.src,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // La consulta filtra por disponibilidad, así que una pieza desmarcada
  // devuelve null y aquí acaba en 404: deja de ser accesible por URL, aunque
  // el documento siga intacto en Sanity.
  const product = await sanityFetch<ProductPageData | null>({
    query: PRODUCT_QUERY,
    params: { slug },
    tags: ["product"],
  });
  if (!product) notFound();

  return (
    // Single closing pb here (rather than on each section) means the gap
    // before the footer is always exactly 100px regardless of which of
    // Gallery/Info/Related actually render for this product.
    <div className="pb-[100px]">
      <ProductHero product={product} />
      <ProductGallery product={product} />
      <RelatedProducts product={product} />
    </div>
  );
}
