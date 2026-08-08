"use client";

// Shared +/- quantity control — Producto's "Selector de cantidad" today,
// and the same stepper /carrito's line items will need later.
export function QuantityStepper({
  value,
  onChange,
  min = 1,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) {
  return (
    <div className="border-primary/30 inline-flex h-11 items-center border">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Reducir cantidad"
        className="text-primary flex h-full w-11 items-center justify-center text-lg disabled:opacity-30"
      >
        −
      </button>
      <span className="text-primary min-w-8 text-center text-sm">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Aumentar cantidad"
        className="text-primary flex h-full w-11 items-center justify-center text-lg"
      >
        +
      </button>
    </div>
  );
}
