import { PageHeroBanner } from "@/components/layout/PageHeroBanner";

export function PageHeader() {
  return (
    <PageHeroBanner
      title="Proyectos"
      image="/assets/proyectos/Proyectos hero.jpg"
      titleClassName="text-background tracking-[0.02em]"
      imagePosition="center 35%"
    />
  );
}
