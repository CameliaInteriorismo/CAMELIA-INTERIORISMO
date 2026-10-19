import Image from "next/image";
import { Container, Grid } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Multiline } from "@/features/shared/MultilineText";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";
import type { LinkData } from "@/features/shared/types";

export type TeamIntroData = {
  title?: string;
  text?: string;
  button?: LinkData;
  image?: SanityImageSource;
};

/**
 * Laura y Adrián en la portada: una foto y dos líneas.
 *
 * Va justo antes de las reseñas porque casi todas los nombran a los dos; quien
 * las lee ya les ha puesto cara. Sin foto no se pinta: un bloque de «quiénes
 * somos» sin nadie en él no aporta nada.
 */
export function TeamIntro({ team }: { team?: TeamIntroData }) {
  const image = imageProps(team?.image);
  if (!image) return null;
  return (
    <section className="pt-section">
      <Container>
        <Grid className="items-center">
          <div className="relative col-span-12 aspect-square overflow-hidden md:col-span-5">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              placeholder={image.blurDataURL ? "blur" : undefined}
              blurDataURL={image.blurDataURL}
              className="object-cover"
              style={{ objectPosition: image.objectPosition }}
              sizes="(min-width: 768px) 40vw, 100vw"
            />
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            {team?.title && (
              <h2 className="font-title text-primary text-3xl md:text-4xl">
                <Multiline text={team.title} />
              </h2>
            )}
            {team?.text && (
              // Ancho en rem y no `max-w-md`: aquí «md» es un escalón de
              // espaciado (globals.css) y Tailwind lo tomaba de ahí.
              <p className="text-primary mt-content max-w-[28rem] text-sm leading-relaxed">
                {team.text}
              </p>
            )}
            {team?.button?.href && (
              <div className="mt-content">
                <ButtonLink href={team.button.href}>
                  {team.button.label}
                </ButtonLink>
              </div>
            )}
          </div>
        </Grid>
      </Container>
    </section>
  );
}
