import type { SchemaTypeDefinition } from "sanity";

import { seo } from "./objects/seo";
import {
  ctaBanner,
  ctaBannerPlain,
  imageWithAlt,
  link,
  paragraphs,
  richText,
} from "./objects/shared";

import { galleryPair, gallerySingle, project } from "./documents/project";
import { product, productCategory, productFinish } from "./documents/product";
import { post } from "./documents/post";
import { service } from "./documents/service";
import { partner, testimonial } from "./documents/misc";
import {
  legalDetails,
  legalDocument,
  legalLines,
  legalList,
  legalSection,
  legalSubsection,
  legalText,
} from "./documents/legalDocument";

import { siteSettings } from "./singletons/siteSettings";
import {
  aboutBlock,
  blogPage,
  cartPage,
  confirmationPages,
  contactPage,
  deliveryLabels,
  directionsLink,
  estudioPage,
  formStep,
  homePage,
  metodologiaPage,
  orderFieldLabels,
  productDetailLabels,
  projectFormPage,
  proyectosPage,
  serviciosPage,
  sortOptionLabels,
  thanksScreen,
  tiendaPage,
} from "./singletons/pages";

/**
 * Los documentos que existen una sola vez. La estructura del panel (ver
 * sanity/structure.ts) los abre directamente y les oculta el botón de
 * "crear nuevo", que en un singleton no tiene sentido.
 */
export const SINGLETON_TYPES = [
  "siteSettings",
  "homePage",
  "estudioPage",
  "metodologiaPage",
  "serviciosPage",
  "proyectosPage",
  "tiendaPage",
  "blogPage",
  "contactPage",
  "projectFormPage",
  "cartPage",
  "confirmationPages",
] as const;

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objetos reutilizables
  seo,
  imageWithAlt,
  link,
  ctaBanner,
  ctaBannerPlain,
  richText,
  paragraphs,

  // Colecciones
  project,
  gallerySingle,
  galleryPair,
  product,
  productFinish,
  productCategory,
  post,
  service,
  testimonial,
  partner,

  // Legales
  legalDocument,
  legalSection,
  legalText,
  legalList,
  legalDetails,
  legalLines,
  legalSubsection,

  // Globales y páginas
  siteSettings,
  homePage,
  estudioPage,
  metodologiaPage,
  serviciosPage,
  proyectosPage,
  tiendaPage,
  blogPage,
  contactPage,
  projectFormPage,
  formStep,
  aboutBlock,
  cartPage,
  confirmationPages,
  thanksScreen,
  directionsLink,
  orderFieldLabels,
  deliveryLabels,
  productDetailLabels,
  sortOptionLabels,
];
