import type { Metadata } from "next";
import { PageHeader } from "@/features/blog/PageHeader";
import { PostList, type PostCard } from "@/features/blog/PostList";
import { sanityFetch } from "@/sanity/lib/fetch";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { absoluteUrl } from "@/lib/site";

/** Igual que el resto: estática, con el webhook caducándola al publicar. */
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/blog") },
  title: "Blog",
  description:
    "Camelia — reflexiones sobre interiorismo, materiales y formas de habitar.",
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
