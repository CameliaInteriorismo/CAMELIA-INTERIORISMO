import type { Metadata } from "next";
import { RequestSent } from "@/features/carrito/RequestSent";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CONFIRMATION_PAGES_QUERY } from "@/sanity/lib/queries";
import type { ThanksContent } from "@/features/carrito/RequestSent";

export const revalidate = 3600;

// No `icons` override here on purpose: the browser favicon stays the
// site-wide vino mark on every route without exception. The orange lockup
// on this screen is only ever artwork inside the page itself (the wordmark
// and the camellia), never the tab icon.
export const metadata: Metadata = {
  // Pantalla transaccional: no aporta nada como resultado de búsqueda.
  // `follow` para que los enlaces que salen de aquí sí se rastreen.
  robots: { index: false, follow: true },
  title: "Solicitud enviada",
  description: "Camelia — hemos recibido tu solicitud.",
};

export default async function GraciasPage() {
  const page = await sanityFetch<{ cartThanks?: ThanksContent } | null>({
    query: CONFIRMATION_PAGES_QUERY,
    tags: ["confirmationPages"],
  });
  return <RequestSent content={page?.cartThanks} />;
}
