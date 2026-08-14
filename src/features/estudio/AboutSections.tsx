"use client";

import Image from "next/image";
import { useState } from "react";
import { Container, Grid } from "@/components/layout/Container";
import { IndicatorList } from "@/components/ui/IndicatorList";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

import { imageProps, type SanityImageSource } from "@/sanity/lib/image";

export type AboutSection = {
  _key: string;
  title: string;
  /** IndicatorList lo exige siempre presente; la migración lo rellena. */
  subtitle: string;
  paragraphs?: string[];
  image?: SanityImageSource;
};

export function AboutSections({ sections }: { sections: AboutSection[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = sections[activeIndex];
  const image = imageProps(current?.image);

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
            <div className="text-primary/80 mt-title space-y-md text-sm leading-relaxed">
              {(current?.paragraphs ?? []).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
}
