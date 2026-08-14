"use client";

import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { CartLineItem } from "@/features/carrito/CartLineItem";
import { useCartHasHydrated, useCartStore } from "@/stores/cartStore";
import type { CartCopy } from "@/features/carrito/types";
import type { ProductCardData } from "@/features/tienda/types";

export function CartSummary({
  products = [],
  copy = {},
}: {
  products?: (ProductCardData & { description?: string })[];
  copy?: CartCopy;
}) {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartHasHydrated();

  // Avoids a flash of "carrito vacío" before the persisted store rehydrates
  // on the client.
  if (!hasHydrated) return null;

  if (items.length === 0) {
    return (
      <section className="pt-title pb-[100px]">
        <Container>
          <h1 className="font-title text-primary text-3xl uppercase md:text-4xl">
            Resumen del pedido
          </h1>
          <p className="text-primary/75 mt-block text-sm">
            Tu carrito está vacío.
          </p>
          <ButtonLink href="/tienda" className="mt-block">
            Ver productos
          </ButtonLink>
        </Container>
      </section>
    );
  }

  return (
    <section className="pt-title pb-[100px]">
      <Container>
        <h1 className="font-title text-primary text-3xl uppercase md:text-4xl">
          {copy.title ?? "Resumen del pedido"}
        </h1>

        {/* 72px por línea en vez de 60: con la foto a ~340px las filas
            necesitan más aire entre sí para no leerse comprimidas. */}
        <div className="divide-primary/15 mt-title divide-y">
          {items.map((item) => (
            <div key={item.id} className="py-[72px] first:pt-0 last:pb-0">
              <CartLineItem
                item={item}
                product={products.find((p) => p.slug === item.slug)}
                copy={copy}
              />
            </div>
          ))}
        </div>

        {/* Mismo aire que entre líneas, y 56px de alto en escritorio: es la
            acción principal de la página y a 44px quedaba menuda al pie de
            un bloque tan ancho. */}
        <ButtonLink
          href="/carrito/confirmacion"
          className="mt-[72px] w-full md:h-14"
        >
          {copy.continueLabel ?? "CONTINUAR"}
        </ButtonLink>
      </Container>
    </section>
  );
}
