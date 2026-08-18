import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { imageProps } from "@/sanity/lib/image";
import type {
  ContactCardData,
  ContactDetails,
  Social,
} from "@/features/contacto/types";

function CardAction({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-primary hover:text-primary/60 mt-auto inline-flex items-center gap-2 text-sm transition-colors duration-300"
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
    <div className="border-primary/25 gap-sm flex h-full flex-col border px-6 py-6">
      <h2 className="font-title text-primary text-sm tracking-wide uppercase">
        {title}
      </h2>
      {children}
    </div>
  );
}

export function ContactCards({
  cards,
  contact,
  socials,
}: {
  cards: ContactCardData[];
  contact: ContactDetails;
  socials: Social[];
}) {
  // Las tarjetas se buscan por tipo, no por posición: así reordenarlas en
  // Sanity no cambia qué dato pinta cada una.
  const byKind = Object.fromEntries(
    cards.map((card) => [card.kind, card]),
  ) as Partial<Record<ContactCardData["kind"], ContactCardData>>;
  return (
    <section className="pt-section">
      <Container>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card title={byKind.email?.title ?? ""}>
            <p className="text-primary/75 text-sm">{contact.email}</p>
            <CardAction
              href={`mailto:${contact.email}`}
              label={byKind.email?.actionLabel ?? ""}
            />
          </Card>

          <Card title={byKind.phone?.title ?? ""}>
            <p className="text-primary/75 text-sm">{contact.phone}</p>
            <CardAction
              href={contact.phoneHref}
              label={byKind.phone?.actionLabel ?? ""}
            />
          </Card>

          <Card title={byKind.address?.title ?? ""}>
            <div className="text-primary/75 space-y-1 text-sm">
              {contact.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <CardAction
              href={contact.mapsUrl}
              label={byKind.address?.actionLabel ?? ""}
            />
          </Card>

          <Card title={byKind.social?.title ?? ""}>
            {/* Bare icons — no border, fill or container. Hover keeps the
                same soft fade the other card actions use. */}
            <div className="flex items-center gap-4">
              {socials.map((social) => {
                const href = social.url;
                const image = imageProps(social.icon);
                const label = social.label;
                const icon = image ? (
                  <Image
                    src={image.src}
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                ) : null;
                // Una red sin URL se dibuja apagada, no como enlace roto.
                return href ? (
                  <a
                    key={social._key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="block transition-opacity duration-300 hover:opacity-60"
                  >
                    {icon}
                  </a>
                ) : (
                  <span key={social._key} aria-hidden className="block">
                    {icon}
                  </span>
                );
              })}
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
