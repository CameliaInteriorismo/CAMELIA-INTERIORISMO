import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { Container } from "@/components/layout/Container";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";

export type ArticleCard = {
  _id: string;
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  coverImage?: SanityImageSource;
};

/** «19 de octubre de 2026». La fecha viene como AAAA-MM-DD, sin hora. */
export function fechaLarga(fecha: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${fecha}T00:00:00Z`));
}

/** El listado de /articulos: foto, fecha, título y resumen. */
export function ArticlesGrid({ articles }: { articles: ArticleCard[] }) {
  return (
    <section className="pt-section">
      <Container>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
          {articles.map((article) => {
            const image = imageProps(article.coverImage);
            return (
              <Link
                key={article._id}
                href={`/articulos/${article.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {image && (
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      placeholder={image.blurDataURL ? "blur" : undefined}
                      blurDataURL={image.blurDataURL}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      style={{ objectPosition: image.objectPosition }}
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  )}
                </div>
                <p className="text-primary mt-6 text-xs tracking-[0.06em] uppercase">
                  {fechaLarga(article.date)}
                </p>
                <h2 className="font-title text-primary mt-2 text-2xl">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="text-primary mt-sm text-sm leading-relaxed">
                    {article.excerpt}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

const COMPONENTES: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-primary mt-4 text-base leading-relaxed">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-title text-primary mt-12 text-2xl md:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-title text-primary mt-8 text-xl">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-primary/30 font-title text-primary mt-8 border-l-2 pl-6 text-xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-primary mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-primary mt-4 list-decimal space-y-2 pl-6 text-base leading-relaxed">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-primary font-medium">{children}</strong>
    ),
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const clase = "text-primary underline underline-offset-4";
      return href.startsWith("/") ? (
        <Link href={href} className={clase}>
          {children}
        </Link>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={clase}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    imageWithAlt: ({ value }) => {
      const image = imageProps(value as SanityImageSource);
      if (!image) return null;
      // Cada foto con su proporción: una vertical recortada a apaisada
      // perdería justo lo que enseña. Las verticales van más estrechas para
      // que no ocupen tres pantallas.
      const vertical = image.height > image.width;
      return (
        <figure className={`mt-8 ${vertical ? "mx-auto max-w-[26rem]" : ""}`}>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            placeholder={image.blurDataURL ? "blur" : undefined}
            blurDataURL={image.blurDataURL}
            className="h-auto w-full"
            sizes={vertical ? "416px" : "(min-width: 768px) 672px, 100vw"}
          />
        </figure>
      );
    },
  },
};

/** El texto del artículo, en una columna de lectura. */
export function ArticleBody({
  date,
  body,
}: {
  date: string;
  body: PortableTextBlock[];
}) {
  return (
    <section className="pt-section">
      <Container>
        <article className="mx-auto max-w-2xl">
          <p className="text-primary text-xs tracking-[0.06em] uppercase">
            {fechaLarga(date)}
          </p>
          <PortableText value={body} components={COMPONENTES} />
        </article>
      </Container>
    </section>
  );
}
