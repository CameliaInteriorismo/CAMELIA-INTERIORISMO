import Image from "next/image";
import { Grid } from "@/components/layout/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { getProduct } from "@/features/tienda/data";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/utils/formatPrice";
import type { CartItem } from "@/types/cart";

export function CartLineItem({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateNotes = useCartStore((state) => state.updateNotes);
  const product = getProduct(item.slug);

  return (
    <Grid>
      <div className="col-span-12 md:col-span-3">
        <div className="relative aspect-square w-full overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 25vw, 100vw"
            />
          ) : (
            <PlaceholderImage
              aspectRatio="1 / 1"
              label={`${item.title} — sin foto en Diseño/`}
              className="w-full"
            />
          )}
        </div>
      </div>

      <div className="mt-block col-span-12 md:col-span-8 md:col-start-5 md:mt-0">
        <h2 className="font-title text-primary text-2xl uppercase">
          {item.title}
        </h2>

        {product?.description && (
          <p className="text-primary/75 mt-sm text-sm leading-relaxed">
            {product.description}
          </p>
        )}

        {product?.price !== undefined && (
          <p className="text-primary mt-sm text-base">
            {formatPrice(product.price * item.quantity)}{" "}
            <span className="text-primary/60 text-xs italic">IVA incluido</span>
          </p>
        )}

        <div className="mt-title flex flex-wrap items-start gap-8">
          <div>
            <p className="text-primary mb-2 text-sm">Cantidad</p>
            {/* min=0 (not the stepper's default 1): reaching 0 is the
                only way to remove a line — there's no separate delete
                button — and cartStore.updateQuantity drops the item at
                <= 0, so the row unmounts and totals re-derive on their
                own. */}
            <QuantityStepper
              value={item.quantity}
              min={0}
              onChange={(quantity) => updateQuantity(item.id, quantity)}
            />
          </div>
          <div className="min-w-52 flex-1">
            <p className="text-primary mb-2 text-sm">Observaciones</p>
            <input
              type="text"
              value={item.notes ?? ""}
              onChange={(event) => updateNotes(item.id, event.target.value)}
              placeholder="Texto"
              className="border-primary/30 text-primary placeholder:text-primary/40 h-11 w-full border px-4 text-sm"
            />
          </div>
        </div>
      </div>
    </Grid>
  );
}
