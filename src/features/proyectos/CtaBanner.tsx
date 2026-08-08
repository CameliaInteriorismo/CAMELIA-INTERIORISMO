import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

// Striped pattern measured directly from Diseño/PROYECTOS.png (vino stripes
// on the auxiliary blue-gray background): two ~7px stripes 13px apart,
// repeating every ~73px. Expressed as a repeating-linear-gradient rather
// than an image asset since it's a simple geometric pattern.
const STRIPE_PATTERN =
  "repeating-linear-gradient(to right, var(--color-primary) 0px, var(--color-primary) 6px, transparent 6px, transparent 19px, var(--color-primary) 19px, var(--color-primary) 26px, transparent 26px, transparent 73px)";

export function CtaBanner() {
  return (
    <section
      className="bg-auxiliary py-20 mb-[120px]"
      style={{ backgroundImage: STRIPE_PATTERN }}
    >
      <Container>
        <div className="bg-background flex flex-col items-center gap-8 px-10 py-16 text-center">
          <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
            ¿Comenzamos tu proyecto?
          </h2>
          <ButtonLink href="/contacto">CONTÁCTANOS</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
