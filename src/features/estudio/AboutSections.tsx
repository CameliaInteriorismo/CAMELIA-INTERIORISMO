"use client";

import Image from "next/image";
import { useState } from "react";
import { Container, Grid } from "@/components/layout/Container";
import { IndicatorList } from "@/components/ui/IndicatorList";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

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

export function AboutSections({ sections }: { sections: AboutSection[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = sections[activeIndex];
  const image = imageProps(current?.image);
  // Un bloque sin tramos cae en los párrafos del formato anterior, envueltos
  // en un tramo sin subtítulo: así el componente pinta siempre lo mismo.
  const blocks: AboutBlock[] = current?.blocks?.length
    ? current.blocks
    : [{ paragraphs: current?.paragraphs ?? [] }];

  return (
    // pt-[120px] = navbar's own 80px height (now `fixed`, out of flow) +
    // the section's usual pt-block (40px) — keeps the same visual gap
    // from the viewport top as before, just no longer supplied for free
    // by a sticky navbar reserving its own space in the document flow.
    <section className="pt-[120px] pb-[100px]">
      <Container>
        <h1 className="sr-only">Estudio</h1>
        <Grid>
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
            {image ? (
              <div className="relative aspect-[16/10] w-full overflow-hidden">
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
                className="w-full"
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
            <div className="text-primary/80 mt-title text-sm leading-relaxed">
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
                      className="text-primary text-base font-semibold"
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
