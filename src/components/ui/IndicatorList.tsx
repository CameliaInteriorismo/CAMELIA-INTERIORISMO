"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export interface IndicatorItem {
  title: string;
  subtitle: string;
}

/**
 * Vertical, click-driven list with a moving indicator line — measured from
 * Diseño/ESTUDIO.png: a static faint divider runs the full height, and a
 * darker segment (via a shared layoutId) highlights whichever item is
 * active, animating to the new position on click. Never scroll-driven.
 *
 * Shared by Estudio ("Sobre nosotros"/...) and, later, Metodología's
 * "Proceso" tab — this is a different interaction (moving side line) from
 * Home's `Tabs.tsx` (underline, no moving line), so don't merge the two.
 */
export function IndicatorList({
  items,
  activeIndex,
  onChange,
  layoutId,
  className,
}: {
  items: IndicatorItem[];
  activeIndex: number;
  onChange: (index: number) => void;
  layoutId: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-primary/15 flex h-full flex-col border-r",
        className,
      )}
    >
      {items.map((item, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={item.title}
            type="button"
            onClick={() => onChange(index)}
            className="relative block w-full flex-1 pr-8 text-left"
          >
            {active && (
              <motion.div
                layoutId={layoutId}
                className="bg-primary absolute top-0 -right-px h-full w-[2px]"
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              />
            )}
            <h2
              className={cn(
                "font-title text-3xl transition-opacity duration-500",
                active ? "text-primary opacity-100" : "text-primary opacity-40",
              )}
            >
              {item.title}
            </h2>
            <p
              className={cn(
                "mt-2 text-xs tracking-wide transition-opacity duration-500",
                active
                  ? "text-primary/70 opacity-100"
                  : "text-primary/70 opacity-50",
              )}
            >
              {item.subtitle}
            </p>
          </button>
        );
      })}
    </div>
  );
}
