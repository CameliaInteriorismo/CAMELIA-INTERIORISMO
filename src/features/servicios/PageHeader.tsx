import { PageHeroBanner } from "@/components/layout/PageHeroBanner";

export function PageHeader() {
  return (
    <PageHeroBanner
      title="Servicios"
      image="/assets/servicios/Servicio hero.jpg"
      titleClassName="text-background tracking-[0.02em]"
      imagePosition="center 58%"
    />
  );
}
