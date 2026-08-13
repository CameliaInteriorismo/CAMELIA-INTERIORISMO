import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";

/**
 * Las seis posiciones de la galería, fijas y en el orden del diseño.
 *
 * Son posiciones de la composición, no una lista variable: una posición sin
 * foto conserva su hueco, igual que antes, y al subir la imagen desde Sanity
 * aparece en su sitio sin que cambie la maquetación.
 */
export type ProjectGalleryImages = {
  imageA?: SanityImageSource;
  pair1Left?: SanityImageSource;
  pair1Right?: SanityImageSource;
  imageB?: SanityImageSource;
  pair2Left?: SanityImageSource;
  pair2Right?: SanityImageSource;
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

export function ProjectGallery({
  gallery,
}: {
  gallery?: ProjectGalleryImages;
}) {
  const g = gallery ?? {};

  return (
    <section className="mt-block pb-[100px]">
      <Container className="space-y-8">
        <FullImage source={g.imageA} label="Galería — posición 1 sin imagen" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <PairImage
            source={g.pair1Left}
            label="Galería — posición 2 sin imagen"
          />
          <PairImage
            source={g.pair1Right}
            label="Galería — posición 3 sin imagen"
          />
        </div>

        <FullImage source={g.imageB} label="Galería — posición 4 sin imagen" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <PairImage
            source={g.pair2Left}
            label="Galería — posición 5 sin imagen"
          />
          <PairImage
            source={g.pair2Right}
            label="Galería — posición 6 sin imagen"
          />
        </div>
      </Container>
    </section>
  );
}
