import { cn } from "@/utils/cn";

/**
 * Vídeo de fondo a sangre: ocupa todo el contenedor posicionado que lo
 * envuelve y se recorta con object-cover, igual que un <Image fill>.
 *
 * El encuadre y el alto los sigue poniendo el contenedor, no el vídeo — por
 * eso el contenido superpuesto (títulos, CTA) se mantiene donde estaba: basta
 * con que vaya después en el DOM con su propio z-index, como hasta ahora.
 *
 * `muted` no es decorativo: sin él los navegadores bloquean el autoplay.
 */
export function VideoBackground({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      src={src}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
