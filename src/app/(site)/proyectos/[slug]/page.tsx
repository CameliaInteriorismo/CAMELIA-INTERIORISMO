import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectHeroTitle } from "@/features/proyecto-detalle/ProjectHeroTitle";
import { ProjectInfo } from "@/features/proyecto-detalle/ProjectInfo";
import { ProjectIntro } from "@/features/proyecto-detalle/ProjectIntro";
import {
  ProjectGallery,
  type ProjectGalleryBlock,
} from "@/features/proyecto-detalle/ProjectGallery";
import { CtaBanner } from "@/features/proyectos/CtaBanner";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  PROJECT_QUERY,
  PROJECT_SLUGS_QUERY,
  PROYECTOS_PAGE_QUERY,
} from "@/sanity/lib/queries";
import type { CtaBannerData } from "@/features/shared/types";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";
import type { SeoFields } from "@/sanity/lib/seo";
import { metadataFrom } from "@/sanity/lib/seo";

type Project = {
  name: string;
  slug: string;
  year?: string;
  location: string;
  province: string;
  services: string[];
  paragraphs?: string[];
  heroVideo?: string;
  heroVideoPosition?: string;
  heroVideoFile?: string;
  heroImage?: SanityImageSource;
  galleryBlocks?: ProjectGalleryBlock[];
  seo?: SeoFields;
};

/**
 * "Municipio (Provincia)" — salvo cuando el municipio ES la capital de
 * provincia (Valencia, Madrid), que se lee solo. Misma regla que tenía
 * formatProjectLocation en data.ts.
 */
function formatLocation(project: Pick<Project, "location" | "province">) {
  return project.location === project.province
    ? project.location
    : `${project.location} (${project.province})`;
}

/**
 * Las rutas a prerenderizar salen de Sanity, no de una lista en el código.
 * Publicar un proyecto nuevo le da su página sin tocar nada.
 */
/**
 * La página se sirve ya renderizada y se rehace, como mucho, una vez por
 * hora. El webhook de Sanity la caduca antes cuando publicas algo (ver
 * src/app/api/revalidate/route.ts), así que la hora es solo la red de
 * seguridad por si el aviso no llega.
 */
export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: PROJECT_SLUGS_QUERY,
    tags: ["project"],
  });
  return slugs.map((slug) => ({ slug }));
}

/**
 * Un proyecto publicado después del despliegue no está en
 * generateStaticParams, así que se renderiza a la primera visita y se cachea.
 * Sin esto daría 404.
 */
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await sanityFetch<Project | null>({
    query: PROJECT_QUERY,
    params: { slug },
    tags: ["project"],
  });
  if (!project) return {};

  // El SEO del panel manda; si está vacío, se mantienen exactamente los
  // textos que la web ya generaba.
  return metadataFrom(project.seo, {
    title: `Proyecto ${project.name}`,
    description: `Camelia — proyecto de interiorismo ${project.name}.`,
    image: imageProps(project.heroImage)?.src,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // El banner de cierre es el mismo componente que en /proyectos y ya lo
  // era; lo que faltaba era su contenido, que vive en la página de listado.
  // Sin él la ficha lo pintaba vacío.
  const [project, page] = await Promise.all([
    sanityFetch<Project | null>({
      query: PROJECT_QUERY,
      params: { slug },
      tags: ["project"],
    }),
    sanityFetch<{ cta?: CtaBannerData } | null>({
      query: PROYECTOS_PAGE_QUERY,
      tags: ["proyectosPage"],
    }),
  ]);
  if (!project) notFound();

  return (
    <>
      <ProjectHeroTitle
        name={project.name}
        heroVideo={project.heroVideoFile ?? project.heroVideo}
        heroVideoPosition={project.heroVideoPosition}
        heroImage={project.heroImage}
      />
      <ProjectInfo
        year={project.year ?? ""}
        location={formatLocation(project)}
        services={project.services ?? []}
      />
      <ProjectIntro paragraphs={project.paragraphs ?? []} />
      <ProjectGallery blocks={project.galleryBlocks} />
      <CtaBanner cta={page?.cta} />
    </>
  );
}
