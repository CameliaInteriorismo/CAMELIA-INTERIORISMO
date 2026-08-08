import type { Metadata } from "next";
import { PageHeader } from "@/features/servicios/PageHeader";
import { ProjectPhases } from "@/features/servicios/ProjectPhases";
import { AccompanimentSection } from "@/features/servicios/AccompanimentSection";
import { CtaBanner } from "@/features/servicios/CtaBanner";
import { FaqSection } from "@/features/servicios/FaqSection";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Camelia — interiorismo, ejecución y supervisión de obra, y decoración. Descubre cómo podemos acompañarte en tu proyecto.",
};

export default function ServiciosPage() {
  return (
    <>
      <PageHeader />
      <ProjectPhases />
      <AccompanimentSection />
      <CtaBanner />
      <FaqSection />
    </>
  );
}
