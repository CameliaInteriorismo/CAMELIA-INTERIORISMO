"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/animations/gsap/gsapConfig";
import { createHeroScrollTimeline } from "@/animations/gsap/heroScrollTimeline";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { useHeroStore } from "@/stores/heroStore";

// Servido desde Cloudinary: f_auto elige el códec según el navegador (webm o
// mp4, aunque el original sea .mov) y q_auto ajusta la compresión, de modo que
// el hero deja de arrastrar el fichero original completo desde public/.
//
// c_limit,w_1920 es un techo, no un reescalado: solo actúa si el máster supera
// los 1920px de ancho, y nunca recorta (c_limit conserva la proporción). Este
// vídeo mide 1288px, así que hoy no hace nada — está para que sustituir el
// máster por uno en 4K no dispare el peso sin que nadie se entere.
const HERO_VIDEO =
  "https://res.cloudinary.com/uvofxvtg/video/upload/f_auto,q_auto,c_limit,w_1920/VIDEO_HOME_nozgqt.mov";

const REVEAL_THRESHOLD = 0.85;
// Below this scroll progress through the hero's own height, the hero is
// still (at least partly) on screen — matches the ScrollTrigger's own
// `end: "bottom top"`, i.e. progress 1 is exactly the moment the hero's
// bottom edge leaves the viewport ("el Hero desaparece").
const HERO_ACTIVE_END = 0.999;

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const setLogoRevealed = useHeroStore((state) => state.setLogoRevealed);
  const setHeroActive = useHeroStore((state) => state.setHeroActive);

  useEffect(() => {
    const heroEl = heroRef.current;
    const logoEl = logoRef.current;
    const navbarBrandEl = document.getElementById("navbar-brand");
    if (!heroEl || !logoEl || !navbarBrandEl) return;

    let ctx: gsap.Context | undefined;
    let resizeTimeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const build = () => {
      if (cancelled) return;
      ctx?.revert();
      ctx = gsap.context(() => {
        const timeline = createHeroScrollTimeline({
          heroEl,
          logoEl,
          navbarBrandEl,
          onProgress: (progress) => {
            setLogoRevealed(progress > REVEAL_THRESHOLD);
            setHeroActive(progress < HERO_ACTIVE_END);
          },
        });
        // ScrollTrigger normally (re)measures start/end on the window `load`
        // event; by the time this effect runs, `load` has long since fired,
        // so without an explicit refresh the trigger's start/end never get
        // computed and it silently never fires. Force one here.
        ScrollTrigger.refresh();
        // Sync immediately so a page reload/back-navigation mid-scroll
        // doesn't briefly show both wordmarks at once.
        const initialProgress = timeline.scrollTrigger?.progress ?? 0;
        setLogoRevealed(initialProgress > REVEAL_THRESHOLD);
        setHeroActive(initialProgress < HERO_ACTIVE_END);
      });
    };

    build();
    // Local fonts (next/font/local) can swap in after this first measurement
    // and reflow the hero text; re-measure once they're ready.
    document.fonts?.ready.then(build);

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(build, 200);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      ctx?.revert();
      setLogoRevealed(false);
      setHeroActive(false);
    };
  }, [setLogoRevealed, setHeroActive]);

  return (
    <div ref={heroRef} className="relative h-dvh w-full">
      <VideoBackground src={HERO_VIDEO} />
      <div
        ref={logoRef}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "clamp(280px, 45vw, 776px)",
          aspectRatio: "776 / 714",
        }}
      >
        <Image
          src="/assets/logo/Camelia logo sin fondo blanco.png"
          alt="Camelia"
          fill
          priority
          className="object-contain"
          sizes="(min-width: 1024px) 776px, 45vw"
        />
      </div>
    </div>
  );
}
