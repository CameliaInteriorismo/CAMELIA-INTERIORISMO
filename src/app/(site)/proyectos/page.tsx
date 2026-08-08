import type { Metadata } from "next";
import { PageHeader } from "@/features/proyectos/PageHeader";
import { IntroSection } from "@/features/proyectos/IntroSection";
import { ProjectsGrid } from "@/features/proyectos/ProjectsGrid";
import { CtaBanner } from "@/features/proyectos/CtaBanner";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Camelia — proyectos de interiorismo con identidad propia. Descubre nuestros espacios diseñados a medida.",
};

export default function ProyectosPage() {
  return (
    <>
      <PageHeader />
      <IntroSection />
      <ProjectsGrid />
      <CtaBanner />
    </>
  );
}
