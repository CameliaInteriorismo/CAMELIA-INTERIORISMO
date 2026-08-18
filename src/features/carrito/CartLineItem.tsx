import Image from "next/image";
import { Grid } from "@/components/layout/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import type { CartCopy } from "@/features/carrito/types";
import type { ProductCardData } from "@/features/tienda/types";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/utils/formatPrice";
import type { CartItem } from "@/types/cart";

/**
 * El precio y la descripción vienen del catálogo vivo de Sanity, no del
 * snapshot guardado en el carrito: así una pieza que cambia de precio se
 * muestra actualizada aunque lleve semanas en el carrito de alguien.
 *
 * `product` puede faltar —pieza retirada o marcada como no disponible— y la
 * línea sigue mostrándose con su título e imagen guardados, sin importe. Es
 * el mismo comportamiento tolerante que ya tenía.
 */
export function CartLineItem({
  item,
  product,
  copy = {},
}: {
  item: CartItem;
  product?: ProductCardData & { description?: string };
  copy?: CartCopy;
}) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateNotes = useCartStore((state) => state.updateNotes);

  return (
    <Grid>
      {/* 4 columnas en vez de 3: la foto pasa de ~250 a ~340px y la línea
          deja de leerse como una miniatura con texto al lado. */}
      <div className="col-span-12 md:col-span-4">
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

      <div className="mt-block col-span-12 md:col-span-7 md:col-start-6 md:mt-0 md:flex md:flex-col md:justify-center">
        <h2 className="font-title text-primary text-2xl">{item.title}</h2>

        {product?.description && (
          <p className="text-primary/75 mt-sm text-sm leading-relaxed">
            {product.description}
          </p>
        )}

        {product?.price !== undefined && (
          <p className="text-primary mt-sm text-base">
            {formatPrice(product.price * item.quantity)}{" "}
            <span className="text-primary/60 text-xs italic">
              {copy.taxNote ?? "IVA incluido"}
            </span>
          </p>
        )}

        <div className="mt-block flex flex-wrap items-start gap-10">
          <div>
            <p className="text-primary mb-2 text-sm">
              {copy.quantityLabel ?? "Cantidad"}
            </p>
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
          <div className="min-w-64 flex-1">
            <p className="text-primary mb-2 text-sm">
              {copy.notesLabel ?? "Observaciones"}
            </p>
            <input
              type="text"
              value={item.notes ?? ""}
              onChange={(event) => updateNotes(item.id, event.target.value)}
              placeholder={copy.notesPlaceholder ?? "Texto"}
              className="border-primary/30 text-primary placeholder:text-primary/40 h-11 w-full border px-4 text-sm"
            />
          </div>
        </div>
      </div>
    </Grid>
  );
}
