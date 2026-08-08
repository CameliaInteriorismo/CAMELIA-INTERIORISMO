import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

export function CtaBanner() {
  return (
    <section
      className="bg-auxiliary py-16"
      style={{
        backgroundImage: "url('/assets/home/Banner 1 home.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container>
        <div className="bg-background mx-auto flex max-w-3xl flex-col items-center gap-6 px-8 py-14 text-center">
          <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
            ¿Comenzamos tu proyecto?
          </h2>
          <ButtonLink href="/contacto">CONTÁCTANOS</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
