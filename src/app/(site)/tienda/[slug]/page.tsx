import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductHero } from "@/features/tienda/ProductHero";
import { ProductGallery } from "@/features/tienda/ProductGallery";
import { RelatedProducts } from "@/features/tienda/RelatedProducts";
import { PRODUCTS, getProduct } from "@/features/tienda/data";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: `Camelia Shop — ${product.name}.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
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
