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
        <div className="bg-background flex flex-col items-start gap-8 px-10 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
              Hablemos de tu espacio
            </h2>
            <p className="text-primary/75 mt-sm max-w-xl text-sm leading-relaxed">
              Cada proyecto parte de entender cómo vives, qué necesitas y cómo
              quieres sentir tu espacio. Estaremos encantados de escuchar tu
              idea y acompañarte en el proceso.
            </p>
          </div>
          <ButtonLink href="/contacto" className="shrink-0">
            ¿COMENZAMOS?
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
