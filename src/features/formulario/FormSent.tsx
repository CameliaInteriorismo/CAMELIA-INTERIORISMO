import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Marquee } from "@/components/ui/Marquee";

// Same closing screen language as the shop's "solicitud enviada" (see
// features/carrito/RequestSent) — vino field, orange lockup, the three
// tickers anchored to the bottom edge with the middle row reversed.
const PHRASE_ROWS = [
  {
    items: ["DISEÑAMOS FORMAS DE VIVIR", "DISEÑAMOS ESPACIOS"],
    duration: 44,
    reverse: false,
  },
  {
    items: ["QUE ACOMPAÑAN", "DISEÑAMOS FORMAS DE HABITAR"],
    duration: 54,
    reverse: true,
  },
  {
    items: ["DISEÑAMOS EXPERIENCIAS", "DISEÑAMOS IDENTIDAD"],
    duration: 48,
    reverse: false,
  },
];

export type ThanksContent = {
  title?: string;
  text?: string;
  backLabel?: string;
};

export function FormSent({ content }: { content?: ThanksContent }) {
  return (
    <div className="bg-primary flex min-h-dvh flex-col">
      <header className="border-secondary/15 border-b">
        <Container>
          <div className="flex h-20 items-center justify-center">
            <Link
              href="/"
              aria-label="Camelia — inicio"
              className="flex items-center"
            >
              <Image
                src="/assets/logo/trimmed/Camelia logo naranja.png"
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
            <h1 className="font-title text-secondary text-lg uppercase md:text-xl">
              {content?.title}
            </h1>

            <Image
              src="/assets/logo/trimmed/Favicon naranja.png"
              alt=""
              aria-hidden
              width={322}
              height={270}
              priority
              className="mt-title mx-auto h-6 w-auto"
            />

            <p className="text-secondary/90 mt-block text-sm leading-relaxed">
              {content?.text}
            </p>

            <Link
              href="/"
              className="text-secondary border-secondary/40 hover:border-secondary mt-title mx-auto block w-fit border-b pb-1 text-sm whitespace-nowrap transition-colors duration-300"
            >
              {content?.backLabel}
            </Link>
          </div>
        </Container>
      </main>

      <div aria-hidden className="overflow-hidden select-none">
        {PHRASE_ROWS.map((row) => (
          <Marquee
            key={row.items[0]}
            items={row.items}
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
