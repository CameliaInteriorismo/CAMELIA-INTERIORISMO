"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { FinishSwatches } from "@/features/tienda/FinishSwatches";
import type { ProductCardData } from "@/features/tienda/types";
import { imageProps } from "@/sanity/lib/image";

export function ProductCard({ product }: { product: ProductCardData }) {
  const [finishIndex, setFinishIndex] = useState(0);
  const finish = product.finishes?.[finishIndex];
  // Un acabado sin foto propia mantiene la imagen base de la pieza, en vez
  // de dejar el hueco vacío al seleccionarlo.
  const activeImage = imageProps(finish?.images?.[0] ?? product.image);

  return (
    <Link href={`/tienda/${product.slug}`} className="group block">
      <div className="relative aspect-[5/6] w-full overflow-hidden">
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
                placeholder={activeImage.blurDataURL ? "blur" : undefined}
                blurDataURL={activeImage.blurDataURL}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                style={{ objectPosition: activeImage.objectPosition }}
                sizes="(min-width: 640px) 50vw, 100vw"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <PlaceholderImage
            aspectRatio="5 / 6"
            label={`${product.name} — sin foto`}
            className="w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}

        {/* Finishes reveal on hover — centered, generously spaced, and
            selecting one swaps the photo above immediately. */}
        {product.finishes && product.finishes.length > 0 && (
          <div className="bg-background/95 absolute inset-x-0 bottom-0 translate-y-full px-4 py-4 transition-transform duration-300 ease-out group-hover:translate-y-0">
            <FinishSwatches
              finishes={product.finishes}
              selected={finishIndex}
              onSelect={setFinishIndex}
            />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="font-title text-primary text-lg uppercase">
          {product.name}
        </h3>
        {product.price !== undefined && (
          <p className="text-primary shrink-0 text-base">{product.price} €</p>
        )}
      </div>
      {product.category && (
        <p className="text-primary/60 mt-0.5 text-xs">{product.category}</p>
      )}
    </Link>
  );
}
