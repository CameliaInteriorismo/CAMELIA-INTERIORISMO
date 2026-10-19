import { Container, Grid } from "@/components/layout/Container";
import { Multiline } from "@/features/shared/MultilineText";
import {
  ProjectsGrid,
  type ProjectCard,
} from "@/features/proyectos/ProjectsGrid";

export type LandingSection = {
  _key: string;
  title: string;
  paragraphs?: string[];
};

/** La entradilla: título a la izquierda, párrafos a la derecha. */
export function LandingIntro({
  title,
  paragraphs,
}: {
  title?: string;
  paragraphs?: string[];
}) {
  if (!title && !paragraphs?.length) return null;
  return (
    <section className="pt-section">
      <Container>
        <Grid>
          <h2 className="font-title text-primary col-span-12 text-3xl md:col-span-5 md:text-4xl">
            <Multiline text={title} />
          </h2>
          <div className="text-primary/80 col-span-12 space-y-4 text-sm leading-relaxed md:col-span-6 md:col-start-7">
            {(paragraphs ?? []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Grid>
      </Container>
    </section>
  );
}

/**
 * Los bloques de texto de la página, uno debajo de otro, con la misma línea
 * fina arriba que las reseñas y los motivos de la portada.
 */
export function LandingSections({ sections }: { sections: LandingSection[] }) {
  if (sections.length === 0) return null;
  return (
    <section className="pt-section">
      <Container className="space-y-12">
        {sections.map((section) => (
          <Grid key={section._key} className="border-primary/15 border-t pt-8">
            <h3 className="font-title text-primary col-span-12 text-2xl md:col-span-5">
              {section.title}
            </h3>
            <div className="text-primary/80 col-span-12 space-y-4 text-sm leading-relaxed md:col-span-6 md:col-start-7">
              {(section.paragraphs ?? []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Grid>
        ))}
      </Container>
    </section>
  );
}

/** Las obras de la zona: la cuadrícula de /proyectos con su título. */
export function LandingProjects({
  title,
  projects,
}: {
  title?: string;
  projects: ProjectCard[];
}) {
  if (projects.length === 0) return null;
  return <ProjectsGrid projects={projects} title={title} />;
}
