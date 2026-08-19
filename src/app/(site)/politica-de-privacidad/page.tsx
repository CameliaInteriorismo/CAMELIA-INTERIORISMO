import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/features/legal/LegalPage";
import { LegalDocument } from "@/features/legal/LegalDocument";
import { sanityFetch } from "@/sanity/lib/fetch";
import { LEGAL_DOCUMENT_QUERY } from "@/sanity/lib/queries";
import { metadataFrom, type SeoFields } from "@/sanity/lib/seo";
import type { LegalSection } from "@/features/legal/types";

export const revalidate = 3600;

const SLUG = "politica-de-privacidad";

type LegalDoc = {
  title: string;
  lead?: string[];
  sections: LegalSection[];
  seo?: SeoFields;
};

/** El SEO actual se mantiene como valor por defecto si Sanity no trae uno. */
const FALLBACK = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de CAMELIA — qué datos personales recopilamos, con qué finalidad los tratamos, durante cuánto tiempo los conservamos y cómo ejercer tus derechos.",
};

export async function generateMetadata(): Promise<Metadata> {
  const doc = await sanityFetch<LegalDoc | null>({
    query: LEGAL_DOCUMENT_QUERY,
    params: { slug: SLUG },
    tags: ["legalDocument"],
  });
  return metadataFrom(doc?.seo, FALLBACK, "/politica-de-privacidad");
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
