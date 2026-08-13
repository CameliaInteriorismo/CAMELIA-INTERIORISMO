"use client";

import Image from "next/image";
import { useState } from "react";
import { Container, Grid } from "@/components/layout/Container";
import { HorizontalTabs } from "@/components/ui/HorizontalTabs";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

interface ProcesoTab {
  label: string;
  title: string;
  body: string[];
  image: string | null;
}

// TODO(content): "Diseño del proyecto" y "Ejecución y seguimiento" mostraban
// el mismo párrafo en las capturas del prototipo que nos pasó el cliente —
// confirmar si es intencional o si falta redactar el texto de una de las dos.
// TODO(asset): las fotos de estas 3 pestañas no llegaron como archivo (solo
// se vieron en capturas de pantalla del prototipo) — sustituir en cuanto se
// puedan exportar a Diseño/.
const PROCESO_TABS: ProcesoTab[] = [
  {
    label: "Primer contacto",
    title: "Escuchar antes de diseñar",
    body: [
      "El primer paso es conocernos. Nos pondremos en contacto contigo en un plazo de 24 horas para que puedas contarnos qué necesitas y cómo podemos ayudarte.",
      "Si encajamos, agendamos una visita en el estudio donde abordamos el proyecto con más detalle. En este punto es importante contar con toda la información disponible (planos, fotos, referencias...), ya que nos ayudará a entender mejor el punto de partida.",
    ],
    image: "/assets/metodologia/proceso-primer-contacto.jpg",
  },
  {
    label: "Diseño del proyecto",
    title: "Traducir ideas en espacio",
    body: [
      "A partir de ahí, comenzamos la fase de diseño. Analizamos tu forma de vivir, tus necesidades y las condiciones técnicas del espacio para desarrollar una propuesta coherente y bien resuelta.",
      "En esta fase se define el proyecto en su totalidad, tanto a nivel estético como funcional, y se genera toda la documentación necesaria para poder ejecutarlo con precisión.",
    ],
    image: null,
  },
  {
    label: "Propuesta económica",
    title: "Transparencia desde el inicio",
    body: [
      "Una vez definido el proyecto, elaboramos una oferta detallada donde se valoran todos los trabajos a realizar.",
      "Esto permite tener una visión clara del alcance del proyecto y tomar decisiones con seguridad antes de iniciar la obra.",
    ],
    image: null,
  },
  {
    label: "Ejecución y seguimiento",
    title: "Del proyecto a la realidad",
    body: [
      "A partir de ahí, comenzamos la fase de diseño. Analizamos tu forma de vivir, tus necesidades y las condiciones técnicas del espacio para desarrollar una propuesta coherente y bien resuelta.",
      "En esta fase se define el proyecto en su totalidad, tanto a nivel estético como funcional, y se genera toda la documentación necesaria para poder ejecutarlo con precisión.",
    ],
    image: null,
  },
];

// Numbered from the array index rather than written into the data, so the
// sequence can't fall out of step if a phase is added, removed or reordered.
const NUMBERED_TABS = PROCESO_TABS.map((tab, index) => ({
  ...tab,
  label: `${index + 1}. ${tab.label}`,
}));

export function ProcesoTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = PROCESO_TABS[activeIndex];

  return (
    <section className="pt-[80px]">
      <Container>
        <h2 className="font-title text-primary text-center text-3xl uppercase md:text-4xl">
          El proceso
        </h2>

        <HorizontalTabs
          items={NUMBERED_TABS}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
          layoutId="proceso-tab-underline"
          className="mt-title"
        />

        <Grid className="mt-title">
          <div className="col-span-12 md:col-span-5 md:row-start-1 md:flex md:flex-col md:justify-center">
            <div>
              <h3 className="font-title text-primary text-2xl">
                {activeIndex + 1}. {current.title}
              </h3>
              <div className="text-primary/75 mt-md space-y-md text-sm leading-relaxed">
                {current.body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 mt-12 md:col-span-5 md:col-start-8 md:row-start-1 md:mt-0">
            {current.image ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
              </div>
            ) : (
              <PlaceholderImage
                aspectRatio="4 / 5"
                label={`Imagen ${current.label} — sin archivo en Diseño/`}
                className="w-full"
              />
            )}
          </div>
        </Grid>
      </Container>
    </section>
  );
}
