import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { PAGE_TITLE_SCALE } from "@/components/ui/typography";
import { cn } from "@/utils/cn";

/**
 * Unlike the other page heroes this one is *contained*, not full-bleed:
 * a 2:1 band inside the normal content margins with the title over it in
 * vino, exactly as CONTACTO.png draws it. It therefore doesn't use
 * PageHeroBanner (which is 100dvh and edge to edge) — but it does reuse
 * PAGE_TITLE_SCALE, so the word still matches every other page title.
 */
export function ContactHero() {
  return (
    <section className="pt-title">
      <Container>
        <div className="relative aspect-[2/1] w-full overflow-hidden">
          <Image
            src="/assets/contacto/P Reels 8 JUL.jpg"
            alt=""
            aria-hidden
            fill
            priority
            quality={90}
            className="object-cover"
            style={{ objectPosition: "center 45%" }}
            sizes="(min-width: 1024px) 1120px, 100vw"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className={cn("font-title text-primary px-6", PAGE_TITLE_SCALE)}>
              Contacto
            </h1>
          </div>
        </div>
      </Container>
    </section>
  );
}
