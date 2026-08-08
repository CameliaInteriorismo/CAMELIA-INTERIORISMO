import type { Metadata } from "next";
import { PageHeader } from "@/features/tienda/PageHeader";
import { ProductsGrid } from "@/features/tienda/ProductsGrid";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Camelia — piezas y objetos seleccionados para vestir y completar tus espacios.",
};

export default function TiendaPage() {
  return (
    <>
      <PageHeader />
      <ProductsGrid />
    </>
  );
}
