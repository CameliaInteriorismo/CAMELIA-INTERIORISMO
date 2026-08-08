import { cn } from "@/utils/cn";

/**
 * Fills the exact crop/aspect-ratio a real image will occupy later. Swapping
 * in the real asset (Sanity image or a local file) is a data-only change —
 * the call site keeps the same box, so no layout shift.
 */
export function PlaceholderImage({
  aspectRatio = "4 / 3",
  label,
  className,
}: {
  aspectRatio?: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[repeating-linear-gradient(135deg,transparent,transparent_10px,rgba(49,3,4,0.06)_10px,rgba(49,3,4,0.06)_11px)]",
        className,
      )}
      style={{ aspectRatio }}
    >
      {process.env.NODE_ENV !== "production" && (
        <span className="bg-primary/80 text-background absolute bottom-2 left-2 rounded px-2 py-1 text-[10px] tracking-wide">
          {/* TODO(asset): sustituir por la imagen real — ver Diseño/ */}
          {label}
        </span>
      )}
    </div>
  );
}
