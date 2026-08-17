import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Marquee } from "@/components/ui/Marquee";

// Same wording as the reference screen. Note these read "DISEÑAMOS…",
// whereas Home's ticker reads "CREAMOS…" — that difference is in the
// designs themselves, not a slip.
// Rows 1 and 3 travel one way and the middle row the other, so the band
// reads as three independent currents rather than one block sliding.
const PHRASE_ROWS = [
  {
    phrases: ["DISEÑAMOS FORMAS DE VIVIR", "DISEÑAMOS ESPACIOS"],
    duration: 44,
    reverse: false,
  },
  {
    phrases: ["QUE ACOMPAÑAN", "DISEÑAMOS FORMAS DE HABITAR"],
    duration: 54,
    reverse: true,
  },
  {
    phrases: ["DISEÑAMOS EXPERIENCIAS", "DISEÑAMOS IDENTIDAD"],
    duration: 48,
    reverse: false,
  },
];

export type ThanksContent = {
  title?: string;
  text?: string;
  backLabel?: string;
};

export function RequestSent({ content }: { content?: ThanksContent }) {
  return (
    // Vino fills the whole viewport even when the content is short, so
    // there's never a cream strip under the fold.
    <div className="bg-primary flex min-h-dvh flex-col">
      {/* Standalone bar rather than the site Navbar: this screen closes the
          flow, so it deliberately drops the menu, cart and CTA and keeps
          only the wordmark — in the orange lockup, per the reference. */}
      <header className="border-secondary/15 border-b">
        <Container>
          <div className="flex h-20 items-center justify-center">
            <Link
              href="/"
              aria-label="Camelia — inicio"
              className="flex items-center"
            >
              <Image
                src="/images/logos/Camelia logo naranja actualizado.png"
                alt="Camelia"
                width={828}
                height={130}
                priority
                className="h-5 w-auto"
              />
            </Link>
          </div>
        </Container>
      </header>

      <main className="flex flex-1 items-center justify-center py-[100px]">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            {/* Still the page's headline, but pulled back to 20px so it
                sits closer in weight to the wordmark above it rather than
                dominating the composition. */}
            <h1 className="font-title text-secondary text-lg md:text-xl">
              {content?.title}
            </h1>

            <Image
              src="/images/logos/Favicon naranja actualizado.png"
              alt=""
              aria-hidden
              width={322}
              height={270}
              className="mt-title mx-auto h-6 w-auto"
            />

            <p className="text-secondary/90 mt-block text-sm leading-relaxed">
              {content?.text}
            </p>

            {/* Subtle hover: the underline deepens from half to full
                opacity over 300ms — enough to read as interactive without
                a colour shift or movement. */}
            {/* `w-fit` + `mx-auto` rather than a bare `inline-block`:
                shrink-to-fit was collapsing the box to its min-content
                width ("Volver"), which left the underline far shorter than
                the label. Sizing to fit-content pins the border to the
                full text width.

                Sentence case at the paragraph's own text-sm, and without
                the extra tracking the uppercase treatment needed — so the
                link reads as the same size and texture as the copy above
                it rather than as a separate, louder element. */}
            <Link
              href="/"
              className="text-secondary border-secondary/40 hover:border-secondary mt-title mx-auto block w-fit border-b pb-1 text-sm whitespace-nowrap transition-colors duration-300"
            >
              {content?.backLabel}
            </Link>
          </div>
        </Container>
      </main>

      {/* No bottom padding: the block is anchored to the end of the flex
          column, so the last row's baseline sits flush against the bottom
          edge of the viewport rather than floating above it. */}
      <div aria-hidden className="overflow-hidden select-none">
        {PHRASE_ROWS.map((row) => (
          <Marquee
            key={row.phrases[0]}
            items={row.phrases}
            duration={row.duration}
            reverse={row.reverse}
            className="text-secondary/20 font-title text-4xl md:text-6xl"
            separator={
              <span aria-hidden className="text-2xl">
                ·
              </span>
            }
          />
        ))}
      </div>
    </div>
  );
}
