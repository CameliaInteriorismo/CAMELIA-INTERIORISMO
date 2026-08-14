"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Dropdown } from "@/features/tienda/Dropdown";
import { ProductCard } from "@/features/tienda/ProductCard";
import { Multiline } from "@/features/shared/MultilineText";
import type { ProductCardData, ShopCopy } from "@/features/tienda/types";

type SortOption =
  "destacados" | "recientes" | "precio-asc" | "precio-desc" | "nombre-asc";

// El criterio de cada opción lo decide el código; de Sanity viene solo su
// texto. Estos son los de reserva, por si alguien vacía uno en el panel.
const SORT_FALLBACKS: Record<SortOption, string> = {
  destacados: "Destacados",
  recientes: "Más recientes",
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
  "nombre-asc": "Nombre A–Z",
};

const SORT_ORDER: SortOption[] = [
  "destacados",
  "recientes",
  "precio-asc",
  "precio-desc",
  "nombre-asc",
];

export function ProductsGrid({
  products: all,
  copy = {},
}: {
  products: ProductCardData[];
  copy?: ShopCopy;
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption | null>(null);

  const sortOptions = SORT_ORDER.map((value) => ({
    value,
    label:
      copy.sortOptions?.[
        value.replace(/-(.)/g, (_, c: string) =>
          c.toUpperCase(),
        ) as keyof NonNullable<ShopCopy["sortOptions"]>
      ] ?? SORT_FALLBACKS[value],
  }));

  // Options come from whatever categories the products actually carry —
  // never a hardcoded list — so this grows on its own as real products
  // (eventually from the CMS) are added.
  const categoryOptions = useMemo(() => {
    const seen = new Set<string>();
    return all
      .filter((product) => {
        if (!product.category || seen.has(product.category)) return false;
        seen.add(product.category);
        return true;
      })
      .map((product) => ({
        label: product.category as string,
        value: product.category as string,
      }));
  }, [all]);

  const products = useMemo(() => {
    let list = category
      ? all.filter((product) => product.category === category)
      : all;

    switch (sort) {
      case "recientes":
        // Se mantiene el criterio anterior: el orden inverso al del listado.
        // No se usa la fecha de creación de Sanity porque la migración creó
        // todas las piezas a la vez y ordenar por ella sería arbitrario.
        list = [...list].reverse();
        break;
      case "precio-asc":
        list = [...list].sort(
          (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
        );
        break;
      case "precio-desc":
        list = [...list].sort(
          (a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity),
        );
        break;
      case "nombre-asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name, "es"));
        break;
      default:
        break;
    }
    return list;
  }, [all, category, sort]);

  return (
    <section className="pt-[100px] pb-[100px]">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
            <Multiline text={copy.gridTitle ?? "Nuestros\nproductos"} />
          </h2>
          <div className="flex items-center gap-4">
            <Dropdown
              label={copy.filterLabel ?? "Tipo de producto"}
              options={categoryOptions}
              value={category}
              onChange={setCategory}
            />
            <Dropdown
              label={copy.sortLabel ?? "Ordenar"}
              options={sortOptions}
              value={sort}
              onChange={(v) => setSort(v as SortOption | null)}
            />
          </div>
        </div>

        <div className="mt-title grid grid-cols-1 gap-8 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
