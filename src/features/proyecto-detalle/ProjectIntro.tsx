import { Container } from "@/components/layout/Container";

export function ProjectIntro({ paragraphs }: { paragraphs: string[] }) {
  return (
    <section className="mt-block">
      <Container>
        <div className="text-primary/75 space-y-6 text-base leading-relaxed">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </section>
  );
}
