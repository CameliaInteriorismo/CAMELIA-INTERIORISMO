import type { Metadata } from "next";
import { PageHeader } from "@/features/proyectos/PageHeader";
import { IntroSection } from "@/features/proyectos/IntroSection";
import {
  ProjectsGrid,
  type ProjectCard,
} from "@/features/proyectos/ProjectsGrid";
import { CtaBanner } from "@/features/proyectos/CtaBanner";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";

/**
 * La página se sirve ya renderizada y se rehace, como mucho, una vez por
 * hora. El webhook de Sanity la caduca antes cuando publicas algo (ver
 * src/app/api/revalidate/route.ts), así que la hora es solo la red de
 * seguridad por si el aviso no llega.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Camelia — proyectos de interiorismo con identidad propia. Descubre nuestros espacios diseñados a medida.",
};

export default async function ProyectosPage() {
  // Un proyecto publicado en Sanity entra aquí solo: la consulta no lleva
  // lista de slugs, trae todo lo que exista ordenado por `order`.
  const projects = await sanityFetch<ProjectCard[]>({
    query: PROJECTS_QUERY,
    tags: ["project"],
  });

  return (
    <>
      <PageHeader />
      <IntroSection />
      <ProjectsGrid projects={projects} />
      <CtaBanner />
    </>
  );
}
