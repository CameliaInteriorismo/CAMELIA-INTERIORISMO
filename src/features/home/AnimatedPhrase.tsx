import { Marquee } from "@/components/ui/Marquee";

const PHRASES = [
  "CREAMOS FORMAS DE VIVIR",
  "CREAMOS ESPACIOS QUE ACOMPAÑAN",
  "CREAMOS FORMAS DE HABITAR",
  "CREAMOS EXPERIENCIAS",
];

/**
 * The calm, looping wordmark ticker that sits below the hero as its own
 * section. "Circular" per the brief means an endless loop, not a literal
 * curved path — a slow linear marquee reads as the same calm, elegant motion.
 * The loop itself now lives in the shared Marquee primitive, so the
 * request-sent screen reuses exactly this motion rather than copying it.
 */
export function AnimatedPhrase() {
  return (
    <div className="relative overflow-hidden py-10 md:py-14">
      <Marquee
        items={PHRASES}
        className="text-primary/15 font-title text-3xl md:text-4xl"
        separator={
          <span aria-hidden className="text-xl">
            ·
          </span>
        }
      />
    </div>
  );
}
