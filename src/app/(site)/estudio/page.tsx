import type { Metadata } from "next";
import {
  AboutSections,
  type AboutSection,
} from "@/features/estudio/AboutSections";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ESTUDIO_PAGE_QUERY } from "@/sanity/lib/queries";
import { metadataFrom, type SeoFields } from "@/sanity/lib/seo";

export const revalidate = 3600;

type EstudioPage = { sections?: AboutSection[]; seo?: SeoFields };

const FALLBACK = {
  title: "Sobre Camelia | Interiorismo en Alzira, Valencia",
  description:
    "Camelia — estudio de interiorismo en Alzira. Conoce el origen del estudio y su dirección creativa y ejecutiva.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<EstudioPage | null>({
    query: ESTUDIO_PAGE_QUERY,
    tags: ["estudioPage"],
  });
  // El título ya lleva la marca delante, así que se emite en ABSOLUTO: la
  // plantilla `%s | Camelia` del layout lo dejaría con la marca repetida al
  // final. Un título escrito en Sanity sigue pasando por la plantilla.
  const { title, ...resto } = metadataFrom(page?.seo, FALLBACK, "/estudio");
  return page?.seo?.title
    ? { ...resto, title }
    : { ...resto, title: { absolute: FALLBACK.title } };
}

export default async function EstudioPage() {
  const page = await sanityFetch<EstudioPage | null>({
    query: ESTUDIO_PAGE_QUERY,
    tags: ["estudioPage"],
  });
  return <AboutSections sections={page?.sections ?? []} />;
}
