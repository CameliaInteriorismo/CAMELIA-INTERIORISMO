import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectHeroTitle } from "@/features/proyecto-detalle/ProjectHeroTitle";
import { ProjectInfo } from "@/features/proyecto-detalle/ProjectInfo";
import { ProjectIntro } from "@/features/proyecto-detalle/ProjectIntro";
import { ProjectGallery } from "@/features/proyecto-detalle/ProjectGallery";
import { CtaBanner } from "@/features/proyectos/CtaBanner";
import {
  PROJECT_DETAILS,
  formatProjectLocation,
} from "@/features/proyecto-detalle/data";

export function generateStaticParams() {
  return Object.keys(PROJECT_DETAILS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECT_DETAILS[slug];
  if (!project) return {};

  return {
    title: `Proyecto ${project.name}`,
    description: `Camelia — proyecto de interiorismo ${project.name}.`,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECT_DETAILS[slug];
  if (!project) notFound();

  return (
    <>
      <ProjectHeroTitle
        name={project.name}
        heroVideo={project.heroVideo}
        heroImage={project.heroImage}
      />
      <ProjectInfo
        year={project.year}
        location={formatProjectLocation(project)}
        services={project.services}
      />
      <ProjectIntro paragraphs={project.paragraphs} />
      <ProjectGallery gallery={project.gallery} />
      <CtaBanner />
    </>
  );
}
