import type { SanityImageSource } from "@/sanity/lib/image";

/** Un acabado seleccionable: nombre, muestra de color y foto opcional. */
export type Finish = {
  _key: string;
  name: string;
  color: string;
  image?: SanityImageSource;
};

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
