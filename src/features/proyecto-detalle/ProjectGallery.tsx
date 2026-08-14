import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
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

function FullImage({
  source,
  label,
}: {
  source?: SanityImageSource;
  label: string;
}) {
  const image = imageProps(source);
  return (
    <div className="relative aspect-[1120/661] w-full overflow-hidden">
      {image ? (
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
      ) : (
        <PlaceholderImage
          aspectRatio="auto"
          label={label}
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
}

function PairImage({
  source,
  label,
}: {
  source?: SanityImageSource;
  label: string;
}) {
  const image = imageProps(source);
  return (
    <div className="relative aspect-[544/760] w-full overflow-hidden">
      {image ? (
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
      ) : (
        <PlaceholderImage
          aspectRatio="auto"
          label={label}
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
}

export function ProjectGallery({ blocks }: { blocks?: ProjectGalleryBlock[] }) {
  const list = blocks ?? [];
  if (list.length === 0) return null;

  return (
    <section className="mt-block pb-[100px]">
      <Container className="space-y-8">
        {list.map((block, i) => (
          <div key={block._key ?? i} className="space-y-8">
            <FullImage
              source={block.horizontal}
              label={`Galería — bloque ${i + 1}, apaisada sin imagen`}
            />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <PairImage
                source={block.vertical1}
                label={`Galería — bloque ${i + 1}, vertical izquierda sin imagen`}
              />
              <PairImage
                source={block.vertical2}
                label={`Galería — bloque ${i + 1}, vertical derecha sin imagen`}
              />
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
