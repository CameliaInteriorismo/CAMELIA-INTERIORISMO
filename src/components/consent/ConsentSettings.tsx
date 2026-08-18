"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ConsentToggle } from "@/components/consent/ConsentToggle";
import type { ConsentCategories } from "@/lib/consent/types";

const EASE = [0.4, 0, 0.2, 1] as const;

type Category = {
  key: keyof ConsentCategories | "necessary";
  title: string;
  description: string;
  /** Technical cookies can't be switched off, so their toggle is locked on. */
  locked?: boolean;
};

const CATEGORIES: Category[] = [
  {
    key: "necessary",
    title: "Cookies técnicas",
    description:
      "Imprescindibles para que la web funcione: la navegación, el acceso a las distintas secciones y la propia gestión de este consentimiento. No pueden desactivarse.",
    locked: true,
  },
  {
    key: "analytics",
    title: "Cookies de análisis",
    description:
      "Google Analytics. Nos permiten medir de forma anónima cómo se usa la web para poder mejorarla.",
  },
  {
    key: "marketing",
    title: "Cookies de marketing",
    description:
      "Meta Pixel. Miden la eficacia de nuestras campañas en Facebook e Instagram y permiten mostrar anuncios relevantes.",
  },
];

/** Focusable descendants, in DOM order — used to keep Tab inside the panel. */
function focusable(root: HTMLElement) {
  return [
    ...root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ];
}

export function ConsentSettings({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial: ConsentCategories;
  onSave: (categories: ConsentCategories) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [draft, setDraft] = useState<ConsentCategories>(initial);

  // Reopening starts from whatever is actually stored, not from whatever the
  // user left half-toggled last time without saving.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDraft(initial);
  }

  // Held in a ref so the effect below can depend on `open` alone. Depending
  // on the callback itself re-ran the whole effect on every parent render,
  // which tore focus off whichever switch the user was operating and put it
  // back on the panel.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    // The panel takes over the screen, so the page behind it shouldn't
    // scroll under the user's fingers.
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Focus lands on the panel itself, not on the first switch — that would
    // read the first category out of context before the heading.
    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      // Cycle focus inside the dialog: without this, Tab walks out into the
      // page behind and the user is editing a form they can't see.
      const items = focusable(panelRef.current);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            aria-hidden
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="bg-primary/40 absolute inset-0"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="bg-background border-primary/15 relative flex max-h-full w-full max-w-[40rem] flex-col border outline-none"
          >
            <div className="overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
              <h2
                id={titleId}
                className="font-title text-primary text-xl uppercase md:text-2xl"
              >
                Configuración de cookies
              </h2>
              <p className="text-primary/75 mt-sm text-sm leading-relaxed">
                Elige qué cookies quieres permitir. Puedes cambiar esta decisión
                cuando quieras desde el pie de página. Más detalle en nuestra{" "}
                <Link
                  href="/politica-de-cookies"
                  className="border-primary/30 hover:border-primary border-b transition-colors duration-300"
                >
                  Política de Cookies
                </Link>
                .
              </p>

              <ul className="mt-block space-y-6">
                {CATEGORIES.map((category) => {
                  const id = `${titleId}-${category.key}`;
                  const checked = category.locked
                    ? true
                    : draft[category.key as keyof ConsentCategories];

                  return (
                    <li
                      key={category.key}
                      className="border-primary/15 flex items-start justify-between gap-6 border-t pt-6"
                    >
                      <div>
                        <p id={id} className="text-primary text-sm">
                          {category.title}
                          {category.locked && (
                            <span className="text-primary/50">
                              {" "}
                              (siempre activas)
                            </span>
                          )}
                        </p>
                        <p
                          id={`${id}-desc`}
                          className="text-primary/70 mt-2 text-sm leading-relaxed"
                        >
                          {category.description}
                        </p>
                      </div>
                      <ConsentToggle
                        checked={checked}
                        disabled={category.locked}
                        labelledBy={id}
                        describedBy={`${id}-desc`}
                        onChange={(next) =>
                          setDraft((prev) => ({
                            ...prev,
                            [category.key]: next,
                          }))
                        }
                      />
                    </li>
                  );
                })}
              </ul>

              <div className="mt-block flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="font-title border-primary/30 text-primary hover:border-primary inline-flex h-11 items-center justify-center border px-8 text-sm tracking-wide transition-colors duration-300"
                >
                  CANCELAR
                </button>
                <Button onClick={() => onSave(draft)}>
                  GUARDAR PREFERENCIAS
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
