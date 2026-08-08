"use client";

import { cn } from "@/utils/cn";

/**
 * A real `role="switch"` button, not a styled checkbox: screen readers
 * announce it as on/off, Space and Enter both operate it for free, and the
 * label is wired through `aria-labelledby` to the heading beside it.
 */
export function ConsentToggle({
  checked,
  onChange,
  disabled,
  labelledBy,
  describedBy,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  labelledBy: string;
  describedBy?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "focus-visible:outline-primary relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2",
        checked ? "bg-primary" : "bg-primary/20",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "bg-background absolute top-1 h-4 w-4 rounded-full transition-[left] duration-300",
          checked ? "left-6" : "left-1",
        )}
      />
    </button>
  );
}
