import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PostArticle,
  type Post,
  type PostNeighbour,
} from "@/features/blog/PostArticle";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  ADJACENT_POSTS_QUERY,
  POST_QUERY,
  POST_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import { imageProps } from "@/sanity/lib/image";
import { metadataFrom, type SeoFields } from "@/sanity/lib/seo";

type PostPageData = Post & { publishedAt: string; seo?: SeoFields };

/** Igual que el resto: estática, con el webhook caducándola al publicar. */
export const revalidate = 3600;

/** Las rutas salen de Sanity: publicar un artículo le da su página. */
export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: POST_SLUGS_QUERY,
    tags: ["post"],
  });
  return slugs.map((slug) => ({ slug }));
}

/** Un artículo publicado tras el despliegue se renderiza a la primera visita. */
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<PostPageData | null>({
    query: POST_QUERY,
    params: { slug },
    tags: ["post"],
  });
  if (!post) return {};

  return metadataFrom(post.seo, {
    title: post.title,
    description: post.subtitle ?? `Camelia — ${post.title}.`,
    image: imageProps(post.leadImage)?.src,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<PostPageData | null>({
    query: POST_QUERY,
    params: { slug },
    tags: ["post"],
  });
  if (!post) notFound();

  // Vecinos por fecha. Deliberadamente NO da la vuelta: en los extremos, el
  // vecino que falta es lo que hace que la ficha ofrezca "Volver" en vez de
  // devolver al lector al primer artículo en silencio.
  const { previous, next } = await sanityFetch<{
    previous: PostNeighbour;
    next: PostNeighbour;
  }>({
    query: ADJACENT_POSTS_QUERY,
    params: { publishedAt: post.publishedAt },
    tags: ["post"],
  });

  return <PostArticle post={post} previous={previous} next={next} />;
}
