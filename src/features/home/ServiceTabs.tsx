"use client";

import Image from "next/image";
import { useState } from "react";
import { Container, Grid } from "@/components/layout/Container";
import { Multiline } from "@/features/shared/MultilineText";
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
          <Multiline text={title} />
        </h2>

        <Grid className="mt-title">
          <div className="col-span-12 md:col-span-6">
            <div className="relative aspect-[3/2] w-full overflow-hidden">
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

          <div className="col-span-12 mt-12 md:col-span-5 md:col-start-8 md:mt-0">
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
