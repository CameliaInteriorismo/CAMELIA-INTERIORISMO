import type { SanityImageSource } from "@/sanity/lib/image";

/**
 * Un acabado seleccionable: nombre, muestra de color y sus fotos.
 *
 * `images` puede traer varias. La ficha de hoy enseña solo la primera —el
 * diseño tiene un único recuadro—, pero las demás se guardan asociadas a
 * este acabado y no a una galería suelta del producto, que es lo que hace
 * que nunca se pierda de vista a qué acabado retrata cada foto.
 */
export type Finish = {
  _key: string;
  name: string;
  color: string;
  images?: SanityImageSource[];
};

/** La foto que representa a un acabado: la primera de su lista. */
export function finishImage(finish?: Finish): SanityImageSource | undefined {
  return finish?.images?.[0];
}

/** Lo que necesita una tarjeta del listado. */
export type ProductCardData = {
  _id: string;
  name: string;
  slug: string;
  price?: number;
  category?: string;
  image?: SanityImageSource;
  finishes?: Finish[];
};

/** Los tres desplegables de la ficha. El vacío no se muestra. */
export type ProductDetails = {
  detallesDeLaPieza?: string;
  materialesYMedidas?: string;
  envioYEntrega?: string;
};

/** La ficha completa. */
export type Product = ProductCardData & {
  description?: string;
  gallery?: SanityImageSource[];
  details?: ProductDetails;
  related?: ProductCardData[];
};

/** Los rótulos del Shop, todos desde Sanity y todos opcionales. */
export type ShopCopy = {
  gridTitle?: string;
  filterLabel?: string;
  sortLabel?: string;
  sortOptions?: {
    destacados?: string;
    recientes?: string;
    precioAsc?: string;
    precioDesc?: string;
    nombreAsc?: string;
  };
  taxNote?: string;
  addToCartLabel?: string;
  addedLabel?: string;
  relatedTitle?: string;
  detailLabels?: Partial<Record<keyof ProductDetails, string>>;
};
