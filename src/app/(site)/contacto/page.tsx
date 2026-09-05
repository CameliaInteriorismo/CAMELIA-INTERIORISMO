import type { Metadata } from "next";
import { ContactHero } from "@/features/contacto/ContactHero";
import { ContactCards } from "@/features/contacto/ContactCards";
import { StudioMap } from "@/features/contacto/StudioMap";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CONTACT_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { toContactDetails } from "@/sanity/lib/contact";
import { metadataFrom, type SeoFields } from "@/sanity/lib/seo";
import type { SanityImageSource } from "@/sanity/lib/image";
import type { ContactCardData, Social } from "@/features/contacto/types";

export const revalidate = 3600;

type ContactPage = {
  title?: string;
  heroImage?: SanityImageSource;
  heroImagePosition?: string;
  cards?: ContactCardData[];
  mapTitle?: string;
  mapLead?: string;
  mapText?: string;
  mapAddressLabel?: string;
  mapActionLabel?: string;
  mapImage?: SanityImageSource;
  seo?: SeoFields;
};

type SiteSettings = Parameters<typeof toContactDetails>[0] & {
  socials?: Social[];
};

const FALLBACK = {
  title: "Contacto",
  description:
    "Camelia — hablemos de tu proyecto. Escríbenos, llámanos o visítanos en nuestro estudio de Alzira.",
};

async function load() {
  const [page, settings] = await Promise.all([
    sanityFetch<ContactPage | null>({
      query: CONTACT_PAGE_QUERY,
      tags: ["contactPage"],
    }),
    sanityFetch<SiteSettings | null>({
      query: SITE_SETTINGS_QUERY,
      tags: ["siteSettings"],
    }),
  ]);
  return { page, settings };
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await load();
  return await metadataFrom(page?.seo, FALLBACK, "/contacto");
}

export default async function ContactoPage() {
  const { page, settings } = await load();
  // Los datos de contacto salen de los ajustes globales, no de la página: son
  // los mismos que pinta el pie y el bloque de recogida del carrito.
  const contact = settings ? toContactDetails(settings) : null;
  if (!contact) return null;

  return (
    <>
      <ContactHero
        title={page?.title}
        image={page?.heroImage}
        imagePosition={page?.heroImagePosition}
      />
      <ContactCards
        cards={page?.cards ?? []}
        contact={contact}
        socials={settings?.socials ?? []}
      />
      <StudioMap
        title={page?.mapTitle}
        lead={page?.mapLead}
        text={page?.mapText}
        image={page?.mapImage}
        addressLabel={page?.mapAddressLabel}
        actionLabel={page?.mapActionLabel}
        contact={contact}
      />
    </>
  );
}
