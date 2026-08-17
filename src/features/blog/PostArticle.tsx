import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { ARTICLE_TITLE_SCALE } from "@/components/ui/typography";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";
import { cn } from "@/utils/cn";

export type PostNeighbour = { title: string; slug: string } | null;

export type Post = {
  title: string;
  titleLines?: string[];
  slug: string;
  subtitle?: string;
  leadImage?: SanityImageSource;
  body?: unknown[];
};

function PairImage({
  source,
  label,
}: {
  source?: SanityImageSource;
  label: string;
}) {
  const image = imageProps(source);
  return (
    <div className="relative aspect-[8/7] w-full overflow-hidden">
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          aria-hidden={!image.alt}
          fill
          placeholder={image.blurDataURL ? "blur" : undefined}
          blurDataURL={image.blurDataURL}
          className="object-cover"
          style={{ objectPosition: image.objectPosition }}
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      ) : (
        <PlaceholderImage
          aspectRatio="8 / 7"
          label={label}
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
}

/**
 * El cuerpo del artículo, pintado con las mismas clases que antes.
 *
 * Los párrafos van dentro de un bloque con `space-y-6`, igual que el array
 * de bloques de texto original; las parejas de imágenes conservan su rejilla
 * de dos columnas y su proporción 8/7.
 */
function bodyComponents(title: string): PortableTextComponents {
  return {
    block: {
      // El ritmo original: 40px antes de un grupo de párrafos y 24px entre
      // párrafos seguidos. Antes lo daba un <div> con space-y-6 envolviendo
      // cada grupo; Portable Text emite los párrafos sueltos, así que el
      // segundo y siguientes se reconocen con `p+&` y recuperan sus 24px.
      normal: ({ children }) => (
        <p className="text-primary/75 mt-block text-sm leading-relaxed [p+&]:mt-6">
          {children}
        </p>
      ),
    },
    marks: {
      link: ({ children, value }) => (
        <a href={value?.href} className="underline underline-offset-4">
          {children}
        </a>
      ),
    },
    types: {
      galleryPair: ({ value }) => (
        <div className="mt-title grid gap-8 md:grid-cols-2">
          <PairImage source={value?.left} label={`${title} — foto 1`} />
          <PairImage source={value?.right} label={`${title} — foto 2`} />
        </div>
      ),
      gallerySingle: ({ value }) => (
        <div className="mt-title">
          <PairImage source={value?.image} label={`${title} — foto`} />
        </div>
      ),
    },
  };
}

export function PostArticle({
  post,
  previous,
  next,
}: {
  post: Post;
  previous?: PostNeighbour;
  next?: PostNeighbour;
}) {
  const lead = imageProps(post.leadImage);

  return (
    <article className="pt-title pb-[100px]">
      <Container>
        {/* One step below the hero scale — see ARTICLE_TITLE_SCALE. */}
        <h1 className={cn("font-title text-primary", ARTICLE_TITLE_SCALE)}>
          {(post.titleLines?.length ? post.titleLines : [post.title]).map(
            (line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ),
          )}
        </h1>

        {/* Lead image runs the full content width at roughly 2:1, per the
            reference — wider and shallower than the gallery pairs below. */}
        <div className="mt-title relative aspect-[2/1] w-full overflow-hidden">
          {lead ? (
            <Image
              src={lead.src}
              alt={lead.alt}
              aria-hidden={!lead.alt}
              fill
              priority
              placeholder={lead.blurDataURL ? "blur" : undefined}
              blurDataURL={lead.blurDataURL}
              className="object-cover"
              style={{ objectPosition: lead.objectPosition }}
              sizes="(min-width: 1024px) 1120px, 100vw"
            />
          ) : (
            <PlaceholderImage
              aspectRatio="2 / 1"
              label={`${post.title} — foto principal`}
              className="absolute inset-0 h-full w-full"
            />
          )}
        </div>

        {post.subtitle && (
          <h2 className="font-title text-primary mt-title text-2xl md:text-3xl">
            {post.subtitle}
          </h2>
        )}

        {post.body && (
          <PortableText
            value={post.body as never}
            components={bodyComponents(post.title)}
          />
        )}

        {/* Always two controls, one per side, so the row stays balanced
            at either end of the series: where there's no neighbouring
            article the slot falls back to the blog index rather than
            collapsing and leaving the remaining button adrift. */}
        {/* Apila en móvil: en una sola fila, un título largo de artículo
            empujaba al otro control y se cortaban. Desde sm vuelven a la fila
            de siempre. */}
        <nav className="mt-title flex flex-col items-stretch gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <ButtonLink
            href={previous ? `/blog/${previous.slug}` : "/blog"}
            className="gap-2"
          >
            <ArrowLeftIcon className="h-3 w-3" />
            {previous ? "ANTERIOR ARTÍCULO" : "VOLVER"}
          </ButtonLink>

          <ButtonLink
            href={next ? `/blog/${next.slug}` : "/blog"}
            className="gap-2"
          >
            {next ? "SIGUIENTE ARTÍCULO" : "VOLVER"}
            <ArrowRightIcon className="h-3 w-3" />
          </ButtonLink>
        </nav>
      </Container>
    </article>
  );
}
