import type { Metadata } from "next";
import { ContactForm } from "@/features/carrito/ContactForm";

export const metadata: Metadata = {
  title: "Información de contacto",
  description: "Camelia Shop — información de contacto y método de entrega.",
};

export default function ConfirmacionPage() {
  return <ContactForm />;
}
