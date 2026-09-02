"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container, Grid } from "@/components/layout/Container";
import { Multiline } from "@/features/shared/MultilineText";
import { HorizontalTabs } from "@/components/ui/HorizontalTabs";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/utils/cn";

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

/**
 * Proporción máxima (ancho/alto) de la caja de la foto: marca hasta dónde
 * puede achatarse antes de que la imagen se lea como una franja. No es una
 * altura, es una forma — el alto sale del ancho real de la columna, así que
 * acompaña al viewport en vez de quedarse clavado en un número.
 */
const MIN_IMAGE_RATIO = 4 / 3;

/**
 * Holgura entre el texto más largo y el borde inferior de la foto. Sin ella la
 * fase más extensa llegaba justo al canto —0px en tablet, 3px en escritorio— y
 * parecía que el texto se desbordaba. 24px es el escalón `sm` del sistema.
 */
const HOLGURA = 24;

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
function StepText({ step }: { step: ProcessStep }) {
  return (
    <div>
      {/* Sin número: la barra de pestañas ya numera las fases (ver
          `numbered`), y repetirlo aquí lo decía dos veces en la misma
          pantalla. */}
      {/* En móvil el punto numerado es el elemento de navegación y manda:
          esta frase queda por debajo, como recalco. Desde `md` la barra
          horizontal ya hace de navegación y el título recupera su escala. */}
      <h3 className="font-title text-primary text-2xl">{step.title}</h3>
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
  const imageColRef = useRef<HTMLDivElement>(null);
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
      //
      // Suelo para la foto: con el texto solo, la caja salía muy apaisada y la
      // foto quedaba corta. Este suelo no es una altura fija —sale del ancho
      // real de la columna, así que acompaña al viewport— y solo manda cuando
      // el texto no llega. En cuanto una fase necesite más, gana el texto y la
      // caja crece: el sistema sigue siendo el contenido más largo.
      const anchoFoto = imageColRef.current?.clientWidth ?? 0;
      setTallest(Math.max(max + HOLGURA, anchoFoto / MIN_IMAGE_RATIO));
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
    <section className="pt-section">
      <Container>
        {/* Alineado a la izquierda, no centrado: el titular abre la sección
            como una portada editorial y el aire queda a su derecha. El
            `max-w` es solo un tope de medida —hoy ninguna línea llega a él—,
            para que un titular más largo no se estire de margen a margen. */}
        <h2 className="font-title text-primary max-w-3xl text-3xl md:text-4xl">
          <Multiline text={title} />
        </h2>

        <HorizontalTabs
          items={numbered(steps)}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
          layoutId="proceso-tab-underline"
          className="mt-content max-md:hidden"
        />

        {/* `items-stretch` y no `items-start`: la columna de la foto tiene que
            llegar hasta abajo para poder rellenar el alto común. El texto y la
            foto siguen empezando arriba, que es lo que se ve. */}
        <Grid className="mt-content max-md:hidden md:items-stretch">
          <div
            ref={columnRef}
            className="relative col-span-12 md:col-span-5 md:row-start-1 md:flex md:flex-col md:justify-start"
            style={commonHeight ? { minHeight: commonHeight } : undefined}
          >
            {current && <StepText step={current} />}

            {/* Las cuatro fases a la vez, sin ocupar sitio ni salir en el
                lector de pantalla: solo están para que el navegador nos diga
                cuánto mide cada una al ancho real de esta columna. */}
            <div
              aria-hidden
              className="pointer-events-none invisible absolute inset-x-0 top-0"
            >
              {steps.map((step) => (
                <div key={step._key} data-step-measure>
                  <StepText step={step} />
                </div>
              ))}
            </div>
          </div>

          <div
            ref={imageColRef}
            className="col-span-12 mt-12 md:col-span-5 md:col-start-8 md:row-start-1 md:mt-0"
          >
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

        {/* MÓVIL: la barra horizontal envolvía en cuatro filas y ocupaba
            media pantalla antes de llegar al contenido. Aquí cada fase es su
            propio punto: se toca y abre debajo su texto y su foto. El estado
            es el mismo `activeIndex` que usa la barra, así que las dos vistas
            no pueden desincronizarse, y el texto lo pinta el mismo `StepText`
            que en escritorio. */}
        <div className="mt-content md:hidden">
          {steps.map((step, index) => {
            const abierta = index === activeIndex;
            const foto = imageProps(step.image);
            return (
              <div key={step._key} className="border-primary/15 border-b">
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-expanded={abierta}
                  className={cn(
                    "font-title py-content flex w-full items-center text-left text-xl transition-colors duration-300",
                    // El primero pega arriba: su `pt` se sumaba al `mt-content`
                    // del contenedor y dejaba 64px donde La experiencia, en la
                    // misma página, abre con 32.
                    index === 0 && "pt-0",
                    abierta ? "text-primary" : "text-primary/50",
                  )}
                >
                  {index + 1}. {step.label}
                </button>

                <AnimatePresence initial={false}>
                  {abierta && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-content">
                        {foto ? (
                          <div className="relative aspect-[4/5] w-full overflow-hidden">
                            <Image
                              src={foto.src}
                              alt={foto.alt}
                              fill
                              className="object-cover"
                              style={{ objectPosition: foto.objectPosition }}
                              sizes="100vw"
                            />
                          </div>
                        ) : (
                          <PlaceholderImage
                            aspectRatio="4 / 5"
                            label={`Imagen ${step.label} — sin foto`}
                            className="w-full"
                          />
                        )}
                        <div className="mt-content">
                          <StepText step={step} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
