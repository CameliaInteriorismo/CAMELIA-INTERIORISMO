"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container, Grid } from "@/components/layout/Container";
import { IndicatorList } from "@/components/ui/IndicatorList";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { motion } from "framer-motion";

import { imageProps, type SanityImageSource } from "@/sanity/lib/image";
import { cn } from "@/utils/cn";

export type AboutSection = {
  _key: string;
  title: string;
  /** IndicatorList lo exige siempre presente; la migración lo rellena. */
  subtitle: string;
  /** Formato anterior: párrafos sueltos, sin subtítulos. Sigue leyéndose. */
  paragraphs?: string[];
  blocks?: AboutBlock[];
  image?: SanityImageSource;
};

/** Un tramo de texto con subtítulo propio. El subtítulo es opcional. */
export type AboutBlock = {
  _key?: string;
  heading?: string;
  paragraphs?: string[];
};

/** Un tramo de texto ya renderizado, para no repetirlo entre las dos vistas. */
function Tramos({ blocks }: { blocks: AboutBlock[] }) {
  return (
    <div className="text-primary/80 text-sm leading-relaxed">
      {blocks.map((block, index) => (
        <div key={block._key ?? index} className={index > 0 ? "mt-block" : ""}>
          {block.heading && (
            <h3
              className="text-primary text-base font-[450]"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              {block.heading}
            </h3>
          )}
          <div className={cn("space-y-4", block.heading && "mt-2")}>
            {(block.paragraphs ?? []).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AboutSections({ sections }: { sections: AboutSection[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  // MÓVIL: las tres secciones van apiladas y se recorren con scroll, así que
  // el indicador deja de ser un menú de pulsación y pasa a marcar por dónde
  // vas. `enScroll` es el índice de la sección que ocupa la franja central del
  // viewport; el observer lo actualiza en los dos sentidos.
  const [enScroll, setEnScroll] = useState(0);
  const movilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = movilRef.current;
    if (!el) return;
    const bloques = [...el.querySelectorAll<HTMLElement>("[data-seccion]")];
    if (!bloques.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        // Gana la que más superficie ocupa en la franja central: con scroll
        // rápido pueden entrar dos a la vez y así no parpadea.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const i = bloques.indexOf(visible.target as HTMLElement);
          if (i >= 0) setEnScroll(i);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    bloques.forEach((b) => obs.observe(b));
    return () => obs.disconnect();
  }, [sections]);
  const current = sections[activeIndex];
  const image = imageProps(current?.image);
  // Un bloque sin tramos cae en los párrafos del formato anterior, envueltos
  // en un tramo sin subtítulo: así el componente pinta siempre lo mismo.
  const blocks: AboutBlock[] = current?.blocks?.length
    ? current.blocks
    : [{ paragraphs: current?.paragraphs ?? [] }];

  return (
    // Vuelve al `pt-block` de siempre. Llevaba 120px (40 + los 80 de la barra)
    // porque la barra iba flotando y había que reservarle su alto a mano;
    // ahora ocupa su sitio en el flujo, así que sumarlos otra vez dejaría el
    // doble de hueco. El aire visible sobre el primer bloque es el mismo.
    <section className="pt-block">
      <Container>
        <h1 className="sr-only">
          Sobre Camelia — Interiorismo en Alzira, Valencia
        </h1>
        {/* MÓVIL: las tres secciones apiladas. La línea de la izquierda es
            una sola —el carril tenue de fondo— y sobre ella crece la parte
            marcada hasta donde has llegado, así que se lee como un recorrido y
            no como tres indicadores sueltos. */}
        <div ref={movilRef} className="relative pl-8 md:hidden">
          <div className="bg-primary/15 absolute top-0 bottom-0 left-0 w-px" />
          <motion.div
            className="bg-primary absolute top-0 left-0 w-px"
            animate={{
              height: `${((enScroll + 1) / Math.max(sections.length, 1)) * 100}%`,
            }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          />

          {sections.map((seccion, i) => {
            const foto = imageProps(seccion.image);
            const tramos: AboutBlock[] = seccion.blocks?.length
              ? seccion.blocks
              : [{ paragraphs: seccion.paragraphs ?? [] }];
            return (
              <div
                key={seccion._key}
                data-seccion
                className={i > 0 ? "mt-section" : ""}
              >
                <h2
                  className={cn(
                    "font-title text-2xl transition-colors duration-300",
                    i === enScroll ? "text-primary" : "text-primary/40",
                  )}
                >
                  {seccion.title}
                </h2>
                {/* El subtítulo se perdía solo en móvil: la vista apilada
                    pintaba el título y saltaba a la foto, mientras que desde
                    `md` el IndicatorList sí lo muestra bajo cada nombre. Mismo
                    dato y mismo tratamiento que allí. */}
                {seccion.subtitle && (
                  <p className="text-primary/70 mt-2 text-xs tracking-wide">
                    {seccion.subtitle}
                  </p>
                )}

                {foto ? (
                  <div className="mt-md relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={foto.src}
                      alt={foto.alt || seccion.title}
                      fill
                      className="object-cover"
                      style={{ objectPosition: foto.objectPosition }}
                      sizes="100vw"
                    />
                  </div>
                ) : (
                  <PlaceholderImage
                    aspectRatio="4 / 5"
                    label={`Imagen ${seccion.title} — sin foto`}
                    className="mt-md w-full"
                  />
                )}

                <div className="mt-md">
                  <Tramos blocks={tramos} />
                </div>
              </div>
            );
          })}
        </div>

        <Grid className="max-md:hidden">
          <div className="col-span-12 md:col-span-4 md:h-[min(calc(100vh-160px),580px)]">
            <IndicatorList
              items={sections}
              activeIndex={activeIndex}
              onChange={setActiveIndex}
              layoutId="estudio-indicator"
            />
          </div>

          <div className="col-span-12 mt-12 md:col-span-7 md:col-start-6 md:mt-0">
            {/* La foto del bloque activo. Antes esto era un recuadro fijo de
                relleno: el campo existía en Sanity y viajaba en la consulta,
                pero aquí no se leía, así que subir la foto en el panel no
                cambiaba nada. El recuadro y su proporción son los mismos. */}
            {/* Apilada ocupa todo el ancho, y a 16/10 salía una franja
                aplastada. Bajo lg va a 4/5 para que gane presencia vertical;
                desde lg vuelve al 16/10 de siempre. `object-cover` recorta,
                nunca deforma. */}
            {image ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden lg:aspect-[16/10]">
                <Image
                  src={image.src}
                  alt={image.alt || current?.title || ""}
                  fill
                  className="object-cover"
                  style={{ objectPosition: image.objectPosition }}
                  placeholder={image.blurDataURL ? "blur" : undefined}
                  blurDataURL={image.blurDataURL}
                  sizes="(min-width: 768px) 58vw, 100vw"
                />
              </div>
            ) : (
              <PlaceholderImage
                aspectRatio="16 / 10"
                label={`Imagen ${current?.title ?? "Estudio"} — sin foto`}
                className="aspect-[4/5] w-full lg:aspect-[16/10]"
              />
            )}
            {/* Los tramos con subtítulo mandan; si un bloque solo tiene el
                texto del formato anterior, se pinta como antes y no se pierde.

                El aire va donde toca: 16px entre los párrafos de un
                mismo tramo, `mt-2` entre el subtítulo y su primer párrafo —van
                juntos, son la misma idea— y `mt-block` (40px) entre un tramo y
                el siguiente.

                Los párrafos van a 24 y no a 32 porque a 32 quedaban casi tan
                separados como los propios tramos, y el texto se leía como
                fragmentos sueltos en vez de como una unidad. La distancia
                entre "Nuestra historia" y "Nuestra filosofía" no se toca: es
                la que hace ver que empieza otra parte. */}
            <div className="text-primary/80 mt-content text-sm leading-relaxed">
              {blocks.map((block, index) => (
                <div
                  key={block._key ?? index}
                  className={index > 0 ? "mt-block" : ""}
                >
                  {block.heading && (
                    // Plus Jakarta en estilo en línea: ni `font-sans` ni la
                    // utilidad arbitraria ganaban a la familia que hereda el
                    // bloque, y estos dos subtítulos son de cuerpo, no
                    // titulares.
                    <h3
                      className="text-primary text-base font-[450]"
                      style={{ fontFamily: "var(--font-plus-jakarta)" }}
                    >
                      {block.heading}
                    </h3>
                  )}
                  <div className={cn("space-y-4", block.heading && "mt-2")}>
                    {(block.paragraphs ?? []).map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
}
