import type { Metadata } from "next";
import { PageHeader } from "@/features/metodologia/PageHeader";
import { ProcesoTabs } from "@/features/metodologia/ProcesoTabs";
import { ExperienciaScroll } from "@/features/metodologia/ExperienciaScroll";

export const metadata: Metadata = {
  title: "Metodología",
  description:
    "Camelia — nuestro proceso de trabajo, del primer contacto a la entrega, y cómo acompañamos al cliente durante todo el camino.",
};

export default function MetodologiaPage() {
  return (
    <>
      <PageHeader />
      <ProcesoTabs />
      <ExperienciaScroll />
    </>
  );
}
