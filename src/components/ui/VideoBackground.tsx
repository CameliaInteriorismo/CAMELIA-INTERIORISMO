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
 *
 * Rendimiento (auditoría SEO de 2026-09-07): este vídeo era el elemento más
 * grande de la portada y el navegador lo descargaba ENTERO antes de pintar
 * nada (`preload="auto"`), así que en móvil la portada tardaba 8 s en verse.
 * Dos cambios:
 *  - `poster`: un fotograma en imagen que se ve al instante mientras llega
 *    el vídeo. Es lo que Google mide como "contenido principal", y se
 *    precarga con prioridad para que gane a los scripts.
 *  - `preload="metadata"`: el navegador pide solo la cabecera y va trayendo
 *    el resto conforme reproduce, en vez de bloquear la carga con el archivo
 *    completo.
 */
export function VideoBackground({
  src,
  poster,
  className,
  objectPosition,
}: {
  src: string;
  /** Fotograma de portada. Sin él, el hueco queda vacío hasta que carga el vídeo. */
  poster?: string;
  className?: string;
  /** Qué parte del vídeo se ve al recortar. Sin valor, el navegador centra. */
  objectPosition?: string;
}) {
  return (
    <>
      {/* React sube este <link> al <head> del HTML inicial: el póster empieza
          a descargarse antes de que el navegador llegue al <video>. */}
      {poster ? (
        <link rel="preload" as="image" href={poster} fetchPriority="high" />
      ) : null}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={poster}
        src={src}
        style={{ objectPosition }}
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          className,
        )}
      />
    </>
  );
}
