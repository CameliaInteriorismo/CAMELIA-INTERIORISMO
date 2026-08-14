"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container, Grid } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { FinishSwatch } from "@/features/tienda/FinishSwatches";
import { ProductInfo } from "@/features/tienda/ProductInfo";
import type { Product, ShopCopy } from "@/features/tienda/types";
import { imageProps } from "@/sanity/lib/image";
import { useCartStore } from "@/stores/cartStore";

export function ProductHero({
  product,
  copy = {},
}: {
  product: Product;
  copy?: ShopCopy;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [finishIndex, setFinishIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  const finish = product.finishes?.[finishIndex];
  // Un acabado sin foto propia mantiene la imagen base de la pieza.
  const activeImage = imageProps(finish?.images?.[0] ?? product.image);

  function handleAddToCart() {
    addItem({
      id: product.slug,
      productId: product.slug,
      slug: product.slug,
      title: product.name,
      finish: finish?.name,
      image: activeImage?.src,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <section className="pt-title">
      <Container>
        <Grid>
          <div className="col-span-12 md:col-span-6">
            {/* 17/25, not the grid card's 4/5 — taller so this column
                can match the info column's height (title through the
                last accordion row) without cramming that column's own
                spacing. Re-check both if either side's content changes. */}
            <div className="relative aspect-[17/25] w-full overflow-hidden">
              {activeImage ? (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeImage.src}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeImage.src}
                      alt={activeImage.alt || product.name}
                      fill
                      priority
                      placeholder={activeImage.blurDataURL ? "blur" : undefined}
                      blurDataURL={activeImage.blurDataURL}
                      className="object-cover"
                      style={{ objectPosition: activeImage.objectPosition }}
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <PlaceholderImage
                  aspectRatio="17 / 25"
                  label={`${product.name} — sin foto`}
                  className="w-full"
                />
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-5 md:col-start-8">
            {product.category && (
              <p className="text-primary/60 text-sm tracking-wide uppercase">
                {product.category}
              </p>
            )}
            <h1 className="font-title text-primary mt-1 text-3xl md:text-4xl">
              {product.name}
            </h1>

            {product.price !== undefined && (
              <div className="mt-sm">
                <p className="text-primary text-xl">{product.price} €</p>
                <p className="text-primary/60 text-xs italic">
                  {copy.taxNote ?? "IVA incluido"}
                </p>
              </div>
            )}

            {product.description && (
              <p className="text-primary/75 mt-sm text-sm leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Circle left, name to its right, one row per finish —
                never name-under-circle (see FinishSwatches' row layout,
                used as-is here too, just stacked instead of side by side). */}
            {product.finishes && product.finishes.length > 0 && (
              <div className="mt-sm space-y-4">
                {product.finishes.map((f, index) => (
                  <div key={f.name} className="flex items-center gap-3">
                    <FinishSwatch
                      finish={f}
                      active={index === finishIndex}
                      onSelect={() => setFinishIndex(index)}
                      size="h-4 w-4"
                    />
                    <span
                      onClick={() => setFinishIndex(index)}
                      className="text-primary cursor-pointer text-sm"
                    >
                      {f.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-block flex items-center gap-4">
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <Button onClick={handleAddToCart} className="flex-1">
                {added
                  ? (copy.addedLabel ?? "AÑADIDO")
                  : (copy.addToCartLabel ?? "AÑADIR AL CARRITO")}
              </Button>
            </div>

            <ProductInfo product={product} copy={copy} />
          </div>
        </Grid>
      </Container>
    </section>
  );
}
