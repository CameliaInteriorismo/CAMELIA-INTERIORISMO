"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Dropdown } from "@/features/tienda/Dropdown";
import { ProductCard } from "@/features/tienda/ProductCard";
import type { ProductCardData } from "@/features/tienda/types";

type SortOption =
  "destacados" | "recientes" | "precio-asc" | "precio-desc" | "nombre-asc";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Destacados", value: "destacados" },
  { label: "Más recientes", value: "recientes" },
  { label: "Precio: menor a mayor", value: "precio-asc" },
  { label: "Precio: mayor a menor", value: "precio-desc" },
  { label: "Nombre A–Z", value: "nombre-asc" },
];

export function ProductsGrid({
  products: all,
}: {
  products: ProductCardData[];
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption | null>(null);

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
            Nuestros
            <br />
            productos
          </h2>
          <div className="flex items-center gap-4">
            <Dropdown
              label="Tipo de producto"
              options={categoryOptions}
              value={category}
              onChange={setCategory}
            />
            <Dropdown
              label="Ordenar"
              options={SORT_OPTIONS}
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
