import type { Metadata } from "next";
import { PageHeader } from "@/features/proyectos/PageHeader";
import { IntroSection } from "@/features/proyectos/IntroSection";
import {
  ProjectsGrid,
  type ProjectCard,
} from "@/features/proyectos/ProjectsGrid";
import { CtaBanner } from "@/features/proyectos/CtaBanner";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PROJECTS_QUERY, PROYECTOS_PAGE_QUERY } from "@/sanity/lib/queries";
import { metadataFrom, type SeoFields } from "@/sanity/lib/seo";
import type { CtaBannerData } from "@/features/shared/types";

/**
 * La página se sirve ya renderizada y se rehace, como mucho, una vez por
 * hora. El webhook de Sanity la caduca antes cuando publicas algo (ver
 * src/app/api/revalidate/route.ts), así que la hora es solo la red de
 * seguridad por si el aviso no llega.
 */
export const revalidate = 3600;

type ProyectosPage = {
  introTitle?: string;
  introText?: string;
  cta?: CtaBannerData;
  seo?: SeoFields;
};

const FALLBACK = {
  title: "Proyectos",
  description:
    "Camelia — proyectos de interiorismo con identidad propia. Descubre nuestros espacios diseñados a medida.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<ProyectosPage | null>({
    query: PROYECTOS_PAGE_QUERY,
    tags: ["proyectosPage"],
  });
  return metadataFrom(page?.seo, FALLBACK, "/proyectos");
}

export default async function ProyectosPage() {
  // Un proyecto publicado en Sanity entra aquí solo: la consulta no lleva
  // lista de slugs, trae todo lo que exista ordenado por `order`.
  const [projects, page] = await Promise.all([
    sanityFetch<ProjectCard[]>({ query: PROJECTS_QUERY, tags: ["project"] }),
    sanityFetch<ProyectosPage | null>({
      query: PROYECTOS_PAGE_QUERY,
      tags: ["proyectosPage"],
    }),
  ]);

  return (
    <>
      <PageHeader />
      <IntroSection title={page?.introTitle} text={page?.introText} />
      <ProjectsGrid projects={projects} />
      <CtaBanner cta={page?.cta} />
    </>
  );
}
