"use client";

import Image from "next/image";
import { useState } from "react";
import { Container, Grid } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";

const SERVICE_TABS = [
  {
    label: "Interiorismo",
    image: "/assets/home/Interiorismo.jpg",
    caption:
      "Cada proyecto nace de entender cómo vive y qué necesita cada cliente, para traducirlo en espacios coherentes, funcionales y bien resueltos.",
  },
  {
    label: "Ejecución y supervisión de obra",
    image: "/assets/home/Ejecucion y supervision.jpg",
    caption:
      "Supervisamos la ejecución del proyecto y coordinamos todos los oficios para asegurar que cada decisión se construya con rigor, criterio y atención al detalle.",
  },
  {
    label: "Decoración",
    image: "/assets/home/Decoracion.jpg",
    caption:
      "Seleccionamos mobiliario, iluminación, textiles y piezas auxiliares entendiendo la decoración como parte del proyecto, buscando siempre coherencia y equilibrio en el conjunto.",
  },
];

export function ServiceTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = SERVICE_TABS[activeIndex];

  return (
    <section className="py-block">
      <Container>
        <h2 className="font-title text-primary max-w-2xl text-3xl uppercase md:text-4xl">
          Diseñamos espacios que cuentan historias
        </h2>

        <Grid className="mt-title">
          <div className="col-span-12 md:col-span-6">
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src={current.image}
                alt={current.label}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <p className="text-primary/75 mt-md w-full text-sm leading-relaxed">
              {current.caption}
            </p>
            <ButtonLink href="/servicios" className="mt-md">
              SOBRE NUESTROS SERVICIOS
            </ButtonLink>
          </div>

          <div className="col-span-12 mt-12 md:col-span-5 md:col-start-8 md:mt-0">
            <Tabs
              items={SERVICE_TABS}
              activeIndex={activeIndex}
              onChange={setActiveIndex}
            />
          </div>
        </Grid>
      </Container>
    </section>
  );
}
