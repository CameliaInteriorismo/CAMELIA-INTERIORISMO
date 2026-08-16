"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container, Grid } from "@/components/layout/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { PlusMinusIcon } from "@/components/ui/Accordion";
import { cn } from "@/utils/cn";

// TODO(asset): solo "Decoración de espacios" tiene foto real (la única
// expandida en Diseño/SERVICIOS.png) — las otras tres necesitan su imagen
// definitiva del cliente.
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";
import { Multiline } from "@/features/shared/MultilineText";

export type AccompanimentItem = {
  _key: string;
  question: string;
  answer: string;
  image?: SanityImageSource;
};

export function AccompanimentSection({
  items,
  title,
}: {
  items: AccompanimentItem[];
  title?: string;
}) {
  // Dos estados distintos a propósito, porque no responden a lo mismo:
  //
  //   openIndex   — qué desplegable está abierto. Puede no haber ninguno:
  //                 volver a pulsar el abierto lo cierra.
  //   shownIndex  — de quién es la foto de al lado. Recuerda el ÚLTIMO que se
  //                 abrió y no se borra al cerrarlo.
  //
  // Con un solo estado, cerrar un desplegable dejaba la columna sin foto o la
  // devolvía a la del primero, que no era el que se había mirado. Así la foto
  // sigue acompañando a lo último que abriste.
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [shownIndex, setShownIndex] = useState(0);
  const displayed = items[shownIndex];
  const displayedImage = imageProps(displayed?.image);

  return (
    // pt-[80px]: ProjectPhases' last card already ends with its own 40px
    // trailing line (see ProjectPhases.tsx), so 80 + 40 = the agreed 120px
    // total gap from "Cada proyecto, a medida" to this heading.
    <section className="pt-[80px] pb-[120px]">
      <Container>
        <h2 className="font-title text-primary text-3xl md:text-4xl">
          <Multiline text={title} />
        </h2>

        {/* 32px en vez de los 60px del ritmo título→contenido: las dos frases
            se leen como una sola idea encadenada, y a 60px la segunda se
            desprendía de la primera. */}
        <Grid className="mt-md md:items-stretch">
          <div className="col-span-12 md:col-span-5">
            {/* Un escalón más grande (24px) para que gane peso sin acercarse
                al h2 de 36px que la encabeza. */}
            <h3 className="font-title text-primary text-2xl">
              Sea cual sea el punto en el que estés.
            </h3>
            <p className="text-primary/75 mt-md text-sm leading-relaxed">
              Da igual si tu casa está por estrenar o lleva años contigo.
              Adaptamos nuestros servicios al momento en el que nos necesites
              para acompañarte durante todo el proceso.
            </p>

            {/* 60px sobre el listado: el texto de arriba y los desplegables son
                  el mismo bloque —"Sea cual sea el punto en el que estés" y las
                  situaciones que lo desarrollan—, y a 120 quedaban partidos en
                  dos, con un hueco enorme frente a la foto de al lado. A 40
                  se pegaban demasiado, así que se queda en el escalón de en
                  medio de la escala.

                  El alto sale del flujo: cada fila pone su padding y el texto
                  desplegado el suyo, así que la lista se acorta con dos fichas
                  y se alarga con seis sin que cambie ni este margen ni el
                  ritmo entre ellas. Ninguna altura fija. */}
            <div className="border-primary/15 mt-title border-t">
              {items.map((item, index) => {
                const open = index === openIndex;
                return (
                  <div key={item._key} className="border-primary/15 border-b">
                    <button
                      type="button"
                      onClick={() => {
                        // Pulsar el abierto lo cierra; pulsar otro cambia.
                        setOpenIndex((prev) => (prev === index ? null : index));
                        // La foto solo cambia al ABRIR, nunca al cerrar.
                        if (openIndex !== index) setShownIndex(index);
                      }}
                      className="flex w-full items-center justify-between gap-8 py-8 text-left"
                    >
                      <span className="font-title text-primary text-xl">
                        {item.question}
                      </span>
                      <PlusMinusIcon open={open} />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className="text-primary pb-8 text-sm leading-relaxed">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* La foto se estira hasta donde llega la columna de al lado, en vez
              de quedarse en su 4/5 y dejar un hueco bajo el último
              desplegable: las dos columnas se leen como un único bloque. En
              móvil, apiladas, conserva su proporción de siempre. */}
          <div className="col-span-12 mt-12 md:col-span-5 md:col-start-8 md:mt-0">
            <div
              className={cn(
                "relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-full",
              )}
            >
              {displayedImage ? (
                <Image
                  src={displayedImage.src}
                  alt={displayedImage.alt || displayed.question}
                  fill
                  className="object-cover"
                  style={{ objectPosition: displayedImage.objectPosition }}
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
              ) : (
                <PlaceholderImage
                  aspectRatio="4 / 5"
                  label={`Imagen ${displayed?.question ?? ""} — sin foto`}
                  className="h-full w-full"
                />
              )}
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
}
