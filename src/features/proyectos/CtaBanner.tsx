import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import type { CtaBannerData } from "@/features/shared/types";

// Striped pattern measured directly from Diseño/PROYECTOS.png (vino stripes
// on the auxiliary blue-gray background): two ~7px stripes 13px apart,
// repeating every ~73px. Expressed as a repeating-linear-gradient rather
// than an image asset since it's a simple geometric pattern.
const STRIPE_PATTERN =
  "repeating-linear-gradient(to right, var(--color-primary) 0px, var(--color-primary) 6px, transparent 6px, transparent 19px, var(--color-primary) 19px, var(--color-primary) 26px, transparent 26px, transparent 73px)";

export function CtaBanner({ cta }: { cta?: CtaBannerData }) {
  return (
    <section
      className="bg-auxiliary mb-[120px] py-20"
      style={{ backgroundImage: STRIPE_PATTERN }}
    >
      <Container>
        <div className="bg-background flex flex-col items-center gap-8 px-10 py-16 text-center">
          <h2 className="font-title text-primary text-3xl md:text-4xl">
            {cta?.title}
          </h2>
          {cta?.button && (
            <ButtonLink href={cta.button.href}>{cta.button.label}</ButtonLink>
          )}
        </div>
      </Container>
    </section>
  );
}
