import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

const PROJECTS = [
  {
    slug: "llum-de-vila",
    name: "LLUM DE VILA",
    image: "/assets/proyectos/Proyecto Llum de Vila - Cocina.jpg",
  },
  {
    slug: "plaza-mayor",
    name: "PLAZA MAYOR",
    image: "/assets/proyectos/Proyecto Plaza Mayor - Baño.jpg",
  },
  {
    slug: "somni",
    name: "SOMNI",
    image: "/assets/proyectos/Proyecto Somni - Puertas correderas.png",
  },
  {
    slug: "ermita",
    name: "ERMITA",
    image: "/assets/proyectos/PROYECTO ERMITA - Salon.jpg",
  },
  {
    slug: "atico-valencia",
    name: "ÀTICO VALENCIA",
    image: "/assets/proyectos/Cocina Àtico Valencia.png",
  },
] as const;

export function ProjectsGrid() {
  return (
    <section className="pt-title pb-[100px]">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <Link
              key={project.slug}
              href={`/proyectos/${project.slug}`}
              className="group relative aspect-[4/3] w-full overflow-hidden"
            >
              <Image
                src={project.image}
                alt={`Proyecto ${project.name}`}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/30" />
              <span className="font-title text-background absolute bottom-6 left-6 text-2xl uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                {project.name}
              </span>
            </Link>
          ))}

          {/* "Próximamente" placeholder card — part of the design itself,
              not a missing-asset gap. */}
          <div className="bg-primary relative flex aspect-[4/3] w-full items-center justify-center">
            <span className="font-title text-background text-2xl uppercase">
              Próximamente
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
