import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { PAGE_TITLE_SCALE } from "@/components/ui/typography";
import { cn } from "@/utils/cn";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";

/**
 * Unlike the other page heroes this one is *contained*, not full-bleed:
 * a 2:1 band inside the normal content margins with the title over it in
 * vino, exactly as CONTACTO.png draws it. It therefore doesn't use
 * PageHeroBanner (which is 100dvh and edge to edge) — but it does reuse
 * PAGE_TITLE_SCALE, so the word still matches every other page title.
 */
export function ContactHero({
  title,
  image,
  imagePosition,
}: {
  title?: string;
  image?: SanityImageSource;
  imagePosition?: string;
}) {
  const photo = imageProps(image);
  return (
    <section className="pt-title">
      <Container>
        <div className="relative aspect-[2/1] w-full overflow-hidden">
          {photo && (
            <Image
              src={photo.src}
              alt={photo.alt}
              aria-hidden={!photo.alt}
              fill
              priority
              className="object-cover"
              style={{ objectPosition: imagePosition ?? "center" }}
              sizes="(min-width: 1024px) 1120px, 100vw"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1
              // `uppercase` aquí y no en PAGE_TITLE_SCALE: la escala la comparten
              // también títulos de contenido que se leen tal cual se escriben en
              // el panel. Las mayúsculas son de los héroes, como en
              // PageHeroBanner.
              className={cn(
                "font-title text-primary px-6 uppercase",
                PAGE_TITLE_SCALE,
              )}
            >
              {title}
            </h1>
          </div>
        </div>
      </Container>
    </section>
  );
}
