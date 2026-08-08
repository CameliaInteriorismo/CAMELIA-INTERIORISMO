import type { Metadata } from "next";
import { RequestSent } from "@/features/carrito/RequestSent";

// No `icons` override here on purpose: the browser favicon stays the
// site-wide vino mark on every route without exception. The orange lockup
// on this screen is only ever artwork inside the page itself (the wordmark
// and the camellia), never the tab icon.
export const metadata: Metadata = {
  title: "Solicitud enviada",
  description: "Camelia — hemos recibido tu solicitud.",
};

export default function GraciasPage() {
  return <RequestSent />;
}
