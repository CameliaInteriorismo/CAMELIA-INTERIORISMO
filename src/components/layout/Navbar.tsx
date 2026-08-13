"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Container } from "@/components/layout/Container";
import { HamburgerMenu } from "@/components/layout/HamburgerMenu";
import { ButtonLink } from "@/components/ui/Button";
import { CartIcon, MenuIcon } from "@/components/ui/icons";
import { cn } from "@/utils/cn";
import { useCartHasHydrated, useCartStore } from "@/stores/cartStore";
import { useHeroStore } from "@/stores/heroStore";
import type { LinkData } from "@/features/shared/types";
import type { Social } from "@/features/contacto/types";

export function Navbar({
  navLinks,
  cta,
  socials,
}: {
  navLinks: LinkData[];
  cta?: LinkData;
  socials: Social[];
}) {
  const [open, setOpen] = useState(false);
  // Renders inline for the very first paint (server + hydration, matching),
  // then re-parents into #navbar-root via a portal right after mount — the
  // header's DOM node ends up a sibling of the page content, never a
  // descendant of it, so nothing the page does (scroll containers,
  // transforms) can carry it along.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const pathname = usePathname();
  const isHome = pathname === "/";
  // Pages that own a full-bleed hero section (see Home's Hero.tsx and
  // Metodología's PageHeader.tsx) drive `heroActive` in the shared store —
  // every other route ignores it and keeps the standard sticky/solid header.
  const hasHero =
    isHome ||
    pathname === "/metodologia" ||
    pathname === "/servicios" ||
    pathname === "/proyectos" ||
    pathname.startsWith("/proyectos/") ||
    pathname === "/tienda" ||
    // Only the listing owns a hero; a post opens straight on its title.
    // Legal pages (see features/legal/LegalPage) have none at all — they
    // open on a plain field, so they keep the normal solid bar too.
    pathname === "/blog";
  // Estudio has no hero to float over, but still wants the header pinned
  // in place while scrolling — plain `fixed`, permanently transparent (see
  // `transparentNav` below) rather than `hasHero`'s scroll-tied fade.
  const alwaysFixed = pathname === "/estudio";
  // Every page belonging to the shop (listing, product, cart, checkout —
  // whatever lives under /tienda or /carrito) shares this exact navbar:
  // the grid's own hero still floats the header over it (see `hasHero`
  // above), but the bar itself never goes transparent and drops the
  // project CTA — commerce chrome, not a lead-gen banner, throughout.
  const isShop =
    pathname.startsWith("/tienda") || pathname.startsWith("/carrito");
  const showCart = isShop;
  const logoRevealed = useHeroStore((s) => s.logoRevealed);
  const heroActive = useHeroStore((s) => s.heroActive);
  // On Home the hero owns the wordmark until its scroll animation hands it
  // off to this slot (see features/home/Hero.tsx + stores/heroStore.ts).
  const hideBrand = isHome && !logoRevealed;
  // Transparent navbar floating over the fullscreen hero, reverting to the
  // normal solid bar once the hero scrolls out of view. Forced solid while
  // the menu is open too: the overlay's own vino background takes over the
  // screen, so the header row above it should read as the normal navigation
  // chrome, not float transparently over the (now hidden) hero.
  //
  // Estudio has no hero media to float over, but the page's own background
  // is already the same cream as the navbar's solid state — so it stays
  // permanently transparent instead, letting that background show through
  // directly rather than painting an identical color on top of it.
  const transparentNav =
    ((hasHero && heroActive) || alwaysFixed) && !open && !isShop;

  // Estudio-only auto-hide: slides the header up out of view on scroll
  // down, back in on scroll up. Never engages while the menu is open, so
  // the close button can't slide away mid-interaction. Every other route
  // just keeps `navHidden` false forever, so its header never moves.
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!alwaysFixed || open) return;
    const delta = latest - lastScrollY.current;
    if (delta > 4) {
      setNavHidden(true);
    } else if (delta < -4) {
      setNavHidden(false);
    }
    lastScrollY.current = latest;
  });

  // Close the menu on navigation without an effect: adjust state during
  // render when pathname changes, per React's recommended pattern.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartHasHydrated();
  const itemCount = hasHydrated
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const header = (
    <header
      className={cn(
        "text-primary z-50",
        hasHero || alwaysFixed ? "fixed inset-x-0 top-0" : "sticky top-0",
      )}
    >
      {/* Only this inner wrapper slides — not <header> itself, so the
          hamburger overlay below (a `fixed` child) keeps positioning
          against the viewport instead of picking up a transformed
          ancestor as its containing block. The background/border live
          here too (not on <header>), so hiding this on scroll takes the
          entire visible bar with it — no empty colored strip left behind. */}
      <motion.div
        animate={{ y: alwaysFixed && navHidden ? "-100%" : "0%" }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "relative z-50",
          // While the menu is open the panel below runs full-bleed and
          // supplies its own cream wordmark, so the bar leaves no cream
          // strip or rule across the top of it. `pointer-events-none` is
          // what makes that safe: the bar sits at z-50 over the z-40 panel,
          // so an empty-but-still-hit-testable strip would otherwise
          // swallow clicks on the panel's wordmark and on the top 80px of
          // the click-anywhere-to-close area.
          open
            ? "pointer-events-none bg-transparent"
            : cn(
                "border-primary/15 border-b",
                transparentNav ? "bg-transparent" : "bg-background",
              ),
          hasHero && "transition-colors duration-500",
        )}
      >
        <Container>
          <div className="relative flex h-20 items-center justify-between">
            {/* No close control at all once the menu is open: it shuts via
                the panel's own wordmark or by clicking anywhere off the
                links, so the bar simply empties out rather than leaving a
                gap where an X used to sit. */}
            {!open && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex h-11 items-center gap-2 text-base font-light tracking-wide uppercase"
              >
                <MenuIcon className="h-3 w-[18px]" />
                {/* TODO(mobile): sin referencia de Figma para mobile; el texto
                  "Menu" se oculta bajo sm para no chocar con el logo
                  centrado — el icono por sí solo ya es reconocible. */}
                <span className="hidden sm:inline">Menu</span>
              </button>
            )}

            {!open && (
              <Link
                href="/"
                id="navbar-brand"
                className={cn(
                  "absolute left-1/2 flex h-11 -translate-x-1/2 items-center transition-opacity duration-500",
                  hideBrand && "opacity-0",
                )}
              >
                <Image
                  src="/assets/logo/trimmed/Camelia logo sin fondo vino.png"
                  alt="Camelia"
                  width={828}
                  height={130}
                  priority
                  className="h-5 w-auto"
                />
              </Link>
            )}

            {!open && (
              <div className="flex h-11 items-center gap-5">
                {showCart && (
                  <Link
                    href="/carrito"
                    aria-label="Carrito"
                    // Área de pulsación de 44px alrededor del icono, como el
                    // resto de controles de la barra; el -mr compensa ese
                    // acolchado para que el icono siga alineado al margen.
                    className="relative -mr-2 flex h-11 w-11 items-center justify-center"
                  >
                    {/* 24px en vez de 20: junto al CTA y al "Menu" el icono
                        quedaba pequeño y poco visible. Sube un escalón, sin
                        pasar de la altura de la x del texto de la barra. */}
                    <CartIcon className="h-6 w-6" strokeWidth={1.3} />
                    {itemCount > 0 && (
                      // El contador acompaña al icono: sigue mordiendo su
                      // esquina superior derecha, ahora sobre 24px.
                      <span className="bg-secondary text-background absolute top-1.5 right-1.5 flex h-4 w-4 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] leading-none">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                )}
                {/* TODO(mobile): no hay frame de Figma para el navbar en mobile;
                  el CTA se oculta bajo md y queda accesible vía "Contacto"
                  en el menú — ajustar si llega una referencia mobile real. */}
                {!isShop && (
                  <div className="hidden md:block">
                    {/* Goes to the project brief flow, not the Contacto
                        page — the CTA's own wording is the first step of
                        that form (see FORMULARIO CONTACTO 1). */}
                    {cta && (
                      <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </motion.div>

      {/* Full-bleed (inset-0, not top-20): the new panel covers the bar's
          row too and carries its own wordmark there.

          The panel owns its own reveal (a staggered column curtain, see
          HamburgerMenu) — this just mounts and unmounts it so AnimatePresence
          can play the exit before it leaves the tree. */}
      <AnimatePresence>
        {open && (
          <HamburgerMenu
            key="menu-panel"
            links={navLinks}
            socials={socials}
            onNavigate={() => setOpen(false)}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );

  const portalRoot = mounted ? document.getElementById("navbar-root") : null;
  return portalRoot ? createPortal(header, portalRoot) : header;
}
