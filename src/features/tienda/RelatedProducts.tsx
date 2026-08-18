import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/features/tienda/ProductCard";
import type { Product, ShopCopy } from "@/features/tienda/types";

export function RelatedProducts({
  product,
  copy = {},
}: {
  product: Product;
  copy?: ShopCopy;
}) {
  // Las resuelve la propia consulta GROQ (misma categoría, sin incluirse a
  // sí misma y ya filtradas por disponibilidad).
  const related = product.related ?? [];
  if (related.length === 0) return null;

  return (
    <section className="mt-block">
      <Container>
        <h2 className="font-title text-primary text-3xl md:text-4xl">
          {copy.relatedTitle ?? "Productos relacionados"}
        </h2>
        <div className="mt-block grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
