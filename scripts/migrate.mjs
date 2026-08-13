/**
 * Vuelca a Sanity el contenido que hoy vive en el código.
 *
 *   npm run sanity:migrate           copia el contenido
 *   npm run sanity:migrate -- --dry  enseña lo que haría, sin escribir nada
 *
 * Es una COPIA, no una mudanza: no toca ni un fichero del proyecto. Los
 * data.ts siguen donde están y la web los sigue leyendo hasta que se conecte
 * el frontend, que es un paso posterior y separado.
 *
 * Se puede ejecutar tantas veces como haga falta. Cada documento lleva un _id
 * fijo derivado de su contenido ("project.ermita"), así que repetir la
 * migración sobrescribe lo mismo en vez de duplicarlo. Las imágenes se suben
 * una sola vez: Sanity las deduplica por hash del fichero.
 *
 * Las constantes de contenido se leen de content-backup/, no de los
 * componentes: al conectar cada página a Sanity, su constante desaparece del
 * componente. El backup es la única fuente estable, y por eso NO se borra.
 *
 * El token sale del entorno. Nunca está en el código, y esto solo corre en tu
 * máquina — no forma parte de la web desplegada.
 */

import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const DRY = process.argv.includes("--dry");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Faltan variables de entorno. Necesito NEXT_PUBLIC_SANITY_PROJECT_ID,\n" +
      "NEXT_PUBLIC_SANITY_DATASET y SANITY_API_WRITE_TOKEN en .env.local.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-08-12",
  useCdn: false,
});

// ------------------------------------------------- lectura de los data.ts

/**
 * Extrae un literal exportado de un fichero .ts/.tsx.
 *
 * Se hace así, y no con un `import`, porque Node no ejecuta TypeScript y los
 * componentes arrastran React, next/image y framer-motion, que no se pueden
 * cargar fuera del navegador. El literal se recorta contando llaves —
 * saltando comillas y escapes para no cortar dentro de un texto— y se evalúa
 * como expresión JavaScript, que es exactamente lo que es: datos, sin lógica.
 *
 * `scope` inyecta las constantes auxiliares que el literal referencia (`DIR`
 * en el blog, `SLOT` en los logos), porque si no la evaluación falla.
 */
function literal(source, declaration, scope = {}) {
  const start = source.indexOf(declaration);
  if (start === -1) return undefined;
  // Se busca el "=" y solo después el corchete: si no, una anotación de tipo
  // como `PARTNERS: { name: string }[] = [...]` haría que se recortase el
  // tipo en vez del valor.
  const after = source.slice(start);
  const assign = after.match(/=\s*[[{]/);
  if (!assign) return undefined;
  const openIdx = start + assign.index + assign[0].length - 1;
  const open = source[openIdx];
  const close = open === "[" ? "]" : "}";

  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = openIdx; i < source.length; i++) {
    const c = source[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (c === "\\") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (c === quote) quote = null;
      continue;
    }
    // Los comentarios se saltan enteros. Sin esto, un apóstrofo dentro de un
    // comentario ("// Maora's logo") abre una comilla que nunca cierra y el
    // recorte se come el resto del fichero.
    if (c === "/" && source[i + 1] === "/") {
      i = source.indexOf("\n", i);
      if (i === -1) break;
      continue;
    }
    if (c === "/" && source[i + 1] === "*") {
      i = source.indexOf("*/", i) + 1;
      if (i === 0) break;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c;
      continue;
    }
    if (c === open) depth++;
    else if (c === close && --depth === 0) {
      const body = source.slice(openIdx, i + 1);
      const keys = Object.keys(scope);
      return new Function(...keys, `return (${body})`)(
        ...keys.map((k) => scope[k]),
      );
    }
  }
  return undefined;
}

const cache = new Map();
async function read(relPath) {
  if (!cache.has(relPath)) {
    cache.set(relPath, await readFile(path.join(ROOT, relPath), "utf8"));
  }
  return cache.get(relPath);
}

/**
 * Todas las constantes de texto sueltas del fichero, para inyectarlas en la
 * evaluación. Varios data.ts componen rutas con plantillas (`${DIR}/foto.jpg`)
 * y sin esto la evaluación falla con "DIR is not defined".
 */
function stringScope(source) {
  const scope = {};
  for (const m of source.matchAll(/^const (\w+)\s*=\s*"([^"]*)";/gm)) {
    scope[m[1]] = m[2];
  }
  return scope;
}

async function grab(relPath, declaration, extra) {
  const source = await read(relPath);
  const scope = { ...stringScope(source), ...extra };
  const value = literal(source, declaration, scope);
  if (value === undefined) {
    warnings.push(`No pude leer ${declaration} de ${relPath}`);
  }
  return value;
}

// ------------------------------------------------------------- imágenes

const uploaded = new Map();
const missingImages = new Set();
const warnings = [];
let uploadCount = 0;
let reusedCount = 0;

/**
 * Assets que ya están en Sanity, indexados por nombre de fichero.
 *
 * Sin esto cada reintento vuelve a subir las 60 imágenes: Sanity las
 * deduplica por hash y no se duplican, pero la subida se hace igual y una
 * migración de varios minutos acaba cayéndose por un ECONNRESET. Con el
 * índice, repetir la migración es cuestión de segundos.
 */
const existingAssets = new Map();
if (!DRY) {
  const assets = await client.fetch(
    `*[_type == "sanity.imageAsset"]{ _id, originalFilename }`,
  );
  for (const a of assets) {
    if (a.originalFilename) existingAssets.set(a.originalFilename, a._id);
  }
  console.log(`Imágenes ya en Sanity: ${existingAssets.size}\n`);
}

/** Reintenta una subida: la red falla más que el servidor. */
async function withRetry(fn, label, attempts = 3) {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i >= attempts) throw error;
      warnings.push(`Reintento ${i} en ${label}: ${error.message}`);
      await new Promise((r) => setTimeout(r, 1000 * i));
    }
  }
}

/**
 * Sube un fichero de public/ y devuelve la referencia lista para el
 * documento. Devuelve null si no existe, en vez de reventar: hay huecos de
 * imagen que la web deja a propósito sin foto y cae en un placeholder.
 */
async function img(publicPath, alt) {
  if (!publicPath) return null;
  if (!uploaded.has(publicPath)) {
    const abs = path.join(
      PUBLIC,
      decodeURIComponent(publicPath).replace(/^\//, ""),
    );
    if (!existsSync(abs)) {
      missingImages.add(publicPath);
      return null;
    }
    const filename = path.basename(abs);
    if (DRY) {
      uploaded.set(publicPath, "image-DRY");
      uploadCount++;
    } else if (existingAssets.has(filename)) {
      uploaded.set(publicPath, existingAssets.get(filename));
      reusedCount++;
    } else {
      const asset = await withRetry(
        async () =>
          client.assets.upload("image", await readFile(abs), { filename }),
        filename,
      );
      uploaded.set(publicPath, asset._id);
      existingAssets.set(filename, asset._id);
      process.stdout.write(".");
      uploadCount++;
    }
  }
  return {
    _type: "imageWithAlt",
    asset: { _type: "reference", _ref: uploaded.get(publicPath) },
    alt: alt || "-",
  };
}

// ------------------------------------------------------------ utilidades

const docs = [];
const push = (doc) => (docs.push(doc), doc);
const ref = (id) => ({ _type: "reference", _ref: id });
const kref = (id, i) => ({ _type: "reference", _ref: id, _key: `r${i}` });
const keyed = (items, prefix = "k") =>
  items.filter(Boolean).map((item, i) => ({ _key: `${prefix}${i}`, ...item }));
const slugOf = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const slug = (current) => ({ _type: "slug", current });

// =========================================================== construcción

console.log(
  DRY
    ? "SIMULACRO — no se escribe nada en Sanity\n"
    : `Migrando a ${projectId}/${dataset}\n`,
);

// --- Servicios (primero: los proyectos y las páginas los referencian) ----
const serviceTabs =
  (await grab("content-backup/home_ServiceTabs.tsx", "const SERVICE_TABS")) ??
  [];
const phases =
  (await grab("content-backup/servicios_ProjectPhases.tsx", "const PHASES")) ??
  [];

const serviceIdByTitle = new Map();
for (const [i, tab] of serviceTabs.entries()) {
  const title = tab.label;
  const id = `service-${slugOf(title)}`;
  serviceIdByTitle.set(title, id);
  const phase = phases.find((p) => p.title === title);
  push({
    _id: id,
    _type: "service",
    title,
    slug: slug(slugOf(title)),
    shortDescription: tab.caption,
    longDescription: phase?.body,
    image: await img(tab.image, title),
    order: (i + 1) * 10,
  });
}

// --- Proyectos ------------------------------------------------------------
const details =
  (await grab("src/features/proyecto-detalle/data.ts", "PROJECT_DETAILS")) ??
  {};
// Desde el backup, no del componente: ProjectsGrid ya lee de Sanity y su
// constante PROJECTS ha desaparecido. content-backup/ conserva el original,
// que es justo para lo que se hizo — así la migración se puede repetir aunque
// el frontend ya esté conectado.
const gridProjects =
  (await grab("content-backup/proyectos_ProjectsGrid.tsx", "const PROJECTS")) ??
  [];

let projectOrder = 0;
for (const card of gridProjects) {
  const d = details[card.slug] ?? {};
  projectOrder += 10;

  // Las seis posiciones de la galería, tal cual estaban en el código: son
  // huecos del diseño, así que se copian una a una y las que no tienen foto
  // se quedan vacías conservando su sitio en la ficha.
  const g = d.gallery ?? {};
  const gallery = {
    _type: "object",
    imageA: await img(g.imageA, d.name),
    pair1Left: await img(g.pair1?.[0], d.name),
    pair1Right: await img(g.pair1?.[1], d.name),
    imageB: await img(g.imageB, d.name),
    pair2Left: await img(g.pair2?.[0], d.name),
    pair2Right: await img(g.pair2?.[1], d.name),
  };

  push({
    _id: `project-${card.slug}`,
    _type: "project",
    // El listado escribía el nombre en mayúsculas y la ficha en normal.
    // Se guarda en normal: la mayúscula del listado la pone el CSS.
    name: d.name ?? card.name,
    slug: slug(card.slug),
    year: d.year,
    location: d.location,
    province: d.province,
    services: (d.services ?? [])
      .map((s, i) => {
        const id = serviceIdByTitle.get(s);
        if (!id) warnings.push(`Servicio sin documento: "${s}" (${card.slug})`);
        return id ? kref(id, i) : null;
      })
      .filter(Boolean),
    paragraphs: d.paragraphs,
    cardImage: await img(card.image, d.name ?? card.name),
    heroVideo: d.heroVideo,
    heroImage: await img(d.heroImage, d.name),
    gallery,
    featured: projectOrder <= 30,
    order: projectOrder,
  });
}

// --- Productos ------------------------------------------------------------
const products = (await grab("src/features/tienda/data.ts", "PRODUCTS")) ?? [];
const categoryIds = new Map();
for (const p of products) {
  if (p.category && !categoryIds.has(p.category)) {
    const id = `productCategory-${slugOf(p.category)}`;
    categoryIds.set(p.category, id);
    push({
      _id: id,
      _type: "productCategory",
      title: p.category,
      order: categoryIds.size * 10,
    });
  }
}
for (const [i, p] of products.entries()) {
  const finishes = [];
  for (const f of p.finishes ?? []) {
    finishes.push({
      _type: "productFinish",
      name: f.name,
      color: f.color,
      image: await img(f.image, f.name),
    });
  }
  const gallery = [];
  for (const src of p.gallery ?? []) gallery.push(await img(src, p.name));

  push({
    _id: `product-${p.slug}`,
    _type: "product",
    name: p.name,
    slug: slug(p.slug),
    category: p.category ? ref(categoryIds.get(p.category)) : undefined,
    price: p.price,
    available: true,
    description: p.description,
    image: await img(p.image, p.name),
    gallery: keyed(gallery.filter(Boolean), "pg"),
    finishes: keyed(finishes, "f"),
    details: p.details ? { _type: "object", ...p.details } : undefined,
    order: (i + 1) * 10,
  });
}

// --- Blog -----------------------------------------------------------------
const posts =
  (await grab("src/features/blog/data.ts", "BLOG_POSTS", {
    DIR: "/assets/blog",
  })) ?? [];

/** Párrafos planos → bloques de Portable Text. */
const toBlocks = (paragraphs, prefix) =>
  paragraphs.map((text, i) => ({
    _key: `${prefix}${i}`,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{ _key: `${prefix}${i}s`, _type: "span", text, marks: [] }],
  }));

for (const [i, post] of posts.entries()) {
  const body = [];
  for (const [j, block] of (post.body ?? []).entries()) {
    if (block.type === "text") {
      body.push(...toBlocks(block.paragraphs, `b${j}_`));
    } else if (block.type === "imagePair") {
      body.push({
        _key: `b${j}`,
        _type: "galleryPair",
        left: await img(block.images[0], post.title),
        right: await img(block.images[1], post.title),
      });
    }
  }
  push({
    _id: `post-${post.slug}`,
    _type: "post",
    title: post.title,
    slug: slug(post.slug),
    titleLines: post.titleLines,
    subtitle: post.subtitle,
    // No hay fecha en el código. Se reparten hacia atrás desde hoy para que
    // el orden del listado coincida con el actual; ajústalas en el panel.
    publishedAt: new Date(Date.now() - i * 86400000 * 30).toISOString(),
    body,
    image: await img(post.image, post.title),
    leadImage: await img(post.leadImage, post.title),
  });
}

// --- Testimonios y marcas -------------------------------------------------
const testimonials =
  (await grab("content-backup/home_Testimonials.tsx", "const TESTIMONIALS")) ??
  [];
for (const [i, t] of testimonials.entries()) {
  push({
    _id: `testimonial-${slugOf(t.name ?? t.author ?? `t${i}`)}`,
    _type: "testimonial",
    quote: t.quote,
    author: t.name ?? t.author,
    source: t.source,
    rating: t.rating ?? 5,
    order: (i + 1) * 10,
  });
}

const partners =
  (await grab("content-backup/home_PartnerLogos.tsx", "const PARTNERS", {
    SLOT: "h-10 w-[140px] md:h-12 md:w-[170px]",
  })) ?? [];
for (const [i, p] of partners.entries()) {
  push({
    _id: `partner-${slugOf(p.name)}`,
    _type: "partner",
    name: p.name,
    logo: await img(p.src, p.name),
    size: p.slot ? "wide" : "normal",
    order: (i + 1) * 10,
  });
}

// --- Ajustes globales -----------------------------------------------------
const contactSrc = await read("src/features/contacto/data.ts");
/** Constantes de texto sueltas que el literal de CONTACT referencia. */
const stringConst = (src, name) =>
  src.match(new RegExp(`const ${name}\\s*=\\s*"([^"]*)"`))?.[1];
const CONTACT =
  literal(contactSrc, "export const CONTACT", {
    STREET: stringConst(contactSrc, "STREET"),
    FLOOR: stringConst(contactSrc, "FLOOR"),
    LOCALITY: stringConst(contactSrc, "LOCALITY"),
  }) ?? {};
const SOCIAL_URLS = literal(contactSrc, "export const SOCIAL_URLS") ?? {};
const [street, floor, locality] = CONTACT.addressLines ?? [];

// Las rutas de los iconos se leen de SOCIALS/SOCIALS_MENU, no se componen a
// partir del nombre: el de Instagram se llama "ins.png" en el pie y
// "instagram.png" en el menú, así que adivinarlas fallaría.
const SOCIALS = literal(contactSrc, "export const SOCIALS") ?? [];
const SOCIALS_MENU = literal(contactSrc, "export const SOCIALS_MENU") ?? [];
const socials = [];
for (const [label, url] of Object.entries(SOCIAL_URLS)) {
  socials.push({
    _type: "social",
    label,
    url: url ?? undefined,
    icon:
      (await img(SOCIALS.find((s) => s.label === label)?.src, label)) ??
      undefined,
    iconMenu:
      (await img(SOCIALS_MENU.find((s) => s.label === label)?.src, label)) ??
      undefined,
  });
}

push({
  _id: "siteSettings",
  _type: "siteSettings",
  siteName: "Camelia",
  email: CONTACT.email,
  phone: CONTACT.phone,
  phoneHref: CONTACT.phoneHref,
  addressStreet: street,
  addressFloor: floor,
  addressLocality: locality,
  // Tres líneas, como en el pie.
  openingHours: ["Lunes a viernes:", "9:00h - 13:30h", "16:00h - 19:00h"],
  navLinks: keyed(
    [
      ["Inicio", "/"],
      ["Estudio", "/estudio"],
      ["Metodología", "/metodologia"],
      ["Servicios", "/servicios"],
      ["Proyectos", "/proyectos"],
      ["Shop", "/tienda"],
      ["Blog", "/blog"],
      ["Contacto", "/contacto"],
    ].map(([label, href]) => ({ _type: "link", label, href })),
    "n",
  ),
  headerCta: {
    _type: "link",
    label: "CUÉNTANOS TU PROYECTO",
    href: "/cuentanos-tu-proyecto",
  },
  footerLegalLinks: keyed(
    [
      ["Aviso Legal", "/aviso-legal"],
      ["Política de Privacidad", "/politica-de-privacidad"],
      ["Política de Cookies", "/politica-de-cookies"],
      ["Configuración de Cookies", "#cookies"],
      ["Accesibilidad", "/accesibilidad"],
    ].map(([label, href]) => ({ _type: "link", label, href })),
    "l",
  ),
  socials: keyed(socials, "s"),
  // Las columnas del pie tal como están hoy. "Contacto" y "Horario" no son
  // listas de enlaces: los pinta el propio pie a partir de los datos de
  // arriba, así que aquí solo va la de Navegación, que sí lo es.
  footerNavTitle: "Navegación",
  footerContactTitle: "Contacto",
  footerScheduleTitle: "Horario",
  copyright: "Camelia Interiorismo. Todos los derechos reservados",
  footerColumns: keyed(
    [
      {
        _type: "footerColumn",
        title: "Navegación",
        links: keyed(
          [
            ["Inicio", "/"],
            ["Estudio", "/estudio"],
            ["Metodología", "/metodologia"],
            ["Servicios", "/servicios"],
            ["Proyectos", "/proyectos"],
            ["Shop", "/tienda"],
            ["Blog", "/blog"],
          ].map(([label, href]) => ({ _type: "link", label, href })),
          "fn",
        ),
      },
    ],
    "fc",
  ),
});

// --- Textos legales -------------------------------------------------------
const legalFiles = [
  ["aviso-legal", "Aviso legal", "AVISO_LEGAL_SECTIONS", "AVISO_LEGAL_LEAD"],
  [
    "politica-de-privacidad",
    "Política de privacidad",
    "PRIVACIDAD_SECTIONS",
    "PRIVACIDAD_LEAD",
  ],
  [
    "politica-de-cookies",
    "Política de cookies",
    "COOKIES_SECTIONS",
    "COOKIES_LEAD",
  ],
  [
    "accesibilidad",
    "Accesibilidad web",
    "ACCESIBILIDAD_SECTIONS",
    "ACCESIBILIDAD_LEAD",
  ],
];

/** Los bloques del código y los del schema son el mismo árbol, con otro nombre. */
const legalBlock = (b, i) => {
  const key = `b${i}`;
  if (b.type === "text")
    return {
      _key: key,
      _type: "legalText",
      paragraphs: b.paragraphs,
      links: b.links
        ? keyed(
            b.links.map((l) => ({ _type: "inlineLink", ...l })),
            `${key}l`,
          )
        : undefined,
    };
  if (b.type === "list")
    return { _key: key, _type: "legalList", items: b.items };
  if (b.type === "details")
    return {
      _key: key,
      _type: "legalDetails",
      entries: keyed(
        b.entries.map((e) => ({ _type: "detailEntry", ...e })),
        `${key}e`,
      ),
    };
  if (b.type === "lines")
    return {
      _key: key,
      _type: "legalLines",
      items: keyed(
        b.items.map((l) => ({ _type: "legalLine", ...l })),
        `${key}i`,
      ),
    };
  if (b.type === "subsection")
    return {
      _key: key,
      _type: "legalSubsection",
      title: b.title,
      blocks: b.blocks.map((sub, j) => legalBlock(sub, `${i}_${j}`)),
    };
  warnings.push(`Bloque legal desconocido: ${b.type}`);
  return null;
};

for (const [file, title, sectionsName, leadName] of legalFiles) {
  const src = await read(`src/features/legal/${file}.ts`);
  const sections = literal(src, `export const ${sectionsName}`);
  if (!sections) {
    warnings.push(`No encuentro ${sectionsName} en ${file}.ts`);
    continue;
  }
  push({
    _id: `legalDocument-${file}`,
    _type: "legalDocument",
    title,
    slug: slug(file),
    lead: literal(src, `export const ${leadName}`),
    sections: sections.map((s, i) => ({
      _key: `s${i}`,
      _type: "legalSection",
      number: s.number,
      title: s.title,
      blocks: s.blocks.map(legalBlock).filter(Boolean),
    })),
  });
}

// --- Páginas --------------------------------------------------------------
const phrases =
  (await grab("content-backup/home_AnimatedPhrase.tsx", "const PHRASES")) ?? [];
const detailImages =
  (await grab("content-backup/home_DetailGrid.tsx", "const DETAIL_IMAGES")) ??
  [];

// La cuadrícula de la Home enlaza a proyectos, con una foto propia: los
// ficheros de /assets/home/ son encuadres distintos a los del listado.
const featured = [];
for (const d of detailImages) {
  featured.push({
    _type: "featuredProject",
    project: ref(`project-${d.slug}`),
    image: await img(d.src, d.alt),
  });
}

push({
  _id: "homePage",
  _type: "homePage",
  heroVideo:
    "https://res.cloudinary.com/uvofxvtg/video/upload/f_auto,q_auto,c_limit,w_1920/VIDEO_HOME_nozgqt.mov",
  // El logotipo blanco que va centrado sobre el vídeo.
  heroLogo: await img("/assets/logo/Camelia logo sin fondo blanco.png", "Camelia"),
  animatedPhrases: phrases,
  services: [...serviceIdByTitle.values()].map((id, i) => kref(id, i)),
  featuredProjects: keyed(featured, "fp"),
  testimonials: testimonials.map((t, i) =>
    kref(`testimonial-${slugOf(t.name ?? t.author ?? `t${i}`)}`, i),
  ),
  partners: partners.map((p, i) => kref(`partner-${slugOf(p.name)}`, i)),
  // Títulos y CTA copiados literalmente de los componentes de Home. El salto
  // de línea de los que hoy llevan un <br> se conserva como \n; la web lo
  // pinta igual (ver Testimonials, que ya partía "Palabras de quiénes").
  servicesTitle: "Diseñamos espacios que cuentan historias",
  servicesCta: {
    _type: "link",
    label: "SOBRE NUESTROS SERVICIOS",
    href: "/servicios",
  },
  detailTitle: "Espacios construidos desde el detalle",
  testimonialsTitle: "Palabras de quiénes\nlo han vivido",
  cta: {
    _type: "ctaBanner",
    title: "¿Comenzamos tu proyecto?",
    button: { _type: "link", label: "CONTÁCTANOS", href: "/contacto" },
    image: await img("/assets/home/Banner 1 home.png", "-"),
  },
});

// Desde el backup: AboutSections ya lee de Sanity y su constante ha
// desaparecido del componente.
const aboutSections =
  (await grab("content-backup/estudio_AboutSections.tsx", "const SECTIONS")) ??
  [];
const estudioSections = [];
for (const s of aboutSections) {
  estudioSections.push({
    _type: "aboutSection",
    title: s.title,
    subtitle: s.subtitle,
    // La clave en el componente es `body`, no `paragraphs`: leerla mal dejaba
    // las tres secciones de Estudio sin una línea de texto.
    paragraphs: s.body ?? s.paragraphs,
    image: await img(s.image, s.title),
  });
}
push({
  _id: "estudioPage",
  _type: "estudioPage",
  title: "Estudio",
  sections: keyed(estudioSections, "sec"),
});

const procesoTabs =
  (await grab(
    "content-backup/metodologia_ProcesoTabs.tsx",
    "const PROCESO_TABS",
  )) ?? [];
const experienceSteps =
  (await grab(
    "content-backup/metodologia_ExperienciaScroll.tsx",
    "const STEPS",
  )) ?? [];
const proceso = [];
for (const t of procesoTabs)
  proceso.push({
    _type: "processStep",
    label: t.label,
    title: t.title,
    // `body` en el componente, no `paragraphs`.
    paragraphs: t.body ?? t.paragraphs,
    image: await img(t.image, t.title),
  });
const experiencia = [];
for (const s of experienceSteps)
  experiencia.push({
    _type: "experienceStep",
    title: s.title,
    paragraphs: s.body ?? s.paragraphs,
    // Los pasos alternan el lado de la foto; es dato, no maquetación fija.
    imageRight: s.imageRight ?? false,
    image: await img(s.image, s.title),
  });
push({
  _id: "metodologiaPage",
  _type: "metodologiaPage",
  title: "Metodología",
  processTitle: "El proceso",
  experienceTitle: "La experiencia",
  process: keyed(proceso, "p"),
  experience: keyed(experiencia, "e"),
});

const accompaniment =
  (await grab(
    "content-backup/servicios_AccompanimentSection.tsx",
    "const ACCOMPANIMENT_ITEMS",
  )) ?? [];
const faq =
  (await grab("content-backup/servicios_FaqSection.tsx", "const FAQ_ITEMS")) ??
  [];
const acc = [];
for (const a of accompaniment)
  acc.push({
    _type: "accompanimentItem",
    question: a.question,
    answer: a.answer,
    image: await img(a.image, a.question),
  });
push({
  _id: "serviciosPage",
  _type: "serviciosPage",
  title: "Servicios",
  heroImage: await img("/assets/servicios/Servicio hero.jpg", "-"),
  heroImagePosition: "center 58%",
  accompanimentTitle: "Cómo podemos\nacompañarte",
  faqTitle: "Antes de empezar\nel proyecto",
  cta: {
    _type: "ctaBanner",
    title: "Hablemos de tu espacio",
    text: "Cada proyecto parte de entender cómo vives, qué necesitas y cómo quieres sentir tu espacio. Estaremos encantados de escuchar tu idea y acompañarte en el proceso.",
    // El botón de Servicios dice "¿COMENZAMOS?", no "CONTÁCTANOS" como los
    // de Home y Proyectos.
    button: { _type: "link", label: "¿COMENZAMOS?", href: "/contacto" },
    image: await img("/assets/home/Banner 1 home.png", "-"),
  },
  phases: [...serviceIdByTitle.values()].map((id, i) => kref(id, i)),
  accompaniment: keyed(acc, "a"),
  faq: keyed(
    faq.map((f) => ({
      _type: "faqItem",
      question: f.question,
      answer: f.answer,
    })),
    "q",
  ),
});

push({
  _id: "proyectosPage",
  _type: "proyectosPage",
  title: "Proyectos",
  heroImage: await img("/assets/proyectos/Proyectos hero.jpg", "-"),
  heroImagePosition: "center 35%",
  introTitle: "Espacios con\nidentidad propia",
  introText:
    "Diseñamos espacios que responden a quienes lo habitan, cuidando la distribución, la luz, los materiales y cada detalle desde una mirada coherente y duradera. Cada proyecto nace de entender cómo vive cada cliente para traducirlo en interiores equilibrados, funcionales y con identidad propia.",
  cta: {
    _type: "ctaBanner",
    title: "¿Comenzamos tu proyecto?",
    button: { _type: "link", label: "CONTÁCTANOS", href: "/contacto" },
  },
});
push({
  _id: "tiendaPage",
  _type: "tiendaPage",
  title: "Shop",
  heroImage: await img("/assets/tienda/Shop hero.jpg", "-"),
  heroImagePosition: "center 55%",
});
push({
  _id: "blogPage",
  _type: "blogPage",
  title: "Blog",
  heroImage: await img("/assets/blog/Hero blog.jpg", "-"),
});
push({
  _id: "contactPage",
  _type: "contactPage",
  title: "Contacto",
  heroImage: await img("/assets/contacto/P Reels 8 JUL.jpg", "-"),
  heroImagePosition: "center 45%",
  mapTitle: "Ven a conocernos\nal estudio",
  mapLead: "Nuestro espacio está en el corazón de Alzira.",
  mapText:
    "Si prefieres hablar de tu proyecto en persona, estaremos encantados de recibirte.",
  mapImage: await img("/assets/contacto/Imagen mapa del estudio.jpg", "-"),
  mapAddressLabel: "Dirección",
  // Dos líneas, como en la tarjeta: "Abrir en / Google Maps".
  mapActionLabel: "Abrir en\nGoogle Maps",
  cards: keyed(
    [
      {
        _type: "contactCard",
        kind: "email",
        title: "Escríbenos",
        actionLabel: "Enviar ahora",
      },
      {
        _type: "contactCard",
        kind: "phone",
        title: "Llámanos",
        actionLabel: "Llamar ahora",
      },
      {
        _type: "contactCard",
        kind: "address",
        title: "Visítanos",
        actionLabel: "Ver ubicación",
      },
      { _type: "contactCard", kind: "social", title: "Síguenos" },
    ],
    "c",
  ),
});

// --- Formulario de proyecto ----------------------------------------------
const formSteps =
  (await grab("src/features/formulario/data.ts", "export const STEPS")) ?? [];
const steps = [];
for (const [i, s] of formSteps.entries()) {
  steps.push({
    _type: "formStep",
    // La clave técnica identifica el paso y la respuesta que guarda. Es de
    // solo lectura en el panel: el código la necesita para validar.
    key: s.name ?? `${s.kind}-${i}`,
    title: Array.isArray(s.title) ? undefined : s.title,
    titleLines: Array.isArray(s.title) ? s.title : undefined,
    paragraphs: s.paragraphs,
    help: s.help,
    helpBold: s.helpBold,
    placeholder: s.placeholder,
    cta: s.cta,
    options: s.options,
    fieldLabels: s.fields
      ? keyed(
          s.fields.map((f) => ({
            _type: "fieldLabel",
            name: f.name,
            label: f.label,
            placeholder: f.placeholder,
          })),
          `f${i}`,
        )
      : undefined,
    groupLabels: s.groups
      ? keyed(
          s.groups.map((g) => ({
            _type: "groupLabel",
            name: g.name,
            label: g.label,
            options: g.options,
          })),
          `g${i}`,
        )
      : undefined,
    image: await img(s.image, s.title),
  });
}
push({
  _id: "projectFormPage",
  _type: "projectFormPage",
  steps: keyed(steps, "st"),
});

// --- Pantallas de confirmación y gracias -----------------------------------
push({
  _id: "confirmationPages",
  _type: "confirmationPages",
  studioName: "Camelia interiorismo",
  studioHours: "Horario: L-V de 9:00 a 18:00",
  cartThanks: {
    _type: "thanksScreen",
    title: "SOLICITUD ENVIADA CON ÉXITO",
    text: "Gracias por confiar en Camelia. Estamos revisando tu selección y muy pronto contactaremos contigo para confirmar la disponibilidad de los productos y coordinar la entrega o la recogida en el estudio.",
    backLabel: "Volver al inicio",
  },
  formThanks: {
    _type: "thanksScreen",
    title: "¡GRACIAS POR CONTACTAR CON CAMELIA!",
    text: "Hemos recibido tu solicitud correctamente. Revisaremos la información y nos pondremos en contacto contigo lo antes posible para conocer mejor tu proyecto y preparar una propuesta adaptada a tus necesidades.",
    backLabel: "Volver al inicio",
  },
});

// =============================================================== resultado

const byType = {};
for (const d of docs) byType[d._type] = (byType[d._type] ?? 0) + 1;

console.log(`\n\nDocumentos preparados: ${docs.length}`);
for (const [type, n] of Object.entries(byType).sort())
  console.log(`   ${type.padEnd(20)} ${n}`);
console.log(
  `\nImágenes subidas: ${uploadCount}   reutilizadas: ${reusedCount}`,
);

if (missingImages.size) {
  console.log(
    `\nRutas de imagen que no existen en public/ (${missingImages.size}):`,
  );
  for (const m of missingImages) console.log("   ", m);
  console.log("   Se quedan vacías en Sanity, igual que hoy en la web.");
}
if (warnings.length) {
  console.log(`\nAvisos (${warnings.length}):`);
  for (const w of warnings) console.log("   ", w);
}

if (DRY) {
  console.log("\nSimulacro: no se ha escrito nada. Quita --dry para migrar.");
  process.exit(0);
}

// Una sola transacción: o entra todo o no entra nada, para que el dataset no
// se quede a medias si algo falla por el camino.
const tx = client.transaction();
for (const doc of docs) tx.createOrReplace(doc);
await tx.commit();
console.log(`\nListo. ${docs.length} documentos en Sanity.`);
