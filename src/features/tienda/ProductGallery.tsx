import Image from "next/image";
import { Container } from "@/components/layout/Container";
import type { Product } from "@/features/tienda/types";
import { imageProps } from "@/sanity/lib/image";

// Renders nothing until a product actually has extra shots — no
// placeholder boxes here, since the brief only calls for this section
// "debajo de la imagen principal" once there's something real to show.
export function ProductGallery({ product }: { product: Product }) {
  if (!product.gallery || product.gallery.length === 0) return null;

  return (
    <section className="mt-title">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {product.gallery.map((source, index) => {
            const image = imageProps(source);
            if (!image) return null;
            return (
              <div
                key={image.src}
                className="relative aspect-[4/5] w-full overflow-hidden"
              >
                <Image
                  src={image.src}
                  alt={image.alt || `${product.name} — imagen ${index + 2}`}
                  fill
                  placeholder={image.blurDataURL ? "blur" : undefined}
                  blurDataURL={image.blurDataURL}
                  className="object-cover"
                  style={{ objectPosition: image.objectPosition }}
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
