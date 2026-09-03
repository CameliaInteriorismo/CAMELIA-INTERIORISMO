import type { Metadata } from "next";
import { PageHeader } from "@/features/blog/PageHeader";
import { PostList, type PostCard } from "@/features/blog/PostList";
import { sanityFetch } from "@/sanity/lib/fetch";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { metadataFrom } from "@/sanity/lib/seo";

/** Igual que el resto: estática, con el webhook caducándola al publicar. */
export const revalidate = 3600;

const FALLBACK = {
  title: "Blog de interiorismo y decoración | Camelia",
  description:
    "Camelia — Ideas, consejos y tendencias de interiorismo, decoración, materiales y formas de habitar.",
};

/**
 * Pasa por `metadataFrom` como el resto: declaraba su metadata a mano y por
 * eso se quedaba sin Open Graph ni Twitter cards. El título va en ABSOLUTO
 * porque ya lleva la marca al final.
 */
export const metadata: Metadata = {
  ...metadataFrom(undefined, FALLBACK, "/blog"),
  title: { absolute: FALLBACK.title },
};

export default async function BlogPage() {
  // Un artículo publicado en Sanity entra aquí solo, ordenado por fecha.
  const posts = await sanityFetch<PostCard[]>({
    query: POSTS_QUERY,
    tags: ["post"],
  });

  return (
    <>
      <PageHeader />
      <PostList posts={posts} />
    </>
  );
}
