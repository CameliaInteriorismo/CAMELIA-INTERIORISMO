import type { Metadata } from "next";
import { ContactForm, type StudioInfo } from "@/features/carrito/ContactForm";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  CONFIRMATION_PAGES_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import { toContactDetails } from "@/sanity/lib/contact";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Información de contacto",
  description: "Camelia Shop — información de contacto y método de entrega.",
};

type Confirmation = { studioName?: string; studioHours?: string };

export default async function ConfirmacionPage() {
  const [confirmation, settings] = await Promise.all([
    sanityFetch<Confirmation | null>({
      query: CONFIRMATION_PAGES_QUERY,
      tags: ["confirmationPages"],
    }),
    sanityFetch<Parameters<typeof toContactDetails>[0] | null>({
      query: SITE_SETTINGS_QUERY,
      tags: ["siteSettings"],
    }),
  ]);
  if (!settings) return null;

  const studio: StudioInfo = {
    name: confirmation?.studioName,
    hours: confirmation?.studioHours,
  };

  // Solo cambia de dónde salen los textos: el formulario, su validación y el
  // envío siguen exactamente igual.
  return <ContactForm studio={studio} contact={toContactDetails(settings)} />;
}
