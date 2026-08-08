import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/features/tienda/ProductCard";
import { getRelatedProducts, type Product } from "@/features/tienda/data";

export function RelatedProducts({ product }: { product: Product }) {
  const related = getRelatedProducts(product);
  if (related.length === 0) return null;

  return (
    <section className="mt-title">
      <Container>
        <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
          Productos relacionados
        </h2>
        <div className="mt-title grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
