import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostArticle } from "@/features/blog/PostArticle";
import { BLOG_POSTS, getPost } from "@/features/blog/data";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.subtitle ?? `Camelia — ${post.title}.`,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return <PostArticle post={post} />;
}
