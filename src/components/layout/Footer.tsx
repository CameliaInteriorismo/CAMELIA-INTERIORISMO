import Image from "next/image";
import Link from "next/link";
import { ConsentSettingsLink } from "@/components/consent/ConsentSettingsLink";
import { Container } from "@/components/layout/Container";
import { imageProps } from "@/sanity/lib/image";
import type { ContactDetails, Social } from "@/features/contacto/types";
import type { LinkData } from "@/features/shared/types";

// Fixed order, set by the studio. "Configuración de cookies" sits fourth as
// a button rather than a link — it reopens the consent panel instead of
// navigating (see ConsentSettingsLink), which is why it isn't in this list.

export type FooterData = {
  tagline?: string;
  navTitle?: string;
  navLinks: LinkData[];
  contactTitle?: string;
  scheduleTitle?: string;
  /**
   * Los legales, en el orden que fija Sanity. El de "Configuración de
   * cookies" no navega: abre el panel del banner, y se reconoce porque su
   * destino es "#cookies" (ver ConsentSettingsLink).
   */
  legalLinks: LinkData[];
  copyright?: string;
  socials: Social[];
  contact: ContactDetails;
};

export function Footer({ data }: { data: FooterData }) {
  return (
    <footer className="bg-background text-primary">
      {/* Línea a sangre completa: 1px, vino, muy poca opacidad. El margen de
          160px empieza únicamente en el contenido de debajo, no en la línea. */}
      <div className="bg-primary/10 h-px w-full" />

      <Container>
        {/* Flex + justify-between (no grid de columnas iguales): la primera
            columna queda anclada al margen izquierdo, la última al derecho,
            y Navegación/Contacto se reparten el espacio entre ambas con
            huecos uniformes — igual que en Figma, sin forzar anchos iguales. */}
        <div className="flex flex-col gap-y-12 py-20 md:flex-row md:flex-nowrap md:justify-between">
          <div>
            <Image
              src="/images/logos/trimmed/Camelia logo sin fondo vino actualizado.png"
              alt="Camelia"
              width={828}
              height={130}
              className="h-6 w-auto"
            />
            {/* Más estrecha en tablet: a 20rem la frase empujaba a las
                columnas de al lado y quedaban pegadas. Cortando antes, el
                `justify-between` reparte el ancho sobrante entre las tres. */}
            <p className="mt-4 max-w-[15rem] text-sm leading-relaxed font-light lg:max-w-xs">
              {data.tagline ??
                "Estudio de interiorismo en Valencia. Diseñamos espacios pensados para habitarse, vivirse y sentirse propios."}
            </p>
            <div className="mt-6 flex gap-4">
              {data.socials.map((social) => {
                const label = social.label;
                const href = social.url;
                const src = imageProps(social.icon)?.src;
                const icon = src ? (
                  <Image
                    src={src}
                    alt=""
                    width={24}
                    height={24}
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
                    className="transition-opacity hover:opacity-70"
                  >
                    {icon}
                  </a>
                ) : (
                  <span key={social._key} aria-hidden>
                    {icon}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Navegación se cae en tablet: con cuatro columnas entre 768 y
              1023 todo quedaba apretado, y estos enlaces ya están en el menú.
              Al desaparecer, el `justify-between` reparte de verdad el ancho
              entre las tres que quedan. */}
          <div className="hidden lg:block">
            <p className="text-sm font-normal tracking-[0.06em]">
              {data.navTitle}
            </p>
            <ul className="mt-4 space-y-3 text-sm font-light tracking-[-0.01em]">
              {data.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-opacity hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-normal tracking-[0.06em]">
              {data.contactTitle}
            </p>
            {/* Bloque informativo, no navegación: nada de aquí es clicable ni
                tiene hover. Los únicos enlaces del pie son los de Navegación
                y los legales de abajo. */}
            <ul className="mt-4 space-y-3 text-sm font-light tracking-[-0.01em]">
              {/* Las dos líneas de la dirección van juntas dentro de un mismo
                  li, con su propio interlineado ajustado: se separan menos
                  entre sí (≈20px) que del resto de la lista (12px de
                  space-y-3 + altura de línea), así que se leen como un bloque
                  y no como dos datos distintos. */}
              <li className="leading-relaxed">
                {data.contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </li>
              <li>{data.contact.email}</li>
              {/* Desde CONTACT, no escrito a mano: el literal que había aquí
                  acababa en 12 01 y contradecía al de la página de Contacto. */}
              <li className="[word-spacing:0.3em]">{data.contact.phone}</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-normal tracking-[0.06em]">
              {data.scheduleTitle}
            </p>
            <ul className="mt-4 space-y-3 text-sm font-light tracking-[-0.01em]">
              {(data.contact.openingHours ?? []).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-primary/10 flex flex-col gap-4 border-t py-8 text-xs font-light md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {data.copyright}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {data.legalLinks.map((link) =>
              link.href === "#cookies" ? (
                <ConsentSettingsLink
                  key={link.href}
                  className="transition-opacity hover:opacity-70"
                />
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-opacity hover:opacity-70"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}
