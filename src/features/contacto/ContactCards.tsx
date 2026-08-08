import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { CONTACT, MAPS_URL, SOCIALS } from "@/features/contacto/data";

function CardAction({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-primary hover:text-auxiliary mt-auto inline-flex items-center gap-2 text-sm transition-colors duration-300"
    >
      {label}
      <ArrowRightIcon className="h-3 w-3" />
    </a>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    // Hairline box, no fill or shadow — the only bordered surface on the
    // page, matching the reference's restraint. Vertical rhythm is tighter
    // than the outer padding (gap-sm rather than gap-block) so the card
    // stays compact without crowding the text; width is untouched.
    <div className="border-primary/25 flex h-full flex-col gap-sm border px-6 py-6">
      <h2 className="font-title text-primary text-sm tracking-wide uppercase">
        {title}
      </h2>
      {children}
    </div>
  );
}

export function ContactCards() {
  return (
    <section className="pt-title">
      <Container>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card title="Escríbenos">
            <p className="text-primary/75 text-sm">{CONTACT.email}</p>
            <CardAction href={`mailto:${CONTACT.email}`} label="Enviar ahora" />
          </Card>

          <Card title="Llámanos">
            <p className="text-primary/75 text-sm">{CONTACT.phone}</p>
            <CardAction href={CONTACT.phoneHref} label="Llamar ahora" />
          </Card>

          <Card title="Visítanos">
            <div className="text-primary/75 space-y-1 text-sm">
              {CONTACT.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <CardAction href={MAPS_URL} label="Ver ubicación" />
          </Card>

          <Card title="Síguenos">
            {/* Bare icons — no border, fill or container. Hover keeps the
                same soft fade the other card actions use. */}
            <div className="flex items-center gap-4">
              {SOCIALS.map(({ label, src }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="block transition-opacity duration-300 hover:opacity-60"
                >
                  <Image
                    src={src}
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                </a>
              ))}
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
