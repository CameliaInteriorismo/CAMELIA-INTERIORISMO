import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/features/legal/LegalPage";
import { LegalDocument } from "@/features/legal/LegalDocument";
import { sanityFetch } from "@/sanity/lib/fetch";
import { LEGAL_DOCUMENT_QUERY } from "@/sanity/lib/queries";
import { metadataFrom, type SeoFields } from "@/sanity/lib/seo";
import type { LegalSection } from "@/features/legal/types";

export const revalidate = 3600;

const SLUG = "aviso-legal";

type LegalDoc = {
  title: string;
  lead?: string[];
  sections: LegalSection[];
  seo?: SeoFields;
};

const FALLBACK = {
  title: "Aviso legal",
  description:
    "Aviso legal de CAMELIA — titularidad del sitio web, condiciones de acceso y uso, propiedad intelectual y legislación aplicable.",
};

export async function generateMetadata(): Promise<Metadata> {
  const doc = await sanityFetch<LegalDoc | null>({
    query: LEGAL_DOCUMENT_QUERY,
    params: { slug: SLUG },
    tags: ["legalDocument"],
  });
  return metadataFrom(doc?.seo, FALLBACK, "/aviso-legal");
}

export default async function AvisoLegalPage() {
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
