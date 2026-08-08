import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { ProjectGalleryImages } from "@/features/proyecto-detalle/data";

function FullImage({ src, label }: { src?: string; label: string }) {
  return (
    <div className="relative w-full overflow-hidden aspect-[1120/661]">
      {src ? (
        <Image
          src={src}
          alt=""
          aria-hidden
          fill
          quality={75}
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

function PairImage({ src, label }: { src?: string; label: string }) {
  return (
    <div className="relative w-full overflow-hidden aspect-[544/760]">
      {src ? (
        <Image
          src={src}
          alt=""
          aria-hidden
          fill
          quality={75}
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

export function ProjectGallery({ gallery }: { gallery: ProjectGalleryImages }) {
  const [pair1Left, pair1Right] = gallery.pair1 ?? [undefined, undefined];
  const [pair2Left, pair2Right] = gallery.pair2 ?? [undefined, undefined];

  return (
    <section className="mt-block pb-[100px]">
      <Container className="space-y-8">
        <FullImage src={gallery.imageA} label="Galería — foto A sin Diseño/" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <PairImage src={pair1Left} label="Galería — foto B1 sin Diseño/" />
          <PairImage src={pair1Right} label="Galería — foto B2 sin Diseño/" />
        </div>

        <FullImage src={gallery.imageB} label="Galería — foto C sin Diseño/" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <PairImage src={pair2Left} label="Galería — foto D1 sin Diseño/" />
          <PairImage src={pair2Right} label="Galería — foto D2 sin Diseño/" />
        </div>
      </Container>
    </section>
  );
}
