import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import localFont from "next/font/local";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { NavigationLoader } from "@/components/layout/NavigationLoader";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SeoFields } from "@/sanity/lib/seo";
import "@/styles/globals.css";

const arizonaFlare = localFont({
  src: "../fonts/ABCArizonaFlare-Light-Trial.otf",
  variable: "--font-arizona-flare",
  weight: "300",
  display: "swap",
});

const plusJakarta = localFont({
  src: "../fonts/PlusJakartaSans-VariableFont_wght.ttf",
  variable: "--font-plus-jakarta",
  weight: "200 800",
  display: "swap",
});

/**
 * `defaultSeo` en Sanity ("SEO por defecto") existía en el panel y se
 * consultaba, pero nada lo leía: el título de la pestaña estaba escrito
 * aquí a mano y el campo no cambiaba nada al editarlo. Sigue habiendo un
 * valor de reserva — "Camelia" — para que la pestaña nunca se quede vacía
 * si el campo está sin rellenar.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<{ defaultSeo?: SeoFields } | null>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });
  const seo = settings?.defaultSeo;

  return {
    // Sin `metadataBase`, Next resuelve las imágenes de Open Graph como rutas
    // relativas y ninguna red social las llega a cargar. Apunta al dominio
    // definitivo, no al de Vercel: ver src/lib/site.ts.
    metadataBase: new URL(SITE_URL),
    title: { default: seo?.title || "Camelia", template: "%s | Camelia" },
    description:
      seo?.description || "Camelia — Diseñamos espacios que cuentan historias",
    // Declared here (from public/) rather than as app/favicon.ico: the
    // file-based convention injects its <link> into every route and can't be
    // overridden, which left the request-sent screen emitting both the vino
    // and the orange icon. As metadata, a page-level `icons` replaces this
    // outright — see (confirmacion)/carrito/gracias/page.tsx.
    icons: { icon: "/images/logos/trimmed/FAVICON-VINO actualizado.png" },
  };
}

/**
 * El aviso de carga es lo único que este layout necesita de Sanity, y por eso
 * la consulta se pide aquí: el indicador vive fuera de (site), así que no
 * puede recibirlo por props desde allí. Next deduplica esta consulta con la
 * que ya hace (site)/layout en el mismo render, de modo que no supone una
 * segunda ida a Sanity.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await sanityFetch<{ loadingLabel?: string } | null>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });

  return (
    <html
      lang="es"
      className={`${arizonaFlare.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="bg-background text-primary flex min-h-full flex-col">
        {/* Navbar portals in here (see Navbar.tsx) — a sibling of the page
            content, never a descendant of it, so nothing la página haga
            (contenedores con scroll, transforms) puede arrastrarla.

            `contents` es lo que hace que la barra pueda quedarse pegada: sin
            él este div es una caja de 81px —justo lo que mide la barra—, y un
            elemento `sticky` solo se pega DENTRO de su contenedor, así que se
            despegaba en cuanto pasabas esos 81px y se iba con la página. Con
            `contents` el div deja de generar caja y la barra pasa a colgar
            directamente del body, que sí es tan alto como la página entera. */}
        <div id="navbar-root" className="contents" />
        {children}
        {/* Above everything, including the navbar — see NavigationLoader. */}
        <NavigationLoader label={settings?.loadingLabel} />
        {/* Banner, preferences panel, and the analytics/marketing tags that
            only mount once they're consented to. Here rather than in the
            (site) layout so it also covers the form and the confirmation
            screens, which sit in their own route groups. */}
        <CookieConsent />
      </body>
    </html>
  );
}
