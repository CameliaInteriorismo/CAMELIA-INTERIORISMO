import type { Metadata } from "next";
import { ProjectForm } from "@/features/formulario/ProjectForm";
import {
  mergeSteps,
  type FormStepContent,
} from "@/features/formulario/mergeSteps";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PROJECT_FORM_QUERY } from "@/sanity/lib/queries";
import { metadataFrom, type SeoFields } from "@/sanity/lib/seo";

export const revalidate = 3600;

type FormPage = { steps?: FormStepContent[]; seo?: SeoFields };

const FALLBACK = {
  title: "Cuéntanos tu proyecto",
  description:
    "Camelia — cuéntanos qué tienes en mente y te ayudamos a darle forma.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<FormPage | null>({
    query: PROJECT_FORM_QUERY,
    tags: ["projectFormPage"],
  });
  return await metadataFrom(page?.seo, FALLBACK, "/cuentanos-tu-proyecto");
}

export default async function CuentanosTuProyectoPage() {
  const page = await sanityFetch<FormPage | null>({
    query: PROJECT_FORM_QUERY,
    tags: ["projectFormPage"],
  });

  // Los textos de Sanity se superponen a la estructura del código; la
  // validación y el envío no cambian.
  return <ProjectForm steps={mergeSteps(page?.steps)} />;
}
