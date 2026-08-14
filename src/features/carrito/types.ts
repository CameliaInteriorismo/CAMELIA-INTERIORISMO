/**
 * Los textos del flujo de carrito, tal y como llegan de Sanity.
 *
 * Todo opcional a propósito. Si alguien vacía un campo en el panel, la
 * pantalla no se queda con un hueco: cae en el texto de reserva que hay
 * junto a cada uso. Eso NO es tener el contenido duplicado —el contenido
 * real vive en Sanity y es el que se pinta—, es que ningún descuido en el
 * panel pueda dejar un botón sin nombre.
 *
 * Lo que no está aquí, y no debe estar: los identificadores de los modos de
 * entrega ("domicilio" / "recogida"), las claves de los campos del
 * formulario y sus validaciones. Eso lo fija el código, porque es lo que se
 * guarda y lo que comprueba Zod.
 */

/** Rótulos de /carrito. */
export type CartCopy = {
  title?: string;
  taxNote?: string;
  quantityLabel?: string;
  notesLabel?: string;
  notesPlaceholder?: string;
  continueLabel?: string;
  emptyText?: string;
  emptyActionLabel?: string;
};

/** Rótulo y texto guía de un campo del formulario de confirmación. */
export type OrderFieldLabels = {
  name?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  province?: string;
};

/** El selector de entrega. Los identificadores internos siguen en código. */
export type DeliveryCopy = {
  title?: string;
  subtitle?: string;
  homeLabel?: string;
  pickupLabel?: string;
};

/** El enlace de "Cómo llegar". Sin destino, se usa el de Maps del estudio. */
export type DirectionsLink = { label?: string; href?: string };

/** Rótulos de /carrito/confirmacion, incluida la recogida en el estudio. */
export type ConfirmationCopy = {
  title?: string;
  orderDataTitle?: string;
  fieldLabels?: OrderFieldLabels;
  delivery?: DeliveryCopy;
  shippingNote?: string;
  submitLabel?: string;
  studioName?: string;
  studioHours?: string;
  studioNote?: string;
  studioDirections?: DirectionsLink;
};
