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
          {/* Casi 2.2/1 dejaba el mapa en una tira y el pin sin contexto.
              Bajo md va a 3/4 para que se vea dónde está el estudio; desde md
              recupera su proporción apaisada. */}
          {/* Cuadrado en móvil: a 3/4 el recorte se comía tanto a los lados que
              el pin quedaba descentrado. Cuadrado se ve el pin con contexto
              alrededor en cualquier teléfono. */}
          {/* Cuadrado solo en móvil, donde la tarjeta va fuera y hace falta
              recorte alto para que el pin se vea con contexto. Desde md la
              el mapa se alarga (4/3) en vez de sacar la tarjeta fuera: con la
              proporción apaisada de escritorio el recuadro quedaba de 315px y
              la tarjeta se comía el pin. Más alto, el pin respira encima.
              Desde lg vuelve el apaisado del diseño. */}
          <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[3/2] md:aspect-[16/9] lg:aspect-[1847/851]">
            <Image
              src={map?.src ?? ""}
              alt="Mapa de la ubicación del estudio en Alzira"
              fill
              // Calidad máxima: es una captura de mapa con rótulos finos, y
              // el 75 por defecto los emborronaba. Y centrado a la fuerza, no
              // por el punto focal de Sanity: el pin está en el centro del
              // recorte y así se queda ahí en cualquier proporción.
              quality={100}
              className="object-cover object-center"
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
          {/* Desde tablet la tarjeta ya cabe dentro del mapa sin tapar el pin,
              así que se superpone como en escritorio. Solo en móvil, donde el
              recorte es cuadrado y no hay sitio, se va fuera bajo la imagen. */}
          <div className="bg-background inset-x-0 mt-6 md:absolute md:inset-x-auto md:bottom-[6%] md:left-[32.5%] md:mt-0 md:w-[62%] lg:bottom-[15.6%] lg:w-[52%]">
            {/* Una sola tarjeta en todos los anchos, partida por la línea
                vertical. Sin recuadros propios: la línea basta para separar la
                dirección de la acción, y en móvil solo se aprieta el padding. */}
            <div className="flex flex-row items-stretch">
              <div className="flex-1 basis-1/2 p-6 md:basis-[63%] md:p-10">
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
                // Alineado arriba, como la dirección de al lado: centrado, el
                // rótulo caía por debajo de "Dirección" y las dos mitades se
                // leían desalineadas.
                // Mitades iguales fuera del mapa; desde lg vuelve al reparto 63/37
                // de la tarjeta superpuesta, que es el del diseño.
                className="border-primary/15 text-primary hover:text-primary/60 flex flex-1 basis-1/2 flex-col items-start gap-5 border-l p-6 transition-colors duration-300 md:flex-none md:basis-[37%] md:p-10"
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
