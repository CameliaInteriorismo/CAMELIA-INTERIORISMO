"use client";

import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { CartLineItem } from "@/features/carrito/CartLineItem";
import { useCartHasHydrated, useCartStore } from "@/stores/cartStore";

export function CartSummary() {
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
          Resumen del pedido
        </h1>

        <div className="divide-primary/15 mt-title divide-y">
          {items.map((item) => (
            <div key={item.id} className="py-title first:pt-0 last:pb-0">
              <CartLineItem item={item} />
            </div>
          ))}
        </div>

        <ButtonLink href="/carrito/confirmacion" className="mt-title w-full">
          CONTINUAR
        </ButtonLink>
      </Container>
    </section>
  );
}
