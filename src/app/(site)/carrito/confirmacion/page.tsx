import type { Metadata } from "next";
import { ContactForm } from "@/features/carrito/ContactForm";
import type { ConfirmationCopy } from "@/features/carrito/types";
import type { ProductCardData } from "@/features/tienda/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  CART_PRODUCTS_QUERY,
  CONFIRMATION_PAGES_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import { toContactDetails } from "@/sanity/lib/contact";

export const revalidate = 3600;

export const metadata: Metadata = {
  // Pantalla transaccional: no aporta nada como resultado de búsqueda.
  // `follow` para que los enlaces que salen de aquí sí se rastreen.
  robots: { index: false, follow: true },
  title: "Información de contacto",
  description: "Camelia Shop — información de contacto y método de entrega.",
};

export default async function ConfirmacionPage() {
  // El catálogo se pide aquí también —igual que en /carrito— porque la
  // revisión del pedido enseña imagen y precio de cada línea, y ese dato no
  // vive en el carrito guardado (ver CartLineItem: el precio siempre se lee
  // fresco de Sanity, nunca del snapshot del navegador).
  const [confirmation, settings, products] = await Promise.all([
    sanityFetch<ConfirmationCopy | null>({
      query: CONFIRMATION_PAGES_QUERY,
      tags: ["confirmationPages"],
    }),
    sanityFetch<Parameters<typeof toContactDetails>[0] | null>({
      query: SITE_SETTINGS_QUERY,
      tags: ["siteSettings"],
    }),
    sanityFetch<ProductCardData[]>({
      query: CART_PRODUCTS_QUERY,
      tags: ["product"],
    }),
  ]);
  if (!settings) return null;

  // Solo cambia de dónde salen los textos: el formulario, su validación y el
  // envío siguen exactamente igual.
  return (
    <ContactForm
      copy={confirmation ?? {}}
      contact={toContactDetails(settings)}
      products={products}
    />
  );
}
