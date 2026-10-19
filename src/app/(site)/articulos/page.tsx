import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { ArticlesGrid, type ArticleCard } from "@/features/articulos/Articles";
import { CtaBanner } from "@/features/proyectos/CtaBanner";
import type { CtaBannerData } from "@/features/shared/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ARTICLES_QUERY, PROYECTOS_PAGE_QUERY } from "@/sanity/lib/queries";
import { metadataFrom } from "@/sanity/lib/seo";

export const revalidate = 3600;

/**
 * El título y la entradilla van aquí y no en el panel: el listado no tiene
 * más texto que este, y lo que cambia cada mes son los artículos.
 */
const TITULO = "Artículos";
const ENTRADILLA =
  "Lo que nos preguntáis en la primera reunión, contado con datos de nuestras obras: precios, plazos, licencias y proyectos explicados paso a paso.";

export async function generateMetadata(): Promise<Metadata> {
  return await metadataFrom(
    undefined,
    {
      title: "Artículos de interiorismo y reforma",
      description: ENTRADILLA,
    },
    "/articulos",
  );
}

export default async function ArticulosPage() {
  const [articles, page] = await Promise.all([
    sanityFetch<ArticleCard[]>({ query: ARTICLES_QUERY, tags: ["article"] }),
    sanityFetch<{ cta?: CtaBannerData } | null>({
      query: PROYECTOS_PAGE_QUERY,
      tags: ["proyectosPage"],
    }),
  ]);

  return (
    <>
      {/* Sin foto de cabecera: el listado empieza como una página de texto,
          igual que los legales. */}
      <section className="pt-section">
        <Container>
          <h1 className="font-title text-primary text-4xl md:text-5xl">
            {TITULO}
          </h1>
          <p className="text-primary mt-content max-w-[40rem] text-sm leading-relaxed">
            {ENTRADILLA}
          </p>
        </Container>
      </section>
      {articles.length > 0 ? (
        <ArticlesGrid articles={articles} />
      ) : (
        <section className="pt-section">
          <Container>
            <p className="text-primary text-sm">Muy pronto, el primero.</p>
          </Container>
        </section>
      )}
      <CtaBanner cta={page?.cta} />
    </>
  );
}
