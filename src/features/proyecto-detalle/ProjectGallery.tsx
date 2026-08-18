import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";

/**
 * Un bloque de la galería: una apaisada arriba y dos verticales debajo.
 *
 * Se repite tantas veces como bloques tenga el proyecto, siempre con esta
 * misma composición, de modo que todos los proyectos se ven igual por muchas
 * fotos que tengan. Un hueco sin foto conserva su sitio, igual que antes.
 */
export type ProjectGalleryBlock = {
  _key?: string;
  horizontal?: SanityImageSource;
  vertical1?: SanityImageSource;
  vertical2?: SanityImageSource;
};

function FullImage({ source }: { source?: SanityImageSource }) {
  const image = imageProps(source);
  // Sin foto no se reserva hueco ni se pinta recuadro: este bloque es el único
  // de la web donde cada posición puede quedar vacía, y el `space-y-8` del
  // contenedor cierra el aire por sí solo. En el resto sigue mandando la regla
  // de que todo recuadro del diseño lleva imagen.
  if (!image) return null;
  return (
    <div className="relative aspect-[1120/661] w-full overflow-hidden">
      <Image
        src={image.src}
        alt={image.alt}
        aria-hidden={!image.alt}
        fill
        quality={75}
        placeholder={image.blurDataURL ? "blur" : undefined}
        blurDataURL={image.blurDataURL}
        className="object-cover"
        style={{ objectPosition: image.objectPosition }}
        sizes="(min-width: 1024px) 1120px, 100vw"
      />
    </div>
  );
}

function PairImage({ source }: { source?: SanityImageSource }) {
  const image = imageProps(source);
  if (!image) return null;
  return (
    <div className="relative aspect-[544/760] w-full overflow-hidden">
      <Image
        src={image.src}
        alt={image.alt}
        aria-hidden={!image.alt}
        fill
        quality={75}
        placeholder={image.blurDataURL ? "blur" : undefined}
        blurDataURL={image.blurDataURL}
        className="object-cover"
        style={{ objectPosition: image.objectPosition }}
        sizes="(min-width: 768px) 50vw, 100vw"
      />
    </div>
  );
}

export function ProjectGallery({ blocks }: { blocks?: ProjectGalleryBlock[] }) {
  const list = blocks ?? [];
  if (list.length === 0) return null;

  return (
    <section className="mt-block">
      <Container className="space-y-8">
        {list.map((block, i) => {
          const hayVerticales = !!(block.vertical1 || block.vertical2);
          // Un bloque sin ninguna de las tres no llega a pintarse.
          if (!block.horizontal && !hayVerticales) return null;
          return (
            <div key={block._key ?? i} className="space-y-8">
              <FullImage source={block.horizontal} />
              {/* Con una sola vertical la rejilla de dos columnas se mantiene:
                  la foto ocupa su media anchura y conserva su proporción, en
                  vez de estirarse a ancho completo. */}
              {hayVerticales && (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <PairImage source={block.vertical1} />
                  <PairImage source={block.vertical2} />
                </div>
              )}
            </div>
          );
        })}
      </Container>
    </section>
  );
}
