"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRightIcon } from "@/components/ui/icons";
import { cn } from "@/utils/cn";

export interface AccordionItem {
  question: string;
  answer: string;
}

export function PlusMinusIcon({ open }: { open: boolean }) {
  return (
    <span className="text-primary relative block h-3.5 w-3.5 shrink-0">
      <span className="bg-primary absolute top-1/2 left-0 h-px w-full -translate-y-1/2" />
      <motion.span
        animate={{ scaleY: open ? 0 : 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-primary absolute top-0 left-1/2 h-full w-px -translate-x-1/2"
      />
    </span>
  );
}

function DisclosureArrow({ open }: { open: boolean }) {
  return (
    <motion.span
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="block h-3.5 w-3.5 shrink-0"
    >
      <ArrowDownRightIcon className="text-primary h-full w-full" />
    </motion.span>
  );
}

/**
 * Shared FAQ-style accordion — used by Servicios ("Antes de empezar el
 * proyecto") and Producto's detail sections. Two selection modes:
 * - default (single `openIndex`): only one item open at a time, opening
 *   one closes whichever was open before — Servicios' FAQ.
 * - `independent`: each item tracks its own open state, so any number
 *   can be open together — Producto's "Descripción/Materiales/..." list.
 *
 * `compact` trims the row padding (py-6 → py-5) for contexts with a
 * tighter height budget — Producto's right column — without touching
 * Servicios' FAQ spacing. `icon` swaps the disclosure glyph: "plusminus"
 * (default, Servicios' FAQ) or "arrow" (Producto's ↘, per its reference).
 */
export function Accordion({
  items,
  defaultOpenIndex,
  independent = false,
  compact = false,
  icon = "plusminus",
  className,
}: {
  items: AccordionItem[];
  defaultOpenIndex?: number;
  independent?: boolean;
  compact?: boolean;
  icon?: "plusminus" | "arrow";
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultOpenIndex ?? null,
  );
  const [openSet, setOpenSet] = useState<Set<number>>(
    () => new Set(defaultOpenIndex !== undefined ? [defaultOpenIndex] : []),
  );

  return (
    <div className={cn("divide-primary/15 divide-y", className)}>
      {items.map((item, index) => {
        const open = independent ? openSet.has(index) : index === openIndex;
        function toggle() {
          if (independent) {
            setOpenSet((prev) => {
              const next = new Set(prev);
              if (next.has(index)) next.delete(index);
              else next.add(index);
              return next;
            });
          } else {
            setOpenIndex(open ? null : index);
          }
        }
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={toggle}
              className={cn(
                "flex w-full items-center justify-between gap-8 text-left",
                compact ? "py-5" : "py-6",
              )}
            >
              <span className="font-title text-primary text-lg">
                {item.question}
              </span>
              {icon === "arrow" ? (
                <DisclosureArrow open={open} />
              ) : (
                <PlusMinusIcon open={open} />
              )}
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p
                    className={cn(
                      "text-primary/75 text-sm leading-relaxed",
                      compact ? "pb-5" : "pb-6",
                    )}
                  >
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
