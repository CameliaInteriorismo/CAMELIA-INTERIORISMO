import { cn } from "@/utils/cn";

/**
 * Stand-in for the Hero and Ficha Proyecto videos, which don't exist as real
 * files yet. Occupies the exact aspect-ratio/crop the real <video> will use,
 * so swapping it in later is a data change, not a structural one.
 */
export function PlaceholderVideo({
  aspectRatio = "16 / 9",
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
        "relative flex items-center justify-center overflow-hidden bg-[repeating-linear-gradient(135deg,transparent,transparent_10px,rgba(49,3,4,0.06)_10px,rgba(49,3,4,0.06)_11px)]",
        className,
      )}
      style={{ aspectRatio }}
    >
      <span className="border-background/70 flex h-16 w-16 items-center justify-center rounded-full border">
        <span className="border-l-background/70 ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent" />
      </span>
      {process.env.NODE_ENV !== "production" && (
        <span className="bg-primary/80 text-background absolute bottom-2 left-2 rounded px-2 py-1 text-[10px] tracking-wide">
          {/* TODO(asset): sustituir por el vídeo real — ver Diseño/ */}
          {label}
        </span>
      )}
    </div>
  );
}
