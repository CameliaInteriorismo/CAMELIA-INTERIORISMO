import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Multiline } from "@/features/shared/MultilineText";

// Each card opens its own ficha. The slugs are the ones in
// features/proyecto-detalle/data.ts, the same targets the Proyectos listing
// links to — a project reached from Home lands on exactly the page it does
// from anywhere else.
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";

export type FeaturedProject = {
  _key: string;
  name: string;
  slug: string;
  image?: SanityImageSource;
};

export function DetailGrid({
  projects,
  title,
}: {
  projects: FeaturedProject[];
  title?: string;
}) {
  return (
    <section className="py-[60px]">
      <Container>
        <h2 className="font-title text-primary max-w-2xl text-3xl md:text-4xl">
          <Multiline text={title} />
        </h2>
        <div className="mt-title grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project) => {
            const image = imageProps(project.image);
            if (!image) return null;
            return (
              <Link
                key={project._key}
                href={`/proyectos/${project.slug}`}
                className="group relative aspect-[4/3] w-full overflow-hidden"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  placeholder={image.blurDataURL ? "blur" : undefined}
                  blurDataURL={image.blurDataURL}
                  className="object-cover"
                  style={{ objectPosition: image.objectPosition }}
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/30" />
                <span className="font-title text-background absolute bottom-6 left-6 text-2xl uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100">
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
