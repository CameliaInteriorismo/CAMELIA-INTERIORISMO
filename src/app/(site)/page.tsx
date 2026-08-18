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
  title: "Camelia",
  description:
    "Camelia — estudio de interiorismo. Diseñamos espacios que cuentan historias.",
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
  // La Home es la raíz del sitio y su título es la marca a secas. Devolverlo
  // como cadena lo hacía pasar por la plantilla `%s | Camelia` del layout, que
  // lo dejaba en "Camelia | Camelia", así que sin título propio en Sanity se
  // omite y hereda el `default` del layout. Si alguien escribe uno en el panel
  // se emite como en el resto de páginas y sí lleva la plantilla.
  const { title, ...resto } = metadataFrom(page?.seo, FALLBACK);
  return page?.seo?.title ? { ...resto, title } : resto;
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
