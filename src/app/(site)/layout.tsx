import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { toContactDetails } from "@/sanity/lib/contact";
import type { Social } from "@/features/contacto/types";
import type { LinkData } from "@/features/shared/types";
import { JsonLd, servicioProfesional, sitioWeb } from "@/components/seo/JsonLd";

/**
 * La barra y el pie salen en todas las páginas, así que sus datos se piden
 * una vez aquí y bajan por props. La caché de ruta de cada página se encarga
 * de que esto no suponga una consulta por visita.
 */
export const revalidate = 3600;

type SiteSettings = Parameters<typeof toContactDetails>[0] & {
  navLinks?: LinkData[];
  headerCta?: LinkData;
  menuLabel?: string;
  cartLabel?: string;
  footerTagline?: string;
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
  // El pie admite varias columnas de enlaces (`footerColumns` en el panel,
  // cada una con su propio título) — antes solo se leía la primera y su
  // título se descartaba a favor de un campo `footerNavTitle` aparte que
  // pedía escribir el mismo texto dos veces. Sin ninguna columna cargada,
  // cae en una sola "Navegación" con el menú de la cabecera, que es lo que
  // había antes de que existiera este campo.
  const footerColumns =
    settings.footerColumns && settings.footerColumns.length > 0
      ? settings.footerColumns.map((column) => ({
          title: column.title,
          links: column.links ?? [],
        }))
      : [{ title: "Navegación", links: navLinks }];

  return (
    <>
      {/* Los dos schemas globales viven aquí y solo aquí: el layout envuelve
          todas las páginas públicas, así que no puede haber copias sueltas. */}
      <JsonLd data={servicioProfesional(settings)} />
      <JsonLd data={sitioWeb()} />
      <Navbar
        navLinks={navLinks}
        cta={settings.headerCta}
        socials={socials}
        menuLabel={settings.menuLabel}
        cartLabel={settings.cartLabel}
      />
      {/* El aire contra el pie se pone AQUÍ y solo aquí. Antes cada sección
          llevaba su propio `pb`, que se sumaba al `pt` de la siguiente y dejaba
          huecos de hasta 474px medidos entre el último píxel de una y el primero
          de la otra. Ahora la distancia entre secciones la marca únicamente el
          `pt-section` de la de abajo, así que el número declarado es el que se
          ve. */}
      <main className="pb-section flex-1">{children}</main>
      <Footer
        data={{
          tagline: settings.footerTagline,
          columns: footerColumns,
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
