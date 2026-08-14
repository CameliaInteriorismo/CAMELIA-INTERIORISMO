"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * La flecha al pie de las cabeceras a pantalla completa.
 *
 * Está para resolver una duda concreta: en una portada que ocupa el alto del
 * viewport, nada indica que haya nada más abajo. Es una insinuación, no un
 * botón — de ahí que sea un trazo de 1px sin relleno, sin texto y sin caja.
 *
 * El movimiento es de 6px y tarda 2,4s en ir y volver: lo justo para que el
 * ojo lo capte de reojo sin que compita con el titular. Nada de rebotes.
 * Quien haya pedido menos animación la ve quieta, no desaparece.
 *
 * `aria-hidden` porque no aporta nada a quien navega con lector de pantalla:
 * el contenido de abajo ya está en el documento y se alcanza igual.
 */
export function ScrollCue({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-8 flex justify-center md:bottom-10 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <motion.svg
        width="18"
        height="26"
        viewBox="0 0 18 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 2.4,
                ease: [0.4, 0, 0.2, 1],
                repeat: Infinity,
                repeatDelay: 0.4,
              }
        }
      >
        <path d="M9 1v22" />
        <path d="M1.5 16.5 9 24l7.5-7.5" />
      </motion.svg>
    </motion.div>
  );
}
