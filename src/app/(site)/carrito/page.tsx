import type { Metadata } from "next";
import { CartSummary } from "@/features/carrito/CartSummary";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Camelia Shop — resumen de tu pedido.",
};

export default function CarritoPage() {
  return <CartSummary />;
}
