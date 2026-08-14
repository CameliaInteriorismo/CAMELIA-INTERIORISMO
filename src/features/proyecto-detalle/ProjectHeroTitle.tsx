"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { useHeroStore } from "@/stores/heroStore";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";

export function ProjectHeroTitle({
  name,
  heroVideo,
  heroImage,
}: {
  name: string;
  heroVideo?: string;
  heroImage?: SanityImageSource;
}) {
  const hero = imageProps(heroImage);
  const heroRef = useRef<HTMLElement>(null);
  const setHeroActive = useHeroStore((state) => state.setHeroActive);

  // Project fichas are `hasHero` pages (see Navbar.tsx) — same transparent-
  // over-hero, solid-once-scrolled-past treatment as Home/Metodología/
  // Servicios/the Proyectos grid, driven by `heroActive` via the same
  // IntersectionObserver mechanism PageHeroBanner uses.
  useEffect(() => {
    const el = heroRef.current;
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
    <section ref={heroRef} className="relative h-dvh w-full overflow-hidden">
      {heroVideo ? (
        <VideoBackground src={heroVideo} />
      ) : hero ? (
        <Image
          src={hero.src}
          alt={hero.alt}
          aria-hidden={!hero.alt}
          fill
          priority
          placeholder={hero.blurDataURL ? "blur" : undefined}
          blurDataURL={hero.blurDataURL}
          className="object-cover"
          style={{ objectPosition: hero.objectPosition }}
          sizes="100vw"
        />
      ) : (
        <PlaceholderImage
          aspectRatio="auto"
          label="Hero — sin foto/vídeo en Diseño/"
          className="absolute inset-0 h-full w-full"
        />
      )}

      {/* Static title, pinned to the hero's bottom-left corner exactly as it
          renders on load — no scroll tracking, no transform, no crossfade.
          Sits close to the true viewport edge, not Container's wide inset —
          matches the reference composition. */}
      <div className="absolute inset-x-0 bottom-12 z-10 px-6 sm:px-10">
        <h1 className="font-title text-background m-0 text-4xl sm:text-5xl md:text-6xl">
          Proyecto {name}
        </h1>
      </div>
    </section>
  );
}
