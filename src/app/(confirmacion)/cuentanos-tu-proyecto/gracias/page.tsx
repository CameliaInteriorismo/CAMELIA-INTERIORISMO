import type { Metadata } from "next";
import { FormSent, type ThanksContent } from "@/features/formulario/FormSent";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CONFIRMATION_PAGES_QUERY } from "@/sanity/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Solicitud enviada",
  description: "Camelia — gracias por contactar con nosotras.",
};

export default async function FormularioGraciasPage() {
  const page = await sanityFetch<{ formThanks?: ThanksContent } | null>({
    query: CONFIRMATION_PAGES_QUERY,
    tags: ["confirmationPages"],
  });
  return <FormSent content={page?.formThanks} />;
}
