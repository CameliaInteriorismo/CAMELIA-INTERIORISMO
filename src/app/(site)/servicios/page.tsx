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
  introTitle?: string;
  introText?: string;
  phasesTitle?: string;
  phases?: ServicePhase[];
  accompanimentTitle?: string;
  accompanimentSubtitle?: string;
  accompanimentText?: string;
  accompaniment?: AccompanimentItem[];
  cta?: CtaBannerData;
  faqTitle?: string;
  faq?: FaqItem[];
  seo?: SeoFields;
};

const FALLBACK = {
  title: "Servicios de interiorismo y reforma integral | Camelia",
  description:
    "Camelia — interiorismo, ejecución y supervisión de obra, y decoración. Descubre cómo podemos acompañarte en tu proyecto.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<ServiciosPage | null>({
    query: SERVICIOS_PAGE_QUERY,
    tags: ["serviciosPage", "service"],
  });
  // El título ya lleva la marca al final, así que se emite en ABSOLUTO: la
  // plantilla `%s | Camelia` del layout la repetiría. Mismo patrón que Home,
  // Estudio y Metodología.
  const { title, ...resto } = metadataFrom(page?.seo, FALLBACK, "/servicios");
  return page?.seo?.title
    ? { ...resto, title }
    : { ...resto, title: { absolute: FALLBACK.title } };
}

export default async function ServiciosPage() {
  const page = await sanityFetch<ServiciosPage | null>({
    query: SERVICIOS_PAGE_QUERY,
    tags: ["serviciosPage", "service"],
  });

  return (
    <>
      <PageHeader />
      <ProjectPhases
        phases={page?.phases ?? []}
        title={page?.phasesTitle}
        introTitle={page?.introTitle}
        introText={page?.introText}
      />
      <AccompanimentSection
        items={page?.accompaniment ?? []}
        title={page?.accompanimentTitle}
        subtitle={page?.accompanimentSubtitle}
        text={page?.accompanimentText}
      />
      <CtaBanner cta={page?.cta} />
      <FaqSection items={page?.faq ?? []} title={page?.faqTitle} />
    </>
  );
}
