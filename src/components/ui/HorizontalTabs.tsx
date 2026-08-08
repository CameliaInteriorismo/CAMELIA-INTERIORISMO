"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export interface HorizontalTabItem {
  label: string;
}

/**
 * Horizontal, click-driven tab row with a sliding underline (shared
 * `layoutId`, same technique as `IndicatorList`'s vertical marker but along
 * the x-axis) — used by Metodología's "El proceso". A different shape from
 * `Tabs.tsx` (vertical, stacked, no shared layoutId), so kept separate.
 */
export function HorizontalTabs({
  items,
  activeIndex,
  onChange,
  layoutId,
  className,
}: {
  items: HorizontalTabItem[];
  activeIndex: number;
  onChange: (index: number) => void;
  layoutId: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-primary/15 flex flex-wrap justify-between gap-x-10 gap-y-3 border-b",
        className,
      )}
    >
      {items.map((item, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onChange(index)}
            className="relative pb-4 text-left"
          >
            <span
              className={cn(
                "font-title text-xl transition-opacity duration-500",
                active ? "text-primary opacity-100" : "text-primary opacity-45 hover:opacity-70",
              )}
            >
              {item.label}
            </span>
            {active && (
              <motion.div
                layoutId={layoutId}
                className="bg-primary absolute -bottom-px left-0 h-[2px] w-full"
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
