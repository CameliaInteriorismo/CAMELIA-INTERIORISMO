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
  // Arranca sin ninguna pestaña seleccionada: abría en Interiorismo y su
  // descripción aparecía bajo la foto sin que nadie la hubiera pedido. La
  // imagen sigue mostrándose —cae en la primera mientras no haya selección—;
  // lo que se oculta es el texto del servicio.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const current = activeIndex === null ? undefined : tabs[activeIndex];
  /** La foto que se ve mientras no hay servicio elegido. */
  const visible = current ?? tabs[0];
  // Móvil: acordeón. Mismo patrón que AccompanimentSection —pulsar la abierta
  // la cierra, así que pueden quedar las tres cerradas—. En md+ manda el
  // sistema de pestañas de siempre, que no se toca.
  //
  // Arranca con las tres cerradas: abría en Interiorismo, y el texto de esa
  // primera aparecía sin que nadie lo hubiera pedido. El contenido se muestra
  // ahora solo como consecuencia de abrir su punto.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    // 100px sobre el título, el mismo hueco que dejan /proyectos y /tienda
    // bajo su cabecera. La Home iba con 40 y su título quedaba pegado al
    // vídeo, fuera del ritmo del resto de secciones.
    <section className="pt-section">
      <Container>
        <h2 className="font-title text-primary max-w-2xl text-3xl md:text-4xl">
          <Multiline text={title} />
        </h2>

        {/* MÓVIL: cada servicio es su propio bloque —título, su foto y, al
            abrirlo, su texto—, en vez de una foto única que cambiaba al pulsar
            una pestaña de otra columna. */}
        <div className="mt-content space-y-6 md:hidden">
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
                    // Solo se ve bajo md, dentro del Container (px-6): el
                    // ancho real nunca es el 100vw declarado por defecto.
                    sizes="(max-width: 767px) calc(100vw - 48px), 100vw"
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
        </div>

        {/* Fuera del `space-y`: dentro, el contenedor le añadía sus 24px
            ADEMÁS del `mt-md` del botón, y la misma separación tenía dos
            fuentes —48px reales donde el sistema dice 24—. Aquí el único
            responsable del aire es el botón. */}
        {cta && (
          <ButtonLink href={cta.href} className="mt-md md:hidden">
            {cta.label}
          </ButtonLink>
        )}

        <Grid className="mt-content max-md:hidden">
          <div className="col-span-12 md:col-span-6">
            {/* Mismo ancho que antes; lo que cambia es el alto: de 3/2 a cuadrado.
                Las fotos de servicio son verticales, así que a 3/2 se les
                recortaba medio encuadre. No es zoom — la caja es más alta y
                por eso cabe más foto. */}
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={imageProps(visible?.image)?.src ?? ""}
                alt={visible?.title ?? ""}
                fill
                className="object-cover"
                style={{
                  objectPosition: imageProps(visible?.image)?.objectPosition,
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
              activeIndex={activeIndex ?? -1}
              onChange={setActiveIndex}
            />
          </div>
        </Grid>
      </Container>
    </section>
  );
}
