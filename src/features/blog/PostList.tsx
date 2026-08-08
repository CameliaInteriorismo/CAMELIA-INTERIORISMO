import Image from "next/image";
import Link from "next/link";
import { Container, Grid } from "@/components/layout/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { BLOG_POSTS } from "@/features/blog/data";

export function PostList() {
  return (
    <section className="pt-title pb-[100px]">
      <Container>
        {/* One hairline under every row, including the last — matching the
            reference, where the rule closes the list rather than only
            separating entries. */}
        <div className="divide-primary/15 border-primary/15 divide-y border-b">
          {BLOG_POSTS.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block py-title"
            >
              <Grid className="items-center">
                <div className="col-span-12 md:col-span-6">
                  {/* Index reads as a quiet marker, not a heading — hence
                      the muted tone against the title's full vino. */}
                  <p className="font-title text-primary/30 text-2xl">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="font-title text-primary mt-block text-3xl uppercase md:text-4xl">
                    {post.titleLines.map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </h2>
                </div>

                <div className="col-span-12 mt-block md:col-span-4 md:col-start-9 md:mt-0">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt=""
                        aria-hidden
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        sizes="(min-width: 768px) 33vw, 100vw"
                      />
                    ) : (
                      <PlaceholderImage
                        aspectRatio="4 / 3"
                        label={`${post.title} — sin foto en Diseño/`}
                        className="w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                </div>
              </Grid>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
