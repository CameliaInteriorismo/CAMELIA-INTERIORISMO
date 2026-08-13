import type { Metadata } from "next";
import { PageHeader } from "@/features/servicios/PageHeader";
import {
  ProjectPhases,
  type ServicePhase,
} from "@/features/servicios/ProjectPhases";
import {
  AccompanimentSection,
  type AccompanimentItem,
} from "@/features/servicios/AccompanimentSection";
import { CtaBanner } from "@/features/servicios/CtaBanner";
import { FaqSection, type FaqItem } from "@/features/servicios/FaqSection";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SERVICIOS_PAGE_QUERY } from "@/sanity/lib/queries";
import { metadataFrom, type SeoFields } from "@/sanity/lib/seo";
import type { CtaBannerData } from "@/features/shared/types";

export const revalidate = 3600;

type ServiciosPage = {
  phases?: ServicePhase[];
  accompanimentTitle?: string;
  accompaniment?: AccompanimentItem[];
  cta?: CtaBannerData;
  faqTitle?: string;
  faq?: FaqItem[];
  seo?: SeoFields;
};

const FALLBACK = {
  title: "Servicios",
  description:
    "Camelia — interiorismo, ejecución y supervisión de obra, y decoración. Descubre cómo podemos acompañarte en tu proyecto.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<ServiciosPage | null>({
    query: SERVICIOS_PAGE_QUERY,
    tags: ["serviciosPage", "service"],
  });
  return metadataFrom(page?.seo, FALLBACK);
}

export default async function ServiciosPage() {
  const page = await sanityFetch<ServiciosPage | null>({
    query: SERVICIOS_PAGE_QUERY,
    tags: ["serviciosPage", "service"],
  });

  return (
    <>
      <PageHeader />
      <ProjectPhases phases={page?.phases ?? []} />
      <AccompanimentSection
        items={page?.accompaniment ?? []}
        title={page?.accompanimentTitle}
      />
      <CtaBanner cta={page?.cta} />
      <FaqSection items={page?.faq ?? []} title={page?.faqTitle} />
    </>
  );
}
