"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { isNavInFlow } from "@/components/layout/navPlacement";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { PAGE_TITLE_SCALE } from "@/components/ui/typography";
import { useHeroStore } from "@/stores/heroStore";
import { cn } from "@/utils/cn";

/**
 * Full-bleed cover photo + centered title — the interior-page header
 * template shared by Metodología and Servicios (see Diseño/SERVICIOS.png,
 * which has its real photo, and Diseño/METODOLOGÍA.png, which exports that
 * region as transparent since no fill was assigned yet).
 *
 * Behaves exactly like Home's Hero: 100dvh, nothing else visible before the
 * user scrolls, and it drives the shared `heroActive` flag so Navbar floats
 * transparently over it (see Navbar.tsx's `hasHero` check). No travelling
 * logo here (there's nothing to hand off to), so it skips the GSAP timeline
 * Home's Hero uses and just tracks its own viewport intersection.
 */
export function PageHeroBanner({
  title,
  image,
  placeholderLabel,
  titleClassName = "text-primary",
  imagePosition = "center",
}: {
  title: string;
  image?: string;
  placeholderLabel?: string;
  titleClassName?: string;
  imagePosition?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const setHeroActive = useHeroStore((state) => state.setHeroActive);
  const navInFlow = isNavInFlow(usePathname());

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroActive(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      setHeroActive(false);
    };
  }, [setHeroActive]);

  return (
    // La portada siempre descuenta del viewport los 80px de la barra, así que
    // llega justo al borde inferior de la pantalla sin que la barra le coma la
    // franja de arriba. Lo que cambia es de dónde salen esos 80px: si la barra
    // va en el flujo (ver navPlacement.ts) ya los ocupa ella y la portada
    // empieza pegada debajo; si flota —fichas de proyecto— hay que reservarlos
    // con el margen. El recorte y el punto focal no cambian: la foto sigue con
    // `object-cover` sobre la misma caja.
    <section
      ref={ref}
      className={cn(
        "relative h-[calc(100dvh-var(--nav-h))] w-full overflow-hidden",
        !navInFlow && "mt-[var(--nav-h)]",
      )}
    >
      {image ? (
        <Image
          src={image}
          alt=""
          aria-hidden
          fill
          priority
          quality={90}
          className="object-cover"
          style={{ objectPosition: imagePosition }}
          sizes="100vw"
        />
      ) : (
        <PlaceholderImage
          aspectRatio="auto"
          label={placeholderLabel ?? "Banner — sin foto en Diseño/"}
          className="absolute inset-0 h-full w-full"
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1
          className={cn(
            // Las cabeceras van en mayúsculas por diseño, y lo decide este
            // componente: la escala compartida solo dimensiona. Así los
            // títulos de contenido, que se leen tal cual se escriben en el
            // panel, no se ven arrastrados por esta decisión.
            "font-title px-6 text-center uppercase",
            PAGE_TITLE_SCALE,
            titleClassName,
          )}
        >
          {title}
        </h1>
      </div>
    </section>
  );
}
