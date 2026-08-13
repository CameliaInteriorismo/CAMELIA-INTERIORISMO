import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { toContactDetails } from "@/sanity/lib/contact";
import type { Social } from "@/features/contacto/types";
import type { LinkData } from "@/features/shared/types";

/**
 * La barra y el pie salen en todas las páginas, así que sus datos se piden
 * una vez aquí y bajan por props. La caché de ruta de cada página se encarga
 * de que esto no suponga una consulta por visita.
 */
export const revalidate = 3600;

type SiteSettings = Parameters<typeof toContactDetails>[0] & {
  navLinks?: LinkData[];
  headerCta?: LinkData;
  footerNavTitle?: string;
  footerContactTitle?: string;
  footerScheduleTitle?: string;
  footerColumns?: { title: string; links?: LinkData[] }[];
  footerLegalLinks?: LinkData[];
  copyright?: string;
  socials?: Social[];
};

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await sanityFetch<SiteSettings | null>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });
  if (!settings) return null;

  const contact = toContactDetails(settings);
  const navLinks = settings.navLinks ?? [];
  const socials = settings.socials ?? [];

  return (
    <>
      <Navbar navLinks={navLinks} cta={settings.headerCta} socials={socials} />
      <main className="flex-1">{children}</main>
      <Footer
        data={{
          navTitle: settings.footerNavTitle,
          // La columna de navegación del pie es su propia lista: puede tener
          // menos entradas que el menú (hoy no lleva Contacto).
          navLinks: settings.footerColumns?.[0]?.links ?? navLinks,
          contactTitle: settings.footerContactTitle,
          scheduleTitle: settings.footerScheduleTitle,
          legalLinks: settings.footerLegalLinks ?? [],
          copyright: settings.copyright,
          socials,
          contact,
        }}
      />
    </>
  );
}
