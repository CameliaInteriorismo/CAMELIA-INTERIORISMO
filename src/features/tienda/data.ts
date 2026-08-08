// Examples given by the brief — the dropdown never hardcodes this list, it
// only exists so the type stays a closed set as real categories get added.
export type ProductCategory =
  | "Iluminación"
  | "Mobiliario"
  | "Decoración"
  | "Textil"
  | "Cerámica"
  | "Arte"
  | "Libros";

// A selectable color/material variant. `image` is optional — a finish
// without its own photo falls back to the product's base image rather
// than showing nothing.
export type Finish = {
  name: string;
  color: string;
  image?: string;
};

// Exactly the three accordion items PRODUCTO TIENDA.png calls for — no
// more, no fewer.
export type ProductDetails = {
  detallesDeLaPieza?: string;
  materialesYMedidas?: string;
  envioYEntrega?: string;
};

export type Product = {
  slug: string;
  name: string;
  category?: ProductCategory;
  price?: number;
  image?: string;
  gallery?: string[];
  finishes?: Finish[];
  // Short teaser shown in the hero column, right under the price.
  description?: string;
  details?: ProductDetails;
};

// Real catalogue is one product (Lámpara Vesta, per Diseño/Shop/ and
// Diseño/PRODUCTO TIENDA.png). The other three are still the unnamed
// "Producto N" placeholders from Diseño/TIENDA.png — no category/price/
// description exist for them yet, so those fields stay unset rather than
// invented. Category filter and sort both read this array directly, so
// adding a real product with a new category is the only change either
// needs.
//
// Lorem ipsum copy below (description + details) is explicitly requested
// as a stand-in by the brief, copying PRODUCTO TIENDA.png's own dummy
// text — swap for real copy once the client provides it. Two of the
// three finishes are placeholder-named ("Acabado 2/3"): the reference
// only labels "Verde bosque" (the other two swatches show as unlabeled
// circles in the reference, visible only on hover/selection there too)
// — real names needed. None of the finishes has its own photo yet (only
// one real product shot exists), so selecting any of them falls back to
// the same base image until real per-finish photos exist.
export const PRODUCTS: Product[] = [
  {
    slug: "lampara-vesta",
    name: "Lámpara Vesta",
    category: "Iluminación",
    price: 520,
    image: "/assets/tienda/Lampara Vesta Shop.jpg",
    finishes: [
      { name: "Verde bosque", color: "#3f5232" },
      { name: "Acabado 2", color: "#a9707a" },
      { name: "Acabado 3", color: "#6b5563" },
    ],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed augue iaculis, blandit diam nec, dignissim eros.",
    details: {
      detallesDeLaPieza:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      materialesYMedidas:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      envioYEntrega:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  },
  { slug: "producto-2", name: "Producto 2" },
  { slug: "producto-3", name: "Producto 3" },
  { slug: "producto-4", name: "Producto 4" },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product): Product[] {
  if (!product.category) return [];
  return PRODUCTS.filter(
    (item) => item.category === product.category && item.slug !== product.slug,
  );
}
