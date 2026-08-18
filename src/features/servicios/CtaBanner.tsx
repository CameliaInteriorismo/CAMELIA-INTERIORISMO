import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { urlFor } from "@/sanity/lib/image";
import type { CtaBannerData } from "@/features/shared/types";

/**
 * Banner de Servicios. El texto, el botón y la imagen de fondo vienen de
 * Sanity; el marcado y las clases son los de siempre.
 *
 * La imagen va como `background-image` y no con `next/image` — igual que
 * antes, porque la maquetación depende de `background-size: cover` sobre la
 * sección entera, no de un elemento posicionado.
 */
export function CtaBanner({ cta }: { cta?: CtaBannerData }) {
  const background = cta?.image ? urlFor(cta.image).width(1920).url() : null;

  return (
    <section
      // El aire exterior de arriba vive aquí. Abajo lo pone el `pt-section` de
      // la sección siguiente, así que cada lado tiene UNA sola fuente y nada se
      // suma. El `py` es otra cosa: es el padding INTERNO que separa el
      // recuadro crema del borde de la franja de color, y se queda como está.
      className="bg-auxiliary mt-section py-16"
      style={{
        backgroundImage: background ? `url('${background}')` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container>
        {/* El recuadro no ocupa todo el contenedor: a ancho completo el
            `justify-between` mandaba el botón al extremo derecho y quedaba un
            vacío enorme entre la frase y él. Estrechado y centrado, el texto
            —que ya va a `max-w-xl`— y el botón casi llenan la fila, así que el
            hueco se cierra solo sin tocar tamaños ni tipografía. */}
        <div className="bg-background gap-md mx-auto flex max-w-4xl flex-col items-start px-10 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            {/* El banner va en mayúsculas por diseño, y lo decide aquí: es lo
                único de la web que las lleva por CSS. Los héroes y los títulos
                de contenido se leen tal cual se escriben en el panel. */}
            <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
              {cta?.title}
            </h2>
            {cta?.text && (
              <p className="text-primary/75 mt-sm max-w-xl text-sm leading-relaxed">
                {cta.text}
              </p>
            )}
          </div>
          {cta?.button && (
            <ButtonLink href={cta.button.href} className="shrink-0">
              {cta.button.label}
            </ButtonLink>
          )}
        </div>
      </Container>
    </section>
  );
}
