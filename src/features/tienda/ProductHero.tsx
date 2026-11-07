"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container, Grid } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { FinishSwatch } from "@/features/tienda/FinishSwatches";
import { ProductInfo } from "@/features/tienda/ProductInfo";
import type { Product, ShopCopy } from "@/features/tienda/types";
import { sinIva } from "@/features/tienda/precio";
import { imageProps } from "@/sanity/lib/image";
import { formatPrice } from "@/utils/formatPrice";
import { useCartStore } from "@/stores/cartStore";

export function ProductHero({
  product,
  copy = {},
}: {
  product: Product;
  copy?: ShopCopy;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [finishIndex, setFinishIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  // Configurador (los árboles): si las medidas llevan altura y decoración, se
  // eligen con dos desplegables, y los extras (las luces) con una casilla.
  // Cada combinación sigue siendo una «medida» con su precio, así el carrito,
  // el correo y Nora la reciben igual que la de un cabecero.
  const todas = product.sizes ?? [];
  const configurador = todas.some((s) => s.altura && s.caras);
  const opciones = todas.filter((s) => !s.extra);
  const alturas = unicos(opciones.map((s) => s.altura));
  const decoraciones = unicos(opciones.map((s) => s.caras));
  const [altura, setAltura] = useState(alturas[0]);
  const [caras, setCaras] = useState(decoraciones[0]);
  const [conExtra, setConExtra] = useState(false);

  const finish = product.finishes?.[finishIndex];
  // Con medidas, el precio es el de la medida elegida (la primera al entrar).
  const size = configurador
    ? opciones.find((s) => s.altura === altura && s.caras === caras)
    : product.sizes?.[sizeIndex];
  const extra = configurador
    ? todas.find((s) => s.extra && s.altura === altura)
    : undefined;
  const sumaExtra = conExtra && extra?.price != null ? extra.price : 0;
  const base = size ? size.price : product.price;
  const price = base != null ? base + sumaExtra : undefined;
  // Un acabado sin foto propia mantiene la imagen base de la pieza.
  const activeImage = imageProps(finish?.images?.[0] ?? product.image);

  /** «245 € + IVA» en los servicios; «245 €» en lo demás. */
  function importe(conIva: number) {
    return product.priceWithoutVat
      ? `${formatPrice(sinIva(conIva))} + IVA`
      : formatPrice(conIva);
  }

  function handleAddToCart() {
    addItem({
      // Una línea por combinación: el mismo cabecero en dos medidas o en dos
      // acabados son dos líneas, no una con la cantidad sumada.
      id: [product.slug, finish?.name, size?.name].filter(Boolean).join("|"),
      productId: product.slug,
      slug: product.slug,
      title: product.name,
      finish: finish?.name,
      size: size?.name,
      image: activeImage?.src,
      quantity,
    });
    // El extra (las luces) en su propia línea: se presupuesta y se factura
    // aparte, y en Nora es otro artículo.
    if (conExtra && extra) {
      addItem({
        id: [product.slug, extra.name].join("|"),
        productId: product.slug,
        slug: product.slug,
        title: product.name,
        size: extra.name,
        image: activeImage?.src,
        quantity,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <section className="pt-section">
      <Container>
        {/* `items-stretch` para que la foto llegue justo hasta donde llega la
            columna de al lado. */}
        <Grid className="lg:items-stretch">
          <div className="col-span-12 lg:col-span-6">
            {/* El alto de la foto lo marca la columna de información, no una
                proporción elegida a mano. Antes era un 17/25 ajustado a ojo
                para que cuadrase con los desplegables cerrados: cualquier
                cambio de precio, descripción, número de acabados o de textos
                en Sanity lo descuadraba, y al abrir un desplegable la foto se
                quedaba corta.

                Ahora sigue al acordeón: cerrado queda compacta, al abrir crece
                con él y al cerrar vuelve. El crecimiento no necesita animación
                propia —el desplegable ya anima su alto, y la fila de la
                rejilla lo sigue fotograma a fotograma—. `object-cover` recorta,
                nunca deforma. En móvil, apiladas, conserva su 17/25. */}
            <div className="relative aspect-[17/25] w-full overflow-hidden lg:aspect-auto lg:h-full">
              {activeImage ? (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeImage.src}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeImage.src}
                      alt={activeImage.alt || product.name}
                      fill
                      priority
                      placeholder={activeImage.blurDataURL ? "blur" : undefined}
                      blurDataURL={activeImage.blurDataURL}
                      className="object-cover"
                      style={{ objectPosition: activeImage.objectPosition }}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <PlaceholderImage
                  aspectRatio="17 / 25"
                  label={`${product.name} — sin foto`}
                  className="w-full lg:h-full"
                />
              )}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            {product.category && (
              <p className="text-primary text-sm tracking-wide uppercase">
                {product.category}
              </p>
            )}
            <h1 className="font-title text-primary mt-1 text-3xl md:text-4xl">
              {product.name}
            </h1>

            {product.notice && (
              <p className="text-secondary mt-sm text-xs tracking-wide uppercase">
                {product.notice}
              </p>
            )}

            {price != null && (
              <div className="mt-sm">
                {product.priceWithoutVat ? (
                  <>
                    {/* A un particular hay que enseñarle el precio final: el
                        total con IVA va siempre, justo debajo. */}
                    <p className="text-primary text-xl">{importe(price)}</p>
                    <p className="text-primary text-xs italic">
                      {formatPrice(price)} IVA incluido
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-primary text-xl">{price} €</p>
                    <p className="text-primary text-xs italic">
                      {copy.taxNote ?? "IVA incluido"}
                    </p>
                  </>
                )}
              </div>
            )}

            {product.description && (
              <p className="text-primary mt-sm text-sm leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Desplegable y no una fila de botones: los nombres son largos
                («Cama de 150 · 170 × 120 cm») y cinco botones apilados
                alargaban la columna, y con ella la foto, que al seguir su
                alto se recortaba hasta dejar el cabecero cortado. */}
            {configurador && (
              <div className="mt-sm space-y-4">
                <Desplegable
                  id="altura"
                  etiqueta="Altura"
                  valor={altura}
                  opciones={alturas}
                  onChange={setAltura}
                />
                <Desplegable
                  id="decoracion"
                  etiqueta="Decoración"
                  valor={caras}
                  opciones={decoraciones}
                  onChange={setCaras}
                />
                {product.optionsNote && (
                  <p className="text-primary max-w-[24rem] text-xs leading-relaxed">
                    {product.optionsNote}
                  </p>
                )}
                {extra && (
                  <label className="text-primary flex max-w-[24rem] cursor-pointer items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={conExtra}
                      onChange={(event) => setConExtra(event.target.checked)}
                      className="accent-primary mt-0.5 h-4 w-4 shrink-0"
                    />
                    <span>
                      Añadir {extra.name.charAt(0).toLowerCase() + extra.name.slice(1)}
                      {extra.price != null && (
                        <span className="text-primary/80">
                          {" "}
                          · {importe(extra.price)}
                        </span>
                      )}
                    </span>
                  </label>
                )}
              </div>
            )}

            {!configurador && product.sizes && product.sizes.length > 0 && (
              <div className="mt-sm">
                <label
                  htmlFor="medida"
                  className="text-primary mb-2 block text-sm"
                >
                  Medida
                </label>
                <select
                  id="medida"
                  value={sizeIndex}
                  onChange={(event) => setSizeIndex(Number(event.target.value))}
                  className="border-primary/30 text-primary bg-background h-11 w-full max-w-[24rem] border px-4 text-sm"
                >
                  {product.sizes.map((s, index) => (
                    <option key={s._key ?? s.name} value={index}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Circle left, name to its right, one row per finish —
                never name-under-circle (see FinishSwatches' row layout,
                used as-is here too, just stacked instead of side by side). */}
            {product.finishes && product.finishes.length > 0 && (
              <div className="mt-sm space-y-4">
                {product.finishes.map((f, index) => (
                  <div key={f.name} className="flex items-center gap-3">
                    <FinishSwatch
                      finish={f}
                      active={index === finishIndex}
                      onSelect={() => setFinishIndex(index)}
                      size="h-4 w-4"
                    />
                    <span
                      onClick={() => setFinishIndex(index)}
                      className="text-primary cursor-pointer text-sm"
                    >
                      {f.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-block flex items-center gap-4">
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <Button onClick={handleAddToCart} className="flex-1">
                {added
                  ? (copy.addedLabel ?? "AÑADIDO")
                  : (copy.addToCartLabel ?? "AÑADIR AL CARRITO")}
              </Button>
            </div>

            <ProductInfo product={product} copy={copy} />
          </div>
        </Grid>
      </Container>
    </section>
  );
}

/** Los valores distintos, en el orden en que salen en Sanity. */
function unicos(valores: (string | undefined)[]): string[] {
  return [...new Set(valores.filter((v): v is string => Boolean(v)))];
}

/** Un desplegable del configurador, con el mismo aspecto que el de «Medida». */
function Desplegable({
  id,
  etiqueta,
  valor,
  opciones,
  onChange,
}: {
  id: string;
  etiqueta: string;
  valor?: string;
  opciones: string[];
  onChange: (valor: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-primary mb-2 block text-sm">
        {etiqueta}
      </label>
      <select
        id={id}
        value={valor}
        onChange={(event) => onChange(event.target.value)}
        className="border-primary/30 text-primary bg-background h-11 w-full max-w-[24rem] border px-4 text-sm"
      >
        {opciones.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
