"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import type { Finish } from "@/features/tienda/data";

// The circle itself — the one visual element shared everywhere a finish
// is selectable (grid card row, product hero's stacked list), so a swatch
// looks and behaves identically across the shop regardless of layout.
export function FinishSwatch({
  finish,
  active,
  onHover,
  onSelect,
  size = "h-5 w-5",
}: {
  finish: Finish;
  active: boolean;
  onHover?: (hovering: boolean) => void;
  onSelect?: () => void;
  size?: string;
}) {
  return (
    <button
      type="button"
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onClick={(event) => {
        // Swatches sit inside the grid card's <Link> too — without this,
        // clicking one would also navigate to the product.
        event.preventDefault();
        event.stopPropagation();
        onSelect?.();
      }}
      aria-label={finish.name}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full ring-1 ring-offset-2 ring-offset-background transition-shadow",
        size,
        active ? "ring-primary" : "ring-primary/20",
      )}
      style={{ backgroundColor: finish.color }}
    />
  );
}

// Grid card layout: one shared name label, centered, above a centered
// row of circles with generous breathing room between them.
export function FinishSwatches({
  finishes,
  selected = 0,
  onSelect,
  className,
}: {
  finishes: Finish[];
  selected?: number;
  onSelect?: (index: number) => void;
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = finishes[hovered ?? selected];

  return (
    <div className={cn("text-center", className)}>
      {active && <p className="text-primary/70 mb-3 text-xs">{active.name}</p>}
      <div className="flex items-center justify-center gap-4">
        {finishes.map((finish, index) => (
          <FinishSwatch
            key={finish.name}
            finish={finish}
            active={index === selected}
            onHover={(hovering) => setHovered(hovering ? index : null)}
            onSelect={() => onSelect?.(index)}
          />
        ))}
      </div>
    </div>
  );
}
