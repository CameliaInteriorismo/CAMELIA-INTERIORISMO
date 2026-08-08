"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const EASE = [0.4, 0, 0.2, 1] as const;

/** Outline twin of the site's solid Button — same 44px, same type. */
const secondaryButton =
  "font-title border-primary/30 text-primary hover:border-primary inline-flex h-11 items-center justify-center whitespace-nowrap border px-8 text-sm tracking-wide transition-colors duration-300";

export function CookieBanner({
  open,
  onAcceptAll,
  onRejectAll,
  onConfigure,
}: {
  open: boolean;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onConfigure: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          // A dialog, but not a modal one: it must not trap focus or block
          // the page. Nothing here is consented-to by continuing to browse,
          // so there is no reason to hold the visitor hostage to it.
          role="dialog"
          aria-label="Consentimiento de cookies"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-[60] flex justify-center p-4 sm:p-6"
        >
          <div className="bg-background border-primary/15 w-full max-w-[64rem] border p-6 sm:p-8">
            {/* Copy left, actions right — stacked below sm, where a row of
                three 44px buttons would shrink below a usable width. */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <p className="text-primary/80 max-w-[38rem] text-sm leading-relaxed">
                Usamos cookies propias y de terceros para que la web funcione,
                entender cómo se usa y medir nuestras campañas. Puedes
                aceptarlas todas, rechazar las que no son necesarias o elegir
                una a una. Más detalle en la{" "}
                <Link
                  href="/politica-de-cookies"
                  className="border-primary/30 hover:border-primary border-b transition-colors duration-300"
                >
                  Política de Cookies
                </Link>
                .
              </p>

              <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
                {/* Reject sits alongside Accept, same size and prominence —
                    a refusal has to be exactly as easy as a consent. */}
                <button
                  type="button"
                  onClick={onConfigure}
                  className="text-primary hover:text-auxiliary inline-flex h-11 items-center justify-center text-sm underline underline-offset-4 transition-colors duration-300 sm:px-4"
                >
                  Configurar
                </button>
                <button
                  type="button"
                  onClick={onRejectAll}
                  className={secondaryButton}
                >
                  RECHAZAR
                </button>
                <Button onClick={onAcceptAll}>ACEPTAR</Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
