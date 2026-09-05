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
import type { SanityImageSource } from "@/sanity/lib/image";
import { METODOLOGIA_PAGE_QUERY } from "@/sanity/lib/queries";
import { metadataFrom, type SeoFields } from "@/sanity/lib/seo";

export const revalidate = 3600;

type MetodologiaPage = {
  title?: string;
  heroImage?: SanityImageSource;
  heroImagePosition?: string;
  processTitle?: string;
  process?: ProcessStep[];
  experienceTitle?: string;
  experienceText?: string;
  experience?: ExperienceStep[];
  seo?: SeoFields;
};

const FALLBACK = {
  title: "Metodología y proceso de interiorismo | Camelia",
  description:
    "Conoce cómo desarrollamos un proyecto de interiorismo en Camelia, desde el primer contacto hasta la ejecución, con acompañamiento en cada fase.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<MetodologiaPage | null>({
    query: METODOLOGIA_PAGE_QUERY,
    tags: ["metodologiaPage"],
  });
  // El título ya lleva la marca al final, así que se emite en ABSOLUTO: la
  // plantilla `%s | Camelia` del layout la repetiría. Un título escrito en
  // Sanity sigue pasando por la plantilla, como en el resto de páginas.
  const { title, ...resto } = await metadataFrom(
    page?.seo,
    FALLBACK,
    "/metodologia",
  );
  return page?.seo?.title
    ? { ...resto, title }
    : { ...resto, title: { absolute: FALLBACK.title } };
}

export default async function MetodologiaPage() {
  const page = await sanityFetch<MetodologiaPage | null>({
    query: METODOLOGIA_PAGE_QUERY,
    tags: ["metodologiaPage"],
  });

  return (
    <>
      <PageHeader
        title={page?.title}
        image={page?.heroImage}
        imagePosition={page?.heroImagePosition}
      />
      <ProcesoTabs steps={page?.process ?? []} title={page?.processTitle} />
      <ExperienciaScroll
        steps={page?.experience ?? []}
        title={page?.experienceTitle}
        text={page?.experienceText}
      />
    </>
  );
}
