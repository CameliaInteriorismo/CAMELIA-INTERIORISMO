"use client";

import Image from "next/image";
import { useState } from "react";
import { Container, Grid } from "@/components/layout/Container";
import { Multiline } from "@/features/shared/MultilineText";
import { HorizontalTabs } from "@/components/ui/HorizontalTabs";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

// TODO(content): "Diseño del proyecto" y "Ejecución y seguimiento" mostraban
// el mismo párrafo en las capturas del prototipo que nos pasó el cliente —
// confirmar si es intencional o si falta redactar el texto de una de las dos.
// TODO(asset): las fotos de estas 3 pestañas no llegaron como archivo (solo
// se vieron en capturas de pantalla del prototipo) — sustituir en cuanto se
// puedan exportar a Diseño/.
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";

export type ProcessStep = {
  _key: string;
  label: string;
  title: string;
  paragraphs?: string[];
  image?: SanityImageSource;
};

// Numbered from the array index rather than written into the data, so the
// sequence can't fall out of step if a phase is added, removed or reordered.
const numbered = (steps: ProcessStep[]) =>
  steps.map((tab, index) => ({
    ...tab,
    label: `${index + 1}. ${tab.label}`,
  }));

export function ProcesoTabs({
  steps,
  title,
}: {
  steps: ProcessStep[];
  title?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = steps[activeIndex];
  const image = imageProps(current?.image);

  return (
    <section className="pt-[80px]">
      <Container>
        <h2 className="font-title text-primary text-center text-3xl md:text-4xl">
          <Multiline text={title} />
        </h2>

        <HorizontalTabs
          items={numbered(steps)}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
          layoutId="proceso-tab-underline"
          className="mt-title"
        />

        <Grid className="mt-title md:items-start">
          <div className="col-span-12 md:col-span-5 md:row-start-1 md:flex md:flex-col md:justify-start">
            <div>
              <h3 className="font-title text-primary text-2xl">
                {activeIndex + 1}. {current?.title}
              </h3>
              <div className="text-primary/75 mt-md space-y-md text-sm leading-relaxed">
                {(current?.paragraphs ?? []).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 mt-12 md:col-span-5 md:col-start-8 md:row-start-1 md:mt-0">
            {image ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt || current.title}
                  fill
                  className="object-cover"
                  style={{ objectPosition: image.objectPosition }}
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
              </div>
            ) : (
              <PlaceholderImage
                aspectRatio="4 / 5"
                label={`Imagen ${current?.label ?? ""} — sin foto`}
                className="w-full"
              />
            )}
          </div>
        </Grid>
      </Container>
    </section>
  );
}
