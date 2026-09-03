import Image from "next/image";
import { Marquee } from "@/components/ui/Marquee";

// Real collaborator marks. Every file was flattened to transparency and
// trimmed to its ink (see public/assets/colaboradores) — Coordonné,
// Corston and Ramón Soler shipped on solid white, which was flood-filled
// away from the edges so interior counters stayed intact. Order interleaves
// wide wordmarks with compact marks so neither kind clumps together.
/** The common slot every mark is fitted into. */
/** Anchos del carrusel. Es diseño: la clave que elige cuál viene de Sanity. */
const SLOTS = {
  normal: "h-10 w-[140px] md:h-12 md:w-[170px]",
  wide: "h-10 w-[180px] md:h-12 md:w-[220px]",
  extraWide: "h-10 w-[220px] md:h-12 md:w-[270px]",
} as const;

import { imageProps, type SanityImageSource } from "@/sanity/lib/image";

export type Partner = {
  _id: string;
  name: string;
  logo?: SanityImageSource;
  /** Ancho en el carrusel: algunos logos quedan diminutos con el normal. */
  size?: "normal" | "wide" | "extraWide";
};

export function PartnerLogos({ partners }: { partners: Partner[] }) {
  const logos = partners.map((partner) => (
    // Fixed slot + object-contain: the marks have wildly different aspect
    // ratios (a 1104x163 wordmark next to a 201x151 stacked mark), so
    // sizing each into a common box keeps them optically even instead of
    // letting the wide ones dominate. No card, border or shadow — just the
    // mark on the page background.
    //
    // Maora es la excepción: su marca (sello + palabra + "CERAMIC" apiladas)
    // mide 1.45:1, muy por debajo de cualquier otra (1.84–6.97), así que
    // dentro de la misma altura compartida sale visiblemente más pequeña
    // que sus vecinas por mucho ancho de más que se le dé al slot — el
    // ancho ya no es lo que la limita. `scale-125` la agranda sin tocar el
    // hueco que ocupa en la fila, así el resto de espaciados no se mueve.
    <span
      key={partner._id}
      className={`relative block shrink-0 ${SLOTS[partner.size ?? "normal"]} ${partner.name === "Maora Ceramic" ? "scale-125" : ""}`}
    >
      {/* Eager: the duplicated half of the track sits off-screen, and
          lazy-loading would leave it blank until it drifted in — visible
          as gaps in the band. The files are small, so loading all of them
          up front is cheaper than the pop. */}
      <Image
        src={imageProps(partner.logo)?.src ?? ""}
        alt={partner.name}
        fill
        sizes="230px"
        loading="eager"
        className="object-contain"
      />
    </span>
  ));

  return (
    // Full-bleed rather than inside Container: the band runs edge to edge
    // so the loop never appears to start or stop at a margin.
    <section className="pt-section overflow-hidden">
      {/* De derecha a izquierda, sin `reverse`: es el sentido que se quiere
          aquí. 50s en vez de 70: un poco más de velocidad mientras se sigue
          leyendo cada marca al pasar, no un scroll que se lea de un vistazo
          borroso. */}
      <Marquee items={logos} duration={50} gapClassName="gap-16 md:gap-24" />
    </section>
  );
}
