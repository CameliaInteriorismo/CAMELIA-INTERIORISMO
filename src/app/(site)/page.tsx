import type { Metadata } from "next";
import { Hero } from "@/features/home/Hero";
import { ServiceTabs, type HomeService } from "@/features/home/ServiceTabs";
import { DetailGrid, type FeaturedProject } from "@/features/home/DetailGrid";
import { Testimonials, type Testimonial } from "@/features/home/Testimonials";
import { CtaBanner } from "@/features/home/CtaBanner";
import { PartnerLogos, type Partner } from "@/features/home/PartnerLogos";
import { sanityFetch } from "@/sanity/lib/fetch";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import { metadataFrom, type SeoFields } from "@/sanity/lib/seo";
import type { CtaBannerData, LinkData } from "@/features/shared/types";
import type { SanityImageSource } from "@/sanity/lib/image";

export const revalidate = 3600;

type HomePage = {
  heroVideo?: string;
  heroVideoFile?: string;
  heroImage?: SanityImageSource;
  heroLogo?: SanityImageSource;
  servicesTitle?: string;
  servicesCta?: LinkData;
  services?: HomeService[];
  detailTitle?: string;
  featuredProjects?: FeaturedProject[];
  testimonialsTitle?: string;
  testimonials?: Testimonial[];
  cta?: CtaBannerData;
  partners?: Partner[];
  seo?: SeoFields;
};

const FALLBACK = {
  title: "Camelia | Estudio de interiorismo en Alzira, Valencia",
  description:
    "Camelia, estudio de interiorismo en Alzira, Valencia. Diseñamos espacios que cuentan historias y reflejan la esencia de quienes los habitan.",
};

const TAGS = [
  "homePage",
  "service",
  "testimonial",
  "partner",
  "project",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<HomePage | null>({
    query: HOME_PAGE_QUERY,
    tags: [...TAGS],
  });
  // El título de la Home ya lleva la marca delante, así que se emite en
  // ABSOLUTO: pasarlo por la plantilla `%s | Camelia` del layout lo dejaría
  // en "... | Camelia" con la marca repetida al final. Si alguien escribe uno
  // propio en el panel, ese sí se comporta como el del resto de páginas.
  const { title, ...resto } = metadataFrom(page?.seo, FALLBACK, "/");
  return page?.seo?.title
    ? { ...resto, title }
    : { ...resto, title: { absolute: FALLBACK.title } };
}

export default async function Home() {
  const page = await sanityFetch<HomePage | null>({
    query: HOME_PAGE_QUERY,
    tags: [...TAGS],
  });

  return (
    <>
      {/* La portada muestra la marca como logotipo, así que la página se
          quedaba sin encabezado de primer nivel: la única de las ocho. Va
          oculto a la vista y disponible para lectores de pantalla, igual que
          el de Estudio (AboutSections.tsx). */}
      <h1 className="sr-only">Camelia — estudio de interiorismo</h1>
      <Hero
        video={page?.heroVideoFile ?? page?.heroVideo}
        image={page?.heroImage}
        logo={page?.heroLogo}
      />
      <ServiceTabs
        services={page?.services ?? []}
        title={page?.servicesTitle}
        cta={page?.servicesCta}
      />
      <DetailGrid
        projects={page?.featuredProjects ?? []}
        title={page?.detailTitle}
      />
      <Testimonials
        testimonials={page?.testimonials ?? []}
        title={page?.testimonialsTitle}
      />
      <CtaBanner cta={page?.cta} />
      <PartnerLogos partners={page?.partners ?? []} />
    </>
  );
}
