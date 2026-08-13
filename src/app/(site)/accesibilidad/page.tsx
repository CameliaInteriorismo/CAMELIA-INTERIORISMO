import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/features/legal/LegalPage";
import { LegalDocument } from "@/features/legal/LegalDocument";
import { sanityFetch } from "@/sanity/lib/fetch";
import { LEGAL_DOCUMENT_QUERY } from "@/sanity/lib/queries";
import { metadataFrom, type SeoFields } from "@/sanity/lib/seo";
import type { LegalSection } from "@/features/legal/types";

export const revalidate = 3600;

const SLUG = "accesibilidad";

type LegalDoc = {
  title: string;
  lead?: string[];
  sections: LegalSection[];
  seo?: SeoFields;
};

/** El SEO actual se mantiene como valor por defecto si Sanity no trae uno. */
const FALLBACK = {
  title: "Accesibilidad",
  description:
    "Declaración de accesibilidad de CAMELIA — las medidas que aplicamos para que la web sea utilizable por el mayor número de personas, sus limitaciones conocidas y cómo comunicarnos cualquier barrera.",
};

export async function generateMetadata(): Promise<Metadata> {
  const doc = await sanityFetch<LegalDoc | null>({
    query: LEGAL_DOCUMENT_QUERY,
    params: { slug: SLUG },
    tags: ["legalDocument"],
  });
  return metadataFrom(doc?.seo, FALLBACK);
}

export default async function Page() {
  const doc = await sanityFetch<LegalDoc | null>({
    query: LEGAL_DOCUMENT_QUERY,
    params: { slug: SLUG },
    tags: ["legalDocument"],
  });
  if (!doc) notFound();

  return (
    <LegalPage title={doc.title}>
      <LegalDocument lead={doc.lead} sections={doc.sections} />
    </LegalPage>
  );
}
