"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container, Grid } from "@/components/layout/Container";
import { Multiline } from "@/features/shared/MultilineText";
import { ButtonLink } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { PlusMinusIcon } from "@/components/ui/Accordion";

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
  // Móvil: acordeón. Mismo patrón que AccompanimentSection —pulsar la abierta
  // la cierra, así que pueden quedar las tres cerradas—. En md+ manda el
  // sistema de pestañas de siempre, que no se toca.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    // 100px sobre el título, el mismo hueco que dejan /proyectos y /tienda
    // bajo su cabecera. La Home iba con 40 y su título quedaba pegado al
    // vídeo, fuera del ritmo del resto de secciones.
    <section className="pb-block pt-[100px]">
      <Container>
        <h2 className="font-title text-primary max-w-2xl text-3xl md:text-4xl">
          <Multiline text={title} />
        </h2>

        {/* MÓVIL: cada servicio es su propio bloque —título, su foto y, al
            abrirlo, su texto—, en vez de una foto única que cambiaba al pulsar
            una pestaña de otra columna. */}
        <div className="mt-title space-y-6 md:hidden">
          {tabs.map((tab, index) => {
            const abierto = index === openIndex;
            return (
              <div key={tab._id} className="border-primary/15 border-t pt-6">
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex((prev) => (prev === index ? null : index))
                  }
                  aria-expanded={abierto}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="font-title text-primary text-2xl">
                    {tab.title}
                  </span>
                  <PlusMinusIcon open={abierto} />
                </button>

                <div className="relative mt-4 aspect-square w-full overflow-hidden">
                  <Image
                    src={imageProps(tab.image)?.src ?? ""}
                    alt={tab.title}
                    fill
                    className="object-cover"
                    style={{
                      objectPosition: imageProps(tab.image)?.objectPosition,
                    }}
                    sizes="100vw"
                  />
                </div>

                <AnimatePresence initial={false}>
                  {abierto && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-primary/75 mt-md text-sm leading-relaxed">
                        {tab.shortDescription}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Uno solo al final de los tres: repetido dentro de cada
              desplegable, la misma llamada aparecía hasta tres veces y perdía
              fuerza. Aquí cierra el bloque de servicios. */}
          {cta && (
            <ButtonLink href={cta.href} className="mt-title">
              {cta.label}
            </ButtonLink>
          )}
        </div>

        <Grid className="mt-title max-md:hidden">
          <div className="col-span-12 md:col-span-6">
            {/* Mismo ancho que antes; lo que cambia es el alto: de 3/2 a cuadrado.
                Las fotos de servicio son verticales, así que a 3/2 se les
                recortaba medio encuadre. No es zoom — la caja es más alta y
                por eso cabe más foto. */}
            <div className="relative aspect-square w-full overflow-hidden">
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
