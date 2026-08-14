import Image from "next/image";
import { Container, Grid } from "@/components/layout/Container";
import { ArrowRightIcon, MapIcon, PinIcon } from "@/components/ui/icons";
import { SECTION_TITLE_SCALE } from "@/components/ui/typography";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";
import { Multiline } from "@/features/shared/MultilineText";
import type { ContactDetails } from "@/features/contacto/types";
import { cn } from "@/utils/cn";

export function StudioMap({
  title,
  lead,
  text,
  image,
  addressLabel,
  actionLabel,
  contact,
}: {
  title?: string;
  lead?: string;
  text?: string;
  image?: SanityImageSource;
  addressLabel?: string;
  actionLabel?: string;
  contact: ContactDetails;
}) {
  const map = imageProps(image);
  return (
    <section className="pt-[100px] pb-[100px]">
      <Container>
        <Grid className="items-start">
          <div className="col-span-12 md:col-span-6">
            {/* An h2, not an h1: the page already opens on the "Contacto"
                h1, and a second one would leave the document with two
                competing top-level headings. The scale is its own step
                (see SECTION_TITLE_SCALE) — the reference sets this heading
                deliberately below the hero title, on two lines. */}
            <h2 className={cn("font-title text-primary", SECTION_TITLE_SCALE)}>
              <Multiline text={title} />
            </h2>
          </div>
          <div className="mt-block col-span-12 md:col-span-5 md:col-start-8 md:mt-0 md:text-right">
            <p className="text-primary text-lg">{lead}</p>
            <p className="text-primary/75 mt-sm text-sm leading-relaxed">
              {text}
            </p>
          </div>
        </Grid>

        <div className="mt-title relative">
          {/* Native ratio of the supplied artwork, so the map is never
              stretched or cropped away from the framing it was drawn at. */}
          <div className="relative aspect-[1847/851] w-full overflow-hidden">
            <Image
              src={map?.src ?? ""}
              alt="Mapa de la ubicación del estudio en Alzira"
              fill
              className="object-cover"
              style={{ objectPosition: map?.objectPosition }}
              sizes="(min-width: 1024px) 1120px, 100vw"
            />
          </div>

          {/* Card geometry from Diseño/Ejemplo mapa.png, then scaled up.
              The reference card is 43% of the map's width and 27% of its
              height — a long, low 3.5:1 slab. Matching the width alone left
              ours at 2.6:1, because "Abrir en / Google Maps" wrapped to
              three lines and pushed the card square. Widening it to 52%
              restores both the reference proportion and its presence: it
              grows about the card's own centre (58.5% across, as in the
              reference) so the composition over the map is unchanged, and
              the internal split stays 63/37 between address and action. */}
          <div className="bg-background inset-x-0 mt-6 sm:absolute sm:inset-x-auto sm:bottom-[15.6%] sm:left-[32.5%] sm:mt-0 sm:w-[52%]">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 p-10 sm:basis-[63%]">
                <p className="text-primary flex items-center gap-2 text-sm">
                  <PinIcon className="h-4 w-4 shrink-0" />
                  {addressLabel}
                </p>
                {/* 24px, not the 40px block rhythm: measured off the
                    reference, the label sits ~26px above the street lines.
                    Both columns tighten together (see the action's gap-5
                    below) so the whole card loses height rather than one
                    side going compact while the other holds it open. */}
                <div className="text-primary/75 mt-sm space-y-1 text-sm">
                  {contact.addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>

              <a
                href={contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-primary/15 text-primary hover:text-primary/60 flex flex-col gap-5 border-t p-10 transition-colors duration-300 sm:basis-[37%] sm:border-t-0 sm:border-l"
              >
                <span className="flex items-start gap-2 text-sm">
                  <MapIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <Multiline text={actionLabel} />
                  </span>
                </span>
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
