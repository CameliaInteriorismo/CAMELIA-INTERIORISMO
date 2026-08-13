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
const ACCOMPANIMENT_ITEMS = [
  {
    question: "REFORMA INTEGRAL",
    answer: "Contenido pendiente del cliente.",
    image: null,
  },
  {
    question: "REFORMA PARCIAL",
    answer: "Contenido pendiente del cliente.",
    image: null,
  },
  {
    question: "OBRA NUEVA",
    answer: "Contenido pendiente del cliente.",
    image: null,
  },
  {
    question: "DECORACIÓN DE ESPACIOS",
    answer: "¿Ya tienes la casa hecha? La vestimos y le damos alma, sin obras.",
    image: "/assets/servicios/acompanamiento.jpg",
  },
];

export function AccompanimentSection() {
  // All closed on load; opening one closes whichever was open — a single
  // "radio button" accordion, not the independent multi-open FAQ style.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const displayed = ACCOMPANIMENT_ITEMS[openIndex ?? 0];

  return (
    // pt-[80px]: ProjectPhases' last card already ends with its own 40px
    // trailing line (see ProjectPhases.tsx), so 80 + 40 = the agreed 120px
    // total gap from "Cada proyecto, a medida" to this heading.
    <section className="pt-[80px] pb-[120px]">
      <Container>
        <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
          Cómo podemos
          <br />
          acompañarte
        </h2>

        {/* 32px en vez de los 60px del ritmo título→contenido: las dos frases
            se leen como una sola idea encadenada, y a 60px la segunda se
            desprendía de la primera. */}
        <Grid className="mt-md">
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

            <div className="border-primary/15 mt-title border-t">
              {ACCOMPANIMENT_ITEMS.map((item, index) => {
                const open = index === openIndex;
                return (
                  <div
                    key={item.question}
                    className="border-primary/15 border-b"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : index)}
                      className="flex w-full items-center justify-between gap-8 py-6 text-left"
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
                          <p className="text-primary pb-6 text-sm leading-relaxed">
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

          <div className="col-span-12 mt-12 md:col-span-5 md:col-start-8 md:mt-0">
            <div className={cn("relative aspect-[4/5] w-full overflow-hidden")}>
              {displayed.image ? (
                <Image
                  src={displayed.image}
                  alt={displayed.question}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
              ) : (
                <PlaceholderImage
                  aspectRatio="4 / 5"
                  label={`Imagen ${displayed.question} — sin archivo en Diseño/`}
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
