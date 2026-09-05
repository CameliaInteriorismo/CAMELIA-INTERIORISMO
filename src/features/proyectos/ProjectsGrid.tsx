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
 * maquetado y el hover siguen siendo los de antes.
 *
 * Ya no lleva la tarjeta de "Próximamente": era un hueco de relleno y la
 * cuadrícula se cierra ahora con el último proyecto real.
 */
export function ProjectsGrid({ projects }: { projects: ProjectCard[] }) {
  return (
    <section className="pt-section">
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
                {/* En móvil no hay hover: `:active` (dedo pulsado) reproduce
                    el mismo revelado que el ratón dispara en desktop. */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-active:bg-black/30 group-hover:bg-black/30" />
                {/* uppercase por CSS: el nombre se guarda en Sanity tal como
                    se escribe ("Llum de Vila") y la mayúscula es diseño. */}
                <span className="font-title text-background absolute bottom-6 left-6 text-2xl uppercase opacity-0 transition-opacity duration-300 group-active:opacity-100 group-hover:opacity-100">
                  {project.name}
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
