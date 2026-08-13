import Image from "next/image";
import Link from "next/link";
import { Container, Grid } from "@/components/layout/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { imageProps, type SanityImageSource } from "@/sanity/lib/image";

export type PostCard = {
  _id: string;
  title: string;
  /** Dónde parte el titular. Si está vacío, se pinta en una sola línea. */
  titleLines?: string[];
  slug: string;
  image?: SanityImageSource;
};

export function PostList({ posts }: { posts: PostCard[] }) {
  return (
    <section className="pt-title pb-[100px]">
      <Container>
        {/* One hairline under every row, including the last — matching the
            reference, where the rule closes the list rather than only
            separating entries. */}
        <div className="divide-primary/15 border-primary/15 divide-y border-b">
          {posts.map((post, index) => {
            const image = imageProps(post.image);
            return (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group py-title block"
              >
                <Grid className="items-center">
                  <div className="col-span-12 md:col-span-6">
                    {/* Index reads as a quiet marker, not a heading — hence
                      the muted tone against the title's full vino. */}
                    <p className="font-title text-primary/30 text-2xl">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="font-title text-primary mt-block text-3xl uppercase md:text-4xl">
                      {(post.titleLines?.length
                        ? post.titleLines
                        : [post.title]
                      ).map((line, i) => (
                        <span key={i} className="block">
                          {line}
                        </span>
                      ))}
                    </h2>
                  </div>

                  <div className="mt-block col-span-12 md:col-span-4 md:col-start-9 md:mt-0">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      {image ? (
                        <Image
                          src={image.src}
                          alt={image.alt}
                          aria-hidden={!image.alt}
                          fill
                          placeholder={image.blurDataURL ? "blur" : undefined}
                          blurDataURL={image.blurDataURL}
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                          sizes="(min-width: 768px) 33vw, 100vw"
                        />
                      ) : (
                        <PlaceholderImage
                          aspectRatio="4 / 3"
                          label={`${post.title} — sin foto`}
                          className="w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                  </div>
                </Grid>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
