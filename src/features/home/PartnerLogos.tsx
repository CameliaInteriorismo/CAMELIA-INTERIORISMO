import Image from "next/image";
import { Marquee } from "@/components/ui/Marquee";

// Real collaborator marks. Every file was flattened to transparency and
// trimmed to its ink (see public/assets/colaboradores) — Coordonné,
// Corston and Ramón Soler shipped on solid white, which was flood-filled
// away from the edges so interior counters stayed intact. Order interleaves
// wide wordmarks with compact marks so neither kind clumps together.
const PARTNERS = [
  { name: "Blum", src: "/assets/colaboradores/blum.png" },
  { name: "Casamance", src: "/assets/colaboradores/casamance.png" },
  { name: "Gessi", src: "/assets/colaboradores/gessi.png" },
  { name: "Ramón Soler", src: "/assets/colaboradores/ramonsoler.png" },
  { name: "Maora Ceramic", src: "/assets/colaboradores/maora.png" },
  { name: "Falmec", src: "/assets/colaboradores/falmec.png" },
  { name: "GRE Studio", src: "/assets/colaboradores/gre-studio.png" },
  { name: "Asko", src: "/assets/colaboradores/asko.png" },
  { name: "Corston", src: "/assets/colaboradores/corston.png" },
  { name: "Coordonné", src: "/assets/colaboradores/coordonne.png" },
];

export function PartnerLogos() {
  const logos = PARTNERS.map((partner) => (
    // Fixed slot + object-contain: the marks have wildly different aspect
    // ratios (a 1104x163 wordmark next to a 201x151 stacked mark), so
    // sizing each into a common box keeps them optically even instead of
    // letting the wide ones dominate. No card, border or shadow — just the
    // mark on the page background.
    <span
      key={partner.name}
      className="relative block h-10 w-[140px] shrink-0 md:h-12 md:w-[170px]"
    >
      {/* Eager: the duplicated half of the track sits off-screen, and
          lazy-loading would leave it blank until it drifted in — visible
          as gaps in the band. The files are small, so loading all of them
          up front is cheaper than the pop. */}
      <Image
        src={partner.src}
        alt={partner.name}
        fill
        sizes="170px"
        loading="eager"
        className="object-contain"
      />
    </span>
  ));

  return (
    // Full-bleed rather than inside Container: the band runs edge to edge
    // so the loop never appears to start or stop at a margin.
    <section className="overflow-hidden py-[100px]">
      {/* 70s for ten logos — a touch more momentum than the original 90s
          so the travel feels natural, still slow enough to read each mark
          as it drifts past. */}
      <Marquee items={logos} duration={70} gapClassName="gap-16 md:gap-24" />
    </section>
  );
}
