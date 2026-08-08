"use client";

import { useState } from "react";
import { Container, Grid } from "@/components/layout/Container";
import { IndicatorList } from "@/components/ui/IndicatorList";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

const SECTIONS = [
  {
    title: "Sobre nosotros",
    subtitle: "EL ORIGEN DE CAMELIA",
    body: [
      "Somos un estudio de interiorismo en Alzira formado por un equipo joven con experiencia en el sector de la construcción. Entendemos el proyecto desde una base técnica sólida, pero también desde una forma de vivir el espacio más pausada y consciente.",
      "Nuestro trabajo no parte de la tendencia, sino del criterio. Nos interesa desarrollar viviendas que se sostengan en el tiempo, bien resueltas en lo funcional y coherentes en lo estético. Por eso abordamos cada proyecto desde el origen, tomando decisiones que tengan sentido a largo plazo y evitando soluciones superficiales.",
      "Creemos en un proceso claro y acompañado, donde el cliente no tenga que preocuparse por la complejidad de la obra ni por la toma constante de decisiones. Nuestro objetivo es que cada proyecto se viva con tranquilidad, desde el inicio hasta el final, y que el resultado responda de forma honesta a quien lo habita.",
      "Más que transformar espacios, buscamos ordenarlos, darles sentido y construir lugares que puedan mantenerse en el tiempo sin perder su valor.",
    ],
  },
  {
    title: "Dirección creativa",
    subtitle: "LAURA CASTILLO",
    body: [
      "Laura es la interiorista del estudio y la persona encargada de dar forma a cada proyecto desde su origen. Su trabajo parte de entender a quién va a habitar el espacio, analizando sus necesidades para traducirlas en soluciones coherentes y bien resueltas.",
      "Es una persona cercana, implicada y con una forma de trabajar muy orientada al detalle, donde cada decisión tiene un porqué. Afronta cada proyecto con ilusión y una clara vocación por hacer las cosas bien, acompañando al cliente durante todo el proceso.",
    ],
  },
  {
    title: "Dirección ejecutiva",
    subtitle: "ADRIÁN FERRERO",
    body: [
      "Adrián es la persona encargada de coordinar y dar forma al desarrollo de cada proyecto, asegurando que todo funcione como un conjunto. Es quien está en contacto con el cliente desde el inicio, acompañando el proceso y cuidando que la experiencia sea clara, ordenada y sin fricciones.",
      "Su trabajo se centra en la organización, la planificación y la supervisión de obra, coordinando a los distintos equipos y controlando que cada fase se ejecute según lo previsto, tanto en tiempos como en calidad.",
      "Es quien se encarga de que las decisiones tomadas en el diseño se lleven a la realidad con coherencia, evitando desviaciones y resolviendo cualquier imprevisto con criterio. Una figura clave para que el proyecto no solo se piense bien, sino que también se construya correctamente.",
      "Su estilo personal, de carácter más clásico y con una especial sensibilidad hacia los materiales nobles, define en gran medida el lenguaje de los proyectos del estudio. Una forma de entender el interiorismo que busca equilibrio, permanencia y una cierta manera de vivir los espacios desde la calma.",
    ],
  },
];

export function AboutSections() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = SECTIONS[activeIndex];

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
              items={SECTIONS}
              activeIndex={activeIndex}
              onChange={setActiveIndex}
              layoutId="estudio-indicator"
            />
          </div>

          <div className="col-span-12 mt-12 md:col-span-7 md:col-start-6 md:mt-0">
            <PlaceholderImage
              aspectRatio="16 / 10"
              label="Imagen Estudio — sin asset en Figma"
              className="w-full"
            />
            <div className="text-primary/80 mt-title space-y-md text-sm leading-relaxed">
              {current.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
}
