import type { ProductCardData } from "@/features/tienda/types";

/** IVA de lo que se enseña «+ IVA» (los árboles de Navidad). */
export const IVA = 0.21;

/** El precio sin IVA a partir del de Sanity, que siempre va con IVA. */
export function sinIva(conIva: number): number {
  return Math.round((conIva / (1 + IVA)) * 100) / 100;
}

/**
 * El precio de una unidad tal como se eligió: el de su medida si la pieza
 * tiene medidas, el de la pieza si no.
 *
 * Si la línea lleva una medida que ya no está en Sanity (se renombró o se
 * quitó después de añadirla al carrito), no hay precio: enseñar el de la
 * pieza daría un importe que no corresponde a lo que la persona eligió.
 *
 * `!= null` y no `!== undefined`: la consulta devuelve `null` en los campos
 * vacíos, y un `null` colado acabaría pintado como «null €».
 */
export function precioUnitario(
  product: Pick<ProductCardData, "price" | "sizes"> | undefined,
  size?: string,
): number | undefined {
  if (!product) return undefined;
  if (size && product.sizes && product.sizes.length > 0) {
    const medida = product.sizes.find((s) => s.name === size);
    return medida?.price != null ? medida.price : undefined;
  }
  return product.price != null ? product.price : undefined;
}
