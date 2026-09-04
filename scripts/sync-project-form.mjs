/**
 * Sincroniza SOLO `projectFormPage.steps` con lo que hoy vive en
 * `src/features/formulario/data.ts`.
 *
 *   npm run sanity:sync-form           sincroniza
 *   npm run sanity:sync-form -- --dry  enseña lo que haría, sin escribir nada
 *
 * Por qué existe aparte de `migrate.mjs`: ese script reconstruye TODOS los
 * documentos con `createOrReplace`, así que ejecutarlo de nuevo pisaría
 * cualquier edición hecha desde Sanity Studio en cualquier otra página desde
 * la migración inicial. Este solo toca un campo (`steps`) de un documento
 * (`projectFormPage`), con un `patch().set(...)` — nada más del dataset se
 * mueve.
 *
 * Hace falta porque los pasos "fields" y "choiceGroups" no llevaban su
 * propio `name`: su clave salía de `${kind}-${índice}`, así que insertar o
 * quitar un paso en cualquier punto anterior del array desincronizaba esa
 * clave con Sanity sin que nada avisara. Ahora todos los pasos (salvo la
 * intro, que siempre es el primero) llevan `name`, así que la clave ya no
 * depende de la posición y esto no debería volver a hacer falta salvo que
 * cambie el contenido de los pasos.
 *
 * El token sale del entorno. Nunca está en el código, y esto solo corre en
 * tu máquina — no forma parte de la web desplegada.
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

// ------------------------------------------------- lectura de data.ts
// Mismo recorte-por-llaves que usa migrate.mjs: Node no ejecuta TypeScript,
// así que el literal se extrae del fichero fuente y se evalúa como los
// datos puros que es.

function literal(source, declaration, scope = {}) {
  const start = source.indexOf(declaration);
  if (start === -1) return undefined;
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

function stringScope(source) {
  const scope = {};
  for (const m of source.matchAll(/^const (\w+)\s*=\s*"([^"]*)";/gm)) {
    scope[m[1]] = m[2];
  }
  return scope;
}

async function grab(relPath, declaration) {
  const source = await readFile(path.join(ROOT, relPath), "utf8");
  const scope = stringScope(source);
  const value = literal(source, declaration, scope);
  if (value === undefined) {
    console.error(`No pude leer ${declaration} de ${relPath}`);
    process.exit(1);
  }
  return value;
}

// ------------------------------------------------------------- imágenes

const uploaded = new Map();
const missingImages = new Set();

const existingAssets = new Map();
if (!DRY) {
  const assets = await client.fetch(
    `*[_type == "sanity.imageAsset"]{ _id, originalFilename }`,
  );
  for (const a of assets) {
    if (a.originalFilename) existingAssets.set(a.originalFilename, a._id);
  }
}

async function withRetry(fn, label, attempts = 3) {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i >= attempts) throw error;
      console.log(`Reintento ${i} en ${label}: ${error.message}`);
      await new Promise((r) => setTimeout(r, 1000 * i));
    }
  }
}

/** Sube (o reutiliza, si ya está por su nombre de fichero) una imagen de public/. */
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
    } else if (existingAssets.has(filename)) {
      uploaded.set(publicPath, existingAssets.get(filename));
    } else {
      const asset = await withRetry(
        async () =>
          client.assets.upload("image", await readFile(abs), { filename }),
        filename,
      );
      uploaded.set(publicPath, asset._id);
      existingAssets.set(filename, asset._id);
    }
  }
  return {
    _type: "imageWithAlt",
    asset: { _type: "reference", _ref: uploaded.get(publicPath) },
    alt: alt || "-",
  };
}

// ------------------------------------------------------------ utilidades

const keyed = (items, prefix = "k") =>
  items.filter(Boolean).map((item, i) => ({ _key: `${prefix}${i}`, ...item }));

function dropEmpty(value) {
  if (Array.isArray(value)) {
    return value.filter((v) => v !== null && v !== undefined).map(dropEmpty);
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (v === null || v === undefined) continue;
      out[k] = dropEmpty(v);
    }
    return out;
  }
  return value;
}

// --------------------------------------------------------------- steps

const formSteps = await grab("src/features/formulario/data.ts", "export const STEPS");

const steps = [];
for (const [i, s] of formSteps.entries()) {
  steps.push({
    _type: "formStep",
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
    image: await img(
      s.image,
      Array.isArray(s.title) ? s.title.join(" ") : s.title,
    ),
  });
}

const newSteps = keyed(steps.map(dropEmpty), "st");

console.log(`Pasos leídos de data.ts: ${newSteps.length}`);
console.log(newSteps.map((s) => s.key).join(", "));

if (missingImages.size) {
  console.log(`\nRutas de imagen que no existen en public/ (${missingImages.size}):`);
  for (const m of missingImages) console.log("   ", m);
}

if (DRY) {
  console.log("\nSimulacro: no se ha escrito nada. Quita --dry para sincronizar.");
  process.exit(0);
}

const before = await client.fetch(`*[_id == "projectFormPage"][0].steps[].key`);
console.log(`\nClaves actuales en Sanity (${before?.length ?? 0}): ${before?.join(", ") ?? "(documento vacío)"}`);

await client.patch("projectFormPage").set({ steps: newSteps }).commit();
console.log("\nListo: projectFormPage.steps actualizado.");
