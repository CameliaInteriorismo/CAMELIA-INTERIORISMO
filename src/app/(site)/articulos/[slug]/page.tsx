import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";
import { PageHeroBanner } from "@/components/layout/PageHeroBanner";
import { JsonLd, articulo } from "@/components/seo/JsonLd";
import { ArticleBody } from "@/features/articulos/Articles";
import {
  ProjectsGrid,
  type ProjectCard,
} from "@/features/proyectos/ProjectsGrid";
import { CtaBanner } from "@/features/proyectos/CtaBanner";
import type { CtaBannerData } from "@/features/shared/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";
import {
  ARTICLE_QUERY,
  ARTICLE_SLUGS_QUERY,
  PROYECTOS_PAGE_QUERY,
} from "@/sanity/lib/queries";
import { metadataFrom, type SeoFields } from "@/sanity/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

type Article = {
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  coverImage?: SanityImageSource;
  body?: PortableTextBlock[];
  projects?: ProjectCard[];
  seo?: SeoFields;
};

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: ARTICLE_SLUGS_QUERY,
    tags: ["article"],
  });
  return slugs.map((slug) => ({ slug }));
}

async function leer(slug: string) {
  return sanityFetch<Article | null>({
    query: ARTICLE_QUERY,
    params: { slug },
    tags: ["article", "project"],
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await leer(slug);
  if (!article) return {};
  return await metadataFrom(
    article.seo,
    {
      title: article.title,
      description: article.excerpt ?? article.title,
      image: imageProps(article.coverImage)?.src,
    },
    `/articulos/${slug}`,
  );
}

export default async function ArticuloPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, page] = await Promise.all([
    leer(slug),
    sanityFetch<{ cta?: CtaBannerData } | null>({
      query: PROYECTOS_PAGE_QUERY,
      tags: ["proyectosPage"],
    }),
  ]);
  if (!article) notFound();
  const portada = imageProps(article.coverImage);

  return (
    <>
      <PageHeroBanner
        title={article.title}
        image={portada?.src}
        titleClassName="text-background tracking-[0.02em]"
        imagePosition={portada?.objectPosition ?? "center"}
      />
      <ArticleBody date={article.date} body={article.body ?? []} />
      {(article.projects ?? []).length > 0 && (
        <ProjectsGrid
          projects={article.projects ?? []}
          title="Los proyectos de este artículo"
        />
      )}
      <CtaBanner cta={page?.cta} />
      <JsonLd
        data={articulo({
          title: article.title,
          slug: article.slug,
          date: article.date,
          excerpt: article.excerpt,
          imagen: portada?.src,
        })}
      />
    </>
  );
}
