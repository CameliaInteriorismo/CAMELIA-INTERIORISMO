import type { Metadata } from "next";
import { PageHeader } from "@/features/metodologia/PageHeader";
import {
  ProcesoTabs,
  type ProcessStep,
} from "@/features/metodologia/ProcesoTabs";
import {
  ExperienciaScroll,
  type ExperienceStep,
} from "@/features/metodologia/ExperienciaScroll";
import { sanityFetch } from "@/sanity/lib/fetch";
import { METODOLOGIA_PAGE_QUERY } from "@/sanity/lib/queries";
import { metadataFrom, type SeoFields } from "@/sanity/lib/seo";

export const revalidate = 3600;

type MetodologiaPage = {
  processTitle?: string;
  process?: ProcessStep[];
  experienceTitle?: string;
  experience?: ExperienceStep[];
  seo?: SeoFields;
};

const FALLBACK = {
  title: "Metodología",
  description:
    "Camelia — nuestro proceso de trabajo, del primer contacto a la entrega, y cómo acompañamos al cliente durante todo el camino.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<MetodologiaPage | null>({
    query: METODOLOGIA_PAGE_QUERY,
    tags: ["metodologiaPage"],
  });
  return metadataFrom(page?.seo, FALLBACK);
}

export default async function MetodologiaPage() {
  const page = await sanityFetch<MetodologiaPage | null>({
    query: METODOLOGIA_PAGE_QUERY,
    tags: ["metodologiaPage"],
  });

  return (
    <>
      <PageHeader />
      <ProcesoTabs steps={page?.process ?? []} title={page?.processTitle} />
      <ExperienciaScroll
        steps={page?.experience ?? []}
        title={page?.experienceTitle}
      />
    </>
  );
}
