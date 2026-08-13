import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

// Each card opens its own ficha. The slugs are the ones in
// features/proyecto-detalle/data.ts, the same targets the Proyectos listing
// links to — a project reached from Home lands on exactly the page it does
// from anywhere else.
const DETAIL_IMAGES = [
  {
    slug: "llum-de-vila",
    src: "/assets/home/Proyecto Llum de Vila - Cocina.jpg",
    alt: "Proyecto Llum de Vila — Cocina",
    name: "LLUM DE VILA",
  },
  {
    slug: "plaza-mayor",
    src: "/assets/home/Proyecto Plaza Mayor - Baño.jpg",
    alt: "Proyecto Plaza Mayor — Baño",
    name: "PLAZA MAYOR",
  },
  {
    slug: "somni",
    src: "/assets/home/Proyecto Somni - Puertas correderas.png",
    alt: "Proyecto Somni — Puertas correderas",
    name: "SOMNI",
  },
  {
    slug: "ermita",
    src: "/assets/home/PROYECTO ERMITA - Salon.jpg",
    alt: "Proyecto Ermita — Salón",
    name: "ERMITA",
  },
];

export function DetailGrid() {
  return (
    <section className="py-[60px]">
      <Container>
        <h2 className="font-title text-primary max-w-2xl text-3xl uppercase md:text-4xl">
          Espacios construidos desde el detalle
        </h2>
        <div className="mt-title grid grid-cols-1 gap-8 md:grid-cols-2">
          {DETAIL_IMAGES.map((image) => (
            <Link
              key={image.slug}
              href={`/proyectos/${image.slug}`}
              className="group relative aspect-[4/3] w-full overflow-hidden"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/30" />
              <span className="font-title text-background absolute bottom-6 left-6 text-2xl uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                {image.name}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
