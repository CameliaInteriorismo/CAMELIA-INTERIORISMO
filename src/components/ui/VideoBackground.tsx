import Image from "next/image";
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
 * Tres piezas:
 *  - Un fotograma en imagen DEBAJO del vídeo, con prioridad de carga: se ve
 *    al instante y es lo que Google mide como "contenido principal". Va como
 *    <Image> propio y no solo como `poster` porque, si el elemento medido es
 *    el <video>, las herramientas de Google le atribuyen la descarga del
 *    vídeo entero y la portada sigue puntuando como lenta.
 *  - `poster` con la misma imagen, para que el hueco del vídeo nunca esté
 *    en blanco mientras arranca.
 *  - `preload="metadata"`: el navegador pide solo la cabecera y va trayendo
 *    el resto conforme reproduce, en vez de bloquear la carga con el archivo
 *    completo. En cuanto reproduce, el vídeo tapa la imagen.
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
      {poster ? (
        <Image
          src={poster}
          alt=""
          aria-hidden
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className={cn("object-cover", className)}
          style={{ objectPosition }}
        />
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
