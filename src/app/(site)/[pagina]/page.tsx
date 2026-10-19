import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeroBanner } from "@/components/layout/PageHeroBanner";
import { JsonLd, preguntasFrecuentes } from "@/components/seo/JsonLd";
import {
  LandingIntro,
  LandingProjects,
  LandingSections,
  type LandingSection,
} from "@/features/zonas/LandingSections";
import { FaqSection, type FaqItem } from "@/features/servicios/FaqSection";
import { CtaBanner } from "@/features/servicios/CtaBanner";
import type { ProjectCard } from "@/features/proyectos/ProjectsGrid";
import type { CtaBannerData } from "@/features/shared/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";
import { LANDING_QUERY, LANDING_SLUGS_QUERY } from "@/sanity/lib/queries";
import { metadataFrom, type SeoFields } from "@/sanity/lib/seo";

/**
 * Las páginas de zona o de servicio («Interiorismo en Alzira y la Ribera»,
 * «Interiorismo para obra nueva»). Cuelgan de la raíz para que la dirección
 * sea corta; las rutas fijas (/servicios, /proyectos…) siempre ganan a esta,
 * y el panel no deja usar sus nombres. Cualquier otra dirección sin página en
 * Sanity da 404.
 */
export const revalidate = 3600;
export const dynamicParams = true;

type Landing = {
  title: string;
  slug: string;
  heroImage?: SanityImageSource;
  heroImagePosition?: string;
  introTitle?: string;
  introText?: string[];
  sections?: LandingSection[];
  projectsTitle?: string;
  projects?: ProjectCard[];
  faqTitle?: string;
  faq?: FaqItem[];
  cta?: CtaBannerData;
  seo?: SeoFields;
};

const TAGS = ["landingPage", "project"] as const;

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: LANDING_SLUGS_QUERY,
    tags: ["landingPage"],
  });
  return slugs.map((pagina) => ({ pagina }));
}

async function leer(pagina: string) {
  return sanityFetch<Landing | null>({
    query: LANDING_QUERY,
    params: { slug: pagina },
    tags: [...TAGS],
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pagina: string }>;
}): Promise<Metadata> {
  const { pagina } = await params;
  const landing = await leer(pagina);
  if (!landing) return {};
  return await metadataFrom(
    landing.seo,
    {
      title: landing.title,
      description:
        landing.introText?.[0]?.slice(0, 160) ??
        `${landing.title}. Camelia, estudio de interiorismo en Alzira (Valencia).`,
      image: imageProps(landing.heroImage)?.src,
    },
    `/${pagina}`,
  );
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ pagina: string }>;
}) {
  const { pagina } = await params;
  const landing = await leer(pagina);
  if (!landing) notFound();

  const faq = landing.faq ?? [];
  return (
    <>
      <PageHeroBanner
        title={landing.title}
        image={imageProps(landing.heroImage)?.src}
        titleClassName="text-background tracking-[0.02em]"
        imagePosition={landing.heroImagePosition ?? "center"}
      />
      <LandingIntro title={landing.introTitle} paragraphs={landing.introText} />
      <LandingProjects
        title={landing.projectsTitle}
        projects={landing.projects ?? []}
      />
      <LandingSections sections={landing.sections ?? []} />
      {faq.length > 0 && (
        <>
          <FaqSection items={faq} title={landing.faqTitle} />
          <JsonLd data={preguntasFrecuentes(faq)} />
        </>
      )}
      <CtaBanner cta={landing.cta} />
    </>
  );
}
