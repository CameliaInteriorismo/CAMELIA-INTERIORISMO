"use client";

import { cn } from "@/utils/cn";

export interface TabItem {
  label: string;
}

/**
 * Vertical, click-driven tab list. Shared by Home ("Diseñamos espacios...")
 * and, later, Metodología ("Proceso") — don't fork a second copy for that
 * page; extend this one (e.g. an optional indicator line) instead.
 */
export function Tabs({
  items,
  activeIndex,
  onChange,
  className,
}: {
  items: TabItem[];
  activeIndex: number;
  onChange: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-12", className)}>
      {items.map((item, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onChange(index)}
            className={cn(
              "font-title border-primary/15 border-b pb-3 text-left text-xl transition-opacity duration-500",
              active ? "opacity-100" : "opacity-45 hover:opacity-70",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
