import type { Metadata } from "next";
import localFont from "next/font/local";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { NavigationLoader } from "@/components/layout/NavigationLoader";
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

export const metadata: Metadata = {
  title: { default: "Camelia", template: "%s | Camelia" },
  description: "Camelia — Diseñamos espacios que cuentan historias",
  // Declared here (from public/) rather than as app/favicon.ico: the
  // file-based convention injects its <link> into every route and can't be
  // overridden, which left the request-sent screen emitting both the vino
  // and the orange icon. As metadata, a page-level `icons` replaces this
  // outright — see (confirmacion)/carrito/gracias/page.tsx.
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${arizonaFlare.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="bg-background text-primary flex min-h-full flex-col">
        {/* Navbar portals in here (see Navbar.tsx) — a sibling of the page
            content, never a descendant of it, so nothing the page ever
            does (scroll containers, transforms) can carry it along. */}
        <div id="navbar-root" />
        {children}
        {/* Above everything, including the navbar — see NavigationLoader. */}
        <NavigationLoader />
        {/* Banner, preferences panel, and the analytics/marketing tags that
            only mount once they're consented to. Here rather than in the
            (site) layout so it also covers the form and the confirmation
            screens, which sit in their own route groups. */}
        <CookieConsent />
      </body>
    </html>
  );
}
