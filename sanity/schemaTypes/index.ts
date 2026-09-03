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

import {
  galleryBlock,
  galleryPair,
  gallerySingle,
  project,
} from "./documents/project";
import { product, productCategory, productFinish } from "./documents/product";
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
  cartPage,
  confirmationPages,
  contactPage,
  deliveryLabels,
  directionsLink,
  emailLabel,
  emailTemplate,
  emailsPage,
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
  "contactPage",
  "projectFormPage",
  "cartPage",
  "confirmationPages",
  "emailsPage",
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
  galleryBlock,
  product,
  productFinish,
  productCategory,
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

  // Correos de los formularios
  emailsPage,
  emailTemplate,
  emailLabel,

  // Globales y páginas
  siteSettings,
  homePage,
  estudioPage,
  metodologiaPage,
  serviciosPage,
  proyectosPage,
  tiendaPage,
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
