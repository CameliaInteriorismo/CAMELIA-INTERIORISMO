import { Container } from "@/components/layout/Container";

export function IntroSection() {
  return (
    <section className="pt-[100px]">
      <Container>
        <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
          Espacios con
          <br />
          identidad propia
        </h2>
        <p className="text-primary/75 mt-title text-sm leading-relaxed">
          Diseñamos espacios que responden a quienes lo habitan, cuidando la
          distribución, la luz, los materiales y cada detalle desde una
          mirada coherente y duradera. Cada proyecto nace de entender cómo
          vive cada cliente para traducirlo en interiores equilibrados,
          funcionales y con identidad propia.
        </p>
      </Container>
    </section>
  );
}
