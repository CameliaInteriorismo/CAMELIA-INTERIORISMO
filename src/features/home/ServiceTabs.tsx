"use client";

import Image from "next/image";
import { useState } from "react";
import { Container, Grid } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";

import { imageProps, type SanityImageSource } from "@/sanity/lib/image";
import type { LinkData } from "@/features/shared/types";

export type HomeService = {
  _id: string;
  title: string;
  shortDescription?: string;
  image?: SanityImageSource;
};

/**
 * HorizontalTabs pide `label`; el servicio lo llama `title`. Se adapta aquí
 * en vez de renombrar el campo en Sanity, donde "Nombre" se entiende mejor.
 */
type Tab = HomeService & { label: string };

export function ServiceTabs({
  services,
  title,
  cta,
}: {
  services: HomeService[];
  title?: string;
  cta?: LinkData;
}) {
  const tabs: Tab[] = services.map((s) => ({ ...s, label: s.title }));
  const [activeIndex, setActiveIndex] = useState(0);
  const current = tabs[activeIndex];

  return (
    <section className="py-block">
      <Container>
        <h2 className="font-title text-primary max-w-2xl text-3xl md:text-4xl">
          {title}
        </h2>

        <Grid className="mt-title">
          {/* 4 columnas en vez de 6, y la proporción recalculada para que la
              ALTURA no cambie: a 12 columnas de 64px con 32 de calle, seis
              columnas miden 544px y cuatro miden 352. A 3/2 el alto era
              362,67px, así que 352/363 lo deja igual con la foto más
              estrecha. Las imágenes de servicio son verticales y así se
              lucen; antes se recortaban por arriba y por abajo. */}
          <div className="col-span-12 md:col-span-4">
            <div className="relative aspect-[352/363] w-full overflow-hidden">
              <Image
                src={imageProps(current?.image)?.src ?? ""}
                alt={current?.title ?? ""}
                fill
                className="object-cover"
                style={{
                  objectPosition: imageProps(current?.image)?.objectPosition,
                }}
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <p className="text-primary/75 mt-md w-full text-sm leading-relaxed">
              {current?.shortDescription}
            </p>
            {cta && (
              <ButtonLink href={cta.href} className="mt-md">
                {cta.label}
              </ButtonLink>
            )}
          </div>

          {/* El texto se acerca para conservar la MISMA calle que antes: la
              foto acababa en la 6 y el texto entraba en la 8, dejando la 7 en
              medio. Ahora acaba en la 4 y entra en la 6, con la 5 en medio.
              Su ancho no cambia: sigue ocupando cinco columnas. */}
          <div className="col-span-12 mt-12 md:col-span-5 md:col-start-6 md:mt-0">
            <Tabs
              items={tabs}
              activeIndex={activeIndex}
              onChange={setActiveIndex}
            />
          </div>
        </Grid>
      </Container>
    </section>
  );
}
