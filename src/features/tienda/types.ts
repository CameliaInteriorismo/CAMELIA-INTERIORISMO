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

/** Una medida con su precio (cabeceros por ancho de cama, por ejemplo). */
export type Size = {
  _key: string;
  name: string;
  price?: number;
  /** Configurador (árboles): con altura y caras salen dos desplegables. */
  altura?: string;
  caras?: string;
  /** Un añadido con casilla (las luces): va en su propia línea. */
  extra?: boolean;
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
  /** Con medidas, el precio de la tarjeta es un «Desde». */
  hasSizes?: boolean;
  /** Servicios (árboles): el precio se enseña sin IVA, con el total al lado. */
  priceWithoutVat?: boolean;
  /** Lo más caro que se puede pedir en la ficha, extras incluidos. */
  priceMax?: number;
  /** Etiqueta encima de la foto («Unidades limitadas · Por tiempo limitado»). */
  badge?: string;
  /** Las trae el carrito para poner a cada línea el precio de su medida. */
  sizes?: Size[];
};

/** Los tres desplegables de la ficha. El vacío no se muestra. */
export type ProductDetails = {
  detallesDeLaPieza?: string;
  materialesYMedidas?: string;
  envioYEntrega?: string;
};

/** La ficha completa. */
export type Product = ProductCardData & {
  /** Ya viajaba en la consulta; faltaba declararlo para el schema Product. */
  available?: boolean;
  description?: string;
  /** Línea encima del precio («Reservas hasta el 25 de noviembre…»). */
  notice?: string;
  /** Debajo de los desplegables del configurador. */
  optionsNote?: string;
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
