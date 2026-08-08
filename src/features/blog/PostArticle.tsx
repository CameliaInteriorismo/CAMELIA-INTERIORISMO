import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { ARTICLE_TITLE_SCALE } from "@/components/ui/typography";
import { getAdjacentPosts, type BlogPost } from "@/features/blog/data";
import { cn } from "@/utils/cn";

function PairImage({ src, label }: { src?: string; label: string }) {
  return (
    <div className="relative aspect-[8/7] w-full overflow-hidden">
      {src ? (
        <Image
          src={src}
          alt=""
          aria-hidden
          fill
          className="object-cover"
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

export function PostArticle({ post }: { post: BlogPost }) {
  const { previous, next } = getAdjacentPosts(post.slug);

  return (
    <article className="pt-title pb-[100px]">
      <Container>
        {/* One step below the hero scale — see ARTICLE_TITLE_SCALE. */}
        <h1 className={cn("font-title text-primary", ARTICLE_TITLE_SCALE)}>
          {post.titleLines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h1>

        {/* Lead image runs the full content width at roughly 2:1, per the
            reference — wider and shallower than the gallery pairs below. */}
        <div className="mt-title relative aspect-[2/1] w-full overflow-hidden">
          {post.leadImage ? (
            <Image
              src={post.leadImage}
              alt=""
              aria-hidden
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 1120px, 100vw"
            />
          ) : (
            <PlaceholderImage
              aspectRatio="2 / 1"
              label={`${post.title} — foto principal sin Diseño/`}
              className="absolute inset-0 h-full w-full"
            />
          )}
        </div>

        {post.subtitle && (
          <h2 className="font-title text-primary mt-title text-2xl md:text-3xl">
            {post.subtitle}
          </h2>
        )}

        {post.body.map((block, index) =>
          block.type === "text" ? (
            <div
              key={index}
              className="text-primary/75 mt-block space-y-6 text-sm leading-relaxed"
            >
              {block.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <div key={index} className="mt-title grid gap-8 md:grid-cols-2">
              <PairImage
                src={block.images[0]}
                label={`${post.title} — foto 1 sin Diseño/`}
              />
              <PairImage
                src={block.images[1]}
                label={`${post.title} — foto 2 sin Diseño/`}
              />
            </div>
          ),
        )}

        {/* Always two controls, one per side, so the row stays balanced
            at either end of the series: where there's no neighbouring
            article the slot falls back to the blog index rather than
            collapsing and leaving the remaining button adrift. */}
        <nav className="mt-title flex items-center justify-between gap-4">
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
