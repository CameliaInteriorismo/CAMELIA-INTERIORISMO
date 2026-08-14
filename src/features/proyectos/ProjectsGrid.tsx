import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";

export type ProjectCard = {
  _id: string;
  name: string;
  slug: string;
  cardImage?: SanityImageSource;
};

/**
 * La cuadrícula de /proyectos. El contenido llega desde Sanity por props; el
 * maquetado, el hover y la tarjeta de "Próximamente" siguen siendo los de
 * antes, sin un solo cambio de clase.
 */
export function ProjectsGrid({ projects }: { projects: ProjectCard[] }) {
  return (
    <section className="pt-title pb-[100px]">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project) => {
            const image = imageProps(project.cardImage);
            return (
              <Link
                key={project._id}
                href={`/proyectos/${project.slug}`}
                className="group relative aspect-[4/3] w-full overflow-hidden"
              >
                {image && (
                  <Image
                    src={image.src}
                    alt={image.alt || `Proyecto ${project.name}`}
                    fill
                    placeholder={image.blurDataURL ? "blur" : undefined}
                    blurDataURL={image.blurDataURL}
                    className="object-cover"
                    style={{ objectPosition: image.objectPosition }}
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/30" />
                {/* uppercase por CSS: el nombre se guarda en Sanity tal como
                    se escribe ("Llum de Vila") y la mayúscula es diseño. */}
                <span className="font-title text-background absolute bottom-6 left-6 text-2xl uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {project.name}
                </span>
              </Link>
            );
          })}

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
