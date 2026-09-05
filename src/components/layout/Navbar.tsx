"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { HamburgerMenu } from "@/components/layout/HamburgerMenu";
import { ButtonLink } from "@/components/ui/Button";
import { CartIcon, MenuIcon } from "@/components/ui/icons";
import { cn } from "@/utils/cn";
import { isNavFloating, isNavInFlow } from "@/components/layout/navPlacement";
import { useCartHasHydrated, useCartStore } from "@/stores/cartStore";
import { useHeroStore } from "@/stores/heroStore";
import type { LinkData } from "@/features/shared/types";
import type { Social } from "@/features/contacto/types";

export function Navbar({
  navLinks,
  cta,
  socials,
  menuLabel,
  cartLabel,
}: {
  navLinks: LinkData[];
  cta?: LinkData;
  socials: Social[];
  menuLabel?: string;
  cartLabel?: string;
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
    pathname === "/tienda";
  // Legal pages (see features/legal/LegalPage) have none at all — they open
  // on a plain field, so they keep the normal solid bar too.
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
  // La barra solo flota sobre la foto en las FICHAS de proyecto, que son la
  // excepción: su portada está pensada para verse entera de borde a borde.
  // En el resto la barra va en crema y la portada empieza justo debajo (ver
  // PageHeroBanner y home/Hero), para que la barra no le coma un trozo.
  const isProjectDetail = isNavFloating(pathname);
  // §6: en las páginas con portada la barra deja de flotar y pasa al flujo.
  const inFlow = isNavInFlow(pathname);
  const transparentNav = isProjectDetail && heroActive && !open && !isShop;

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
        // Una sola regla para todo el sitio: la barra sale en su sitio arriba
        // y se queda pegada mientras bajas, sin ocultarse ni reaparecer sola.
        // La única excepción son las FICHAS de proyecto, que la dejan flotando
        // sobre su portada a sangre (ver navPlacement.ts).
        //
        // Para que `sticky` funcione de verdad hace falta que el contenedor
        // del portal no genere caja: ver `#navbar-root` en app/layout.tsx.
        inFlow ? "sticky top-0" : "fixed inset-x-0 top-0",
      )}
    >
      {/* El fondo y la línea viven aquí, no en <header>: el menú de la
          hamburguesa que cuelga debajo es `fixed` y así se posiciona contra
          la pantalla, sin heredar de un ancestro transformado. */}
      <div
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
          {/* Tres zonas con los lados de igual peso (`flex-1`): la del medio
              queda en el centro real de la barra midan lo que midan el menú y
              el CTA, sin depender de un `absolute` que se desplaza en cuanto
              uno de los dos crece. En escritorio el resultado es el mismo que
              antes, porque allí los lados ya se equilibraban solos. */}
          <div className="relative flex h-[var(--nav-row)] items-center justify-between gap-4 lg:gap-0">
            {/* No close control at all once the menu is open: it shuts via
                the panel's own wordmark or by clicking anywhere off the
                links, so the bar simply empties out rather than leaving a
                gap where an X used to sit. */}
            {!open && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={menuLabel ?? "Menu"}
                className="flex h-11 items-center gap-2 text-base font-light tracking-wide uppercase"
              >
                <MenuIcon className="h-3 w-[18px]" />
                {/* TODO(mobile): sin referencia de Figma para mobile; el texto
                  "Menu" se oculta bajo sm para no chocar con el logo
                  centrado — el icono por sí solo ya es reconocible visualmente,
                  pero sin texto en el DOM el botón no tenía nombre accesible
                  para lectores de pantalla; el aria-label cubre justo eso. */}
                <span className="hidden sm:inline" aria-hidden="true">
                  {menuLabel ?? "Menu"}
                </span>
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
                  src="/images/logos/trimmed/Camelia logo sin fondo vino actualizado.png"
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
                    aria-label={cartLabel ?? "Carrito"}
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
                {/* Bajo md el CTA sale de la barra, que en móvil ya va llena
                  con menú, logotipo y carrito. No desaparece: el menú
                  hamburguesa lo recibe por prop y lo pinta al cierre de su
                  navegación. Antes decía que quedaba accesible vía
                  "Contacto", y era falso: ese enlace lleva a /contacto y el
                  CTA a /cuentanos-tu-proyecto, que en móvil se quedaba sin
                  ninguna entrada desde la navegación. */}
                {!isShop && (
                  <div className="hidden md:block">
                    {/* Goes to the project brief flow, not the Contacto
                        page — the CTA's own wording is the first step of
                        that form (see FORMULARIO CONTACTO 1). */}
                    {cta && (
                      <ButtonLink
                        href={cta.href}
                        // El logotipo va centrado en la barra entera y ahí se
                        // queda: lo que lo ahogaba en tablet era el ancho del
                        // botón, que casi le tocaba. Estrechando su padding
                        // entre 768 y 1023 aparece el aire, sin mover el
                        // logotipo ni cambiar tamaños de texto.
                        className="max-lg:px-6"
                      >
                        {cta.label}
                      </ButtonLink>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </div>

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
            cta={cta}
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
