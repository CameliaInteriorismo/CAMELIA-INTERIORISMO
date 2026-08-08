import type { Metadata } from "next";
import { PageHeader } from "@/features/blog/PageHeader";
import { PostList } from "@/features/blog/PostList";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Camelia — reflexiones sobre interiorismo, materiales y formas de habitar.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader />
      <PostList />
    </>
  );
}
