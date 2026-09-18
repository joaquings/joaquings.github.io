/* =========================================================
   posts.js — carga y parseo de los archivos markdown
   ---------------------------------------------------------
   GitHub Pages es un servidor estático: no puede listar el
   contenido de una carpeta. Por eso los archivos de /posts
   se declaran en posts/index.json (el "manifiesto").
   Para regenerarlo automáticamente: python3 build-index.py
   ========================================================= */

const MANIFEST = "posts/index.json";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun",
               "jul", "ago", "set", "oct", "nov", "dic"];

/* Lee el manifiesto y devuelve la lista de nombres de archivo. */
async function leerManifiesto() {
  const res = await fetch(MANIFEST, { cache: "no-cache" });
  if (!res.ok) throw new Error("No se pudo leer " + MANIFEST);
  const data = await res.json();
  return Array.isArray(data) ? data : data.posts || [];
}

/* Separa el frontmatter YAML del cuerpo del markdown. */
function separarFrontmatter(texto) {
  const limpio = texto.replace(/^\uFEFF/, "");
  const match = limpio.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, cuerpo: limpio };

  const meta = {};
  for (const linea of match[1].split(/\r?\n/)) {
    const par = linea.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!par) continue;

    let valor = par[2].trim().replace(/^["']|["']$/g, "");

    if (valor.startsWith("[") && valor.endsWith("]")) {
      valor = valor.slice(1, -1)
        .split(",")
        .map(v => v.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    }
    meta[par[1].toLowerCase()] = valor;
  }
  return { meta, cuerpo: match[2] };
}

/* Convierte "2026-02-14" en "14 feb 2026" sin sustos de zona horaria. */
function formatearFecha(iso) {
  if (!iso) return "";
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return String(iso);
  return `${Number(m[3])} ${MESES[Number(m[2]) - 1]} ${m[1]}`;
}

/* Primer párrafo del cuerpo, por si el post no declara summary. */
function resumenAutomatico(cuerpo) {
  const parrafo = cuerpo
    .split(/\r?\n\s*\r?\n/)
    .map(p => p.trim())
    .find(p => p && !p.startsWith("#") && !p.startsWith("!["));
  if (!parrafo) return "";
  const plano = parrafo.replace(/[*_`>#\[\]]/g, "").replace(/\s+/g, " ");
  return plano.length > 160 ? plano.slice(0, 157).trimEnd() + "…" : plano;
}

/* Carga un post por su slug (nombre de archivo sin .md). */
async function cargarPost(slug) {
  const res = await fetch(`posts/${slug}.md`, { cache: "no-cache" });
  if (!res.ok) throw new Error("No existe posts/" + slug + ".md");
  const { meta, cuerpo } = separarFrontmatter(await res.text());

  return {
    slug,
    titulo: meta.title || meta.titulo || slug.replace(/[-_]/g, " "),
    fecha: meta.date || meta.fecha || "",
    autor: meta.author || meta.autor || "",
    tags: [].concat(meta.tags || []),
    resumen: meta.summary || meta.resumen || resumenAutomatico(cuerpo),
    borrador: String(meta.draft || meta.borrador || "").toLowerCase() === "true",
    cuerpo
  };
}

/* Carga todos los posts publicados, del más nuevo al más viejo. */
async function cargarTodos() {
  const archivos = await leerManifiesto();
  const slugs = archivos.map(a => String(a).replace(/\.md$/i, ""));

  const resultados = await Promise.all(
    slugs.map(slug => cargarPost(slug).catch(err => {
      console.warn("Se salteó un post:", slug, err.message);
      return null;
    }))
  );

  return resultados
    .filter(p => p && !p.borrador)
    .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
}

/* Escapa texto antes de inyectarlo en el HTML. */
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}
