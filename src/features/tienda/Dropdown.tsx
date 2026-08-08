"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/utils/cn";

export type DropdownOption = { label: string; value: string };

// Shared trigger+menu for "Tipo de producto" and "Ordenar" — the label
// stays fixed (so the two buttons never change width as options are
// picked); a filled dot marks that a non-default option is active.
export function Dropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="border-primary/30 text-primary flex h-8 items-center gap-2 border px-4 text-xs tracking-wide uppercase"
      >
        {value && <span className="bg-primary h-1.5 w-1.5 rounded-full" />}
        {label}
        <ChevronDownIcon
          className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="border-primary/15 bg-background absolute top-full right-0 z-10 mt-2 min-w-48 border py-2 shadow-[0_4px_20px_rgba(49,3,4,0.08)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value === value ? null : option.value);
                setOpen(false);
              }}
              className={cn(
                "hover:bg-primary/5 block w-full px-4 py-2 text-left text-sm",
                option.value === value ? "text-primary" : "text-primary/75",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
