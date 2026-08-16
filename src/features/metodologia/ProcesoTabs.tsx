"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container, Grid } from "@/components/layout/Container";
import { Multiline } from "@/features/shared/MultilineText";
import { HorizontalTabs } from "@/components/ui/HorizontalTabs";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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

/**
 * El texto de una fase. Se pinta dos veces: la copia visible y, detrás, una
 * copia por fase que solo existe para medirlas todas y saber cuál es la más
 * alta. Al ser el mismo componente, no puede quedar una versión desfasada de
 * la otra: cualquier cambio de tipografía o de aire afecta a las dos.
 */
function StepText({ step, number }: { step: ProcessStep; number: number }) {
  return (
    <div>
      <h3 className="font-title text-primary text-2xl">
        {number}. {step.title}
      </h3>
      <div className="text-primary/75 mt-md space-y-md text-sm leading-relaxed">
        {(step.paragraphs ?? []).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  // El alto lo marca la fase cuyo TEXTO necesita más: así cambiar de pestaña
  // no mueve nada de lo que hay debajo, y la foto de al lado llega siempre
  // hasta el mismo sitio. No es un número puesto a mano — si mañana se alarga
  // un párrafo o se añade una fase desde el panel, se recalcula solo.
  const columnRef = useRef<HTMLDivElement>(null);
  const [tallest, setTallest] = useState(0);

  useEffect(() => {
    const el = columnRef.current;
    if (!el) return;
    const measure = () => {
      // Se miden las CUATRO copias ocultas, no la visible. En las fichas de
      // fase bastaba con quedarse con el máximo visto porque la más larga es
      // la que abre por defecto; aquí no hay forma de saberlo, y un máximo
      // que solo crece daría un salto la primera vez que se abre una pestaña
      // más larga que las anteriores.
      let max = 0;
      el.querySelectorAll<HTMLElement>("[data-step-measure]").forEach((box) => {
        max = Math.max(max, box.offsetHeight);
      });
      // Se mide una copia ABSOLUTA: no ocupa sitio, así que su alto no depende
      // del alto que estamos calculando. Su ancho sí sale de la columna, pero
      // el ancho lo decide la rejilla, nunca el `minHeight` — que es
      // justamente lo que evita el bucle de medición.
      setTallest(max);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [steps]);

  // En móvil, apilado, cada fase ocupa lo suyo: reservar aquí el alto de la
  // más larga dejaría un hueco muerto bajo las cortas.
  const commonHeight = isDesktop && tallest ? tallest : undefined;

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

        {/* `items-stretch` y no `items-start`: la columna de la foto tiene que
            llegar hasta abajo para poder rellenar el alto común. El texto y la
            foto siguen empezando arriba, que es lo que se ve. */}
        <Grid className="mt-title md:items-stretch">
          <div
            ref={columnRef}
            className="relative col-span-12 md:col-span-5 md:row-start-1 md:flex md:flex-col md:justify-start"
            style={commonHeight ? { minHeight: commonHeight } : undefined}
          >
            {current && <StepText step={current} number={activeIndex + 1} />}

            {/* Las cuatro fases a la vez, sin ocupar sitio ni salir en el
                lector de pantalla: solo están para que el navegador nos diga
                cuánto mide cada una al ancho real de esta columna. */}
            <div
              aria-hidden
              className="pointer-events-none invisible absolute inset-x-0 top-0"
            >
              {steps.map((step, index) => (
                <div key={step._key} data-step-measure>
                  <StepText step={step} number={index + 1} />
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 mt-12 md:col-span-5 md:col-start-8 md:row-start-1 md:mt-0">
            {/* La foto pasa de su 4/5 a rellenar el alto común. `object-cover`
                recorta, nunca deforma: la proporción de la imagen se mantiene
                pase lo que pase con la caja. En móvil conserva el 4/5. */}
            {image ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-full">
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
                className="w-full md:h-full"
              />
            )}
          </div>
        </Grid>
      </Container>
    </section>
  );
}
