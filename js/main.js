/* =========================================================
   main.js — decide qué renderizar según data-page del <body>
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const pagina = document.body.dataset.page;
  if (pagina === "home") renderPortada();
  if (pagina === "blog") renderIndice();
  if (pagina === "post") renderPost();

  const año = document.getElementById("año");
  if (año) año.textContent = new Date().getFullYear();
});

/* --------------------------------------------------------- */

function mensajeError(contenedor, err) {
  console.error(err);
  const enLocal = location.protocol === "file:";
  contenedor.innerHTML = enLocal
    ? `<p class="state">Abriste el sitio con doble clic, así que el navegador bloquea la
       lectura de los archivos. Levantá un servidor local desde la carpeta del proyecto:
       <code>python3 -m http.server 8000</code> y entrá a
       <code>http://localhost:8000</code>.</p>`
    : `<p class="state">No se pudieron cargar los posts. Revisá que
       <code>posts/index.json</code> exista y que los archivos <code>.md</code> que
       nombra estén en la carpeta <code>posts</code>.</p>`;
}

function itemPost(p) {
  const tags = p.tags.length
    ? `<div class="tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>`
    : "";
  return `
    <li class="post-item">
      <div class="post-item-row">
        <time class="post-date" datetime="${esc(p.fecha)}">${esc(formatearFecha(p.fecha))}</time>
        <div>
          <a class="post-title" href="post.html?p=${encodeURIComponent(p.slug)}">${esc(p.titulo)}</a>
          ${p.resumen ? `<p class="post-summary">${esc(p.resumen)}</p>` : ""}
          ${tags}
        </div>
      </div>
    </li>`;
}

/* --------- Portada: los tres posts más recientes --------- */
async function renderPortada() {
  const destino = document.getElementById("ultimos");
  if (!destino) return;

  try {
    const posts = (await cargarTodos()).slice(0, 3);
    destino.innerHTML = posts.length
      ? `<ul class="post-list">${posts.map(itemPost).join("")}</ul>`
      : `<p class="state">Todavía no hay nada publicado. Creá tu primer archivo en
         <code>posts/</code> y actualizá el índice.</p>`;
  } catch (err) {
    mensajeError(destino, err);
  }
}

/* --------- blog.html: todos los posts por año --------- */
async function renderIndice() {
  const destino = document.getElementById("indice");
  if (!destino) return;

  try {
    const posts = await cargarTodos();
    if (!posts.length) {
      destino.innerHTML = `<p class="state">Todavía no hay nada publicado. Creá tu primer
        archivo en <code>posts/</code> y actualizá el índice.</p>`;
      return;
    }

    const porAño = new Map();
    for (const p of posts) {
      const año = String(p.fecha).slice(0, 4) || "Sin fecha";
      if (!porAño.has(año)) porAño.set(año, []);
      porAño.get(año).push(p);
    }

    destino.innerHTML = [...porAño.entries()].map(([año, lista]) => `
      <h2 class="year">${esc(año)}</h2>
      <ul class="post-list">${lista.map(itemPost).join("")}</ul>
    `).join("");
  } catch (err) {
    mensajeError(destino, err);
  }
}

/* --------- post.html?p=slug --------- */
async function renderPost() {
  const destino = document.getElementById("post");
  if (!destino) return;

  const slug = new URLSearchParams(location.search).get("p");
  if (!slug || !/^[\w.-]+$/.test(slug)) {
    destino.innerHTML = `<p class="state">Falta indicar qué post abrir.
      <a href="blog.html">Volver al blog</a>.</p>`;
    return;
  }

  try {
    const p = await cargarPost(slug);
    document.title = `${p.titulo} — Cuaderno`;

    const meta = [formatearFecha(p.fecha), p.autor].filter(Boolean).join(" · ");
    const tags = p.tags.length
      ? `<div class="tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>`
      : "";

    destino.innerHTML = `
      <header class="post-header">
        <h1>${esc(p.titulo)}</h1>
        <p class="post-meta">${esc(meta)}</p>
        ${tags}
      </header>
      <div class="post-body">${marked.parse(p.cuerpo)}</div>
      <a class="back-link" href="blog.html">Volver a todos los posts</a>`;
  } catch (err) {
    console.error(err);
    destino.innerHTML = `<p class="state">No se encontró el post
      <code>${esc(slug)}.md</code>. <a href="blog.html">Volver al blog</a>.</p>`;
  }
}
