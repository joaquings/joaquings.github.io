/* =========================================================
   main.js — renderiza cada página según data-page del <body>
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const pagina = document.body.dataset.page;
  if (pagina === "home") renderPortada();
  if (pagina === "blog") renderIndice();
  if (pagina === "post") renderPost();
});

/* --------------------------------------------------------- */

function mensajeError(contenedor, err) {
  console.error(err);
  contenedor.innerHTML = location.protocol === "file:"
    ? `<p class="state">Abriste el sitio con doble clic, así que el navegador bloquea la
       lectura de los archivos. Levantá un servidor local desde la carpeta del proyecto con
       <code>python3 -m http.server 8000</code> y entrá a <code>http://localhost:8000</code>.</p>`
    : `<p class="state">No se pudieron cargar los posts. Revisá que
       <code>posts/index.json</code> exista y que los archivos <code>.md</code> que nombra
       estén en la carpeta <code>posts</code>.</p>`;
}

function chips(tags, activo) {
  if (!tags.length) return "";
  return `<div class="tags">${tags.map(t =>
    `<a class="tag ${t === activo ? "active" : ""}" href="blog.html?tag=${encodeURIComponent(t)}">${esc(t)}</a>`
  ).join("")}</div>`;
}

function tarjetaPost(p) {
  const tags = p.tags.length
    ? `<div class="tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>`
    : "";
  return `
    <a class="post-card" href="post.html?p=${encodeURIComponent(p.slug)}">
      <span class="post-date">${esc(formatearFecha(p.fecha))}</span>
      <h3>${esc(p.titulo)}</h3>
      ${p.resumen ? `<p>${esc(p.resumen)}</p>` : ""}
      ${tags}
    </a>`;
}

/* --------- Portada --------- */
async function renderPortada() {
  const destino = document.getElementById("ultimos");
  if (!destino) return;

  try {
    const posts = (await cargarTodos()).slice(0, 4);
    destino.innerHTML = posts.length
      ? `<div class="card-grid two">${posts.map(tarjetaPost).join("")}</div>`
      : `<p class="state">Todavía no hay nada publicado. Creá tu primer archivo en
         <code>posts/</code> y corré <code>python3 build-index.py</code>.</p>`;
  } catch (err) {
    mensajeError(destino, err);
  }
}

/* --------- blog.html (con filtro por etiqueta) --------- */
async function renderIndice() {
  const destino = document.getElementById("indice");
  const barra = document.getElementById("filtros");
  if (!destino) return;

  const tagActivo = new URLSearchParams(location.search).get("tag");

  try {
    const todos = await cargarTodos();

    if (barra) {
      const tags = [...new Set(todos.flatMap(p => p.tags))].sort();
      barra.innerHTML = tags.length
        ? `<a class="tag ${!tagActivo ? "active" : ""}" href="blog.html">todos</a>` + chips(tags, tagActivo)
        : "";
    }

    const posts = tagActivo ? todos.filter(p => p.tags.includes(tagActivo)) : todos;

    if (!posts.length) {
      destino.innerHTML = `<p class="state">No hay posts${tagActivo ? ` con la etiqueta <code>${esc(tagActivo)}</code>` : ""}.</p>`;
      return;
    }

    const porAño = new Map();
    for (const p of posts) {
      const año = String(p.fecha).slice(0, 4) || "Sin fecha";
      if (!porAño.has(año)) porAño.set(año, []);
      porAño.get(año).push(p);
    }

    destino.innerHTML = [...porAño.entries()].map(([año, lista]) => `
      <h2 class="year-heading">${esc(año)}</h2>
      <ul class="post-list">${lista.map(p => `<li>${tarjetaPost(p)}</li>`).join("")}</ul>
    `).join("");
  } catch (err) {
    mensajeError(destino, err);
  }
}

/* --------- post.html?p=slug --------- */
async function renderPost() {
  const destino = document.getElementById("post");
  const lateral = document.getElementById("post-sidebar");
  if (!destino) return;

  const slug = new URLSearchParams(location.search).get("p");
  if (!slug || !/^[\w.-]+$/.test(slug)) {
    destino.innerHTML = `<p class="state">Falta indicar qué post abrir.
      <a href="blog.html">Volver al blog</a>.</p>`;
    return;
  }

  let p;
  try {
    p = await cargarPost(slug);
  } catch (err) {
    console.error(err);
    destino.innerHTML = `<p class="state">No se encontró el post <code>${esc(slug)}.md</code>.
      <a href="blog.html">Volver al blog</a>.</p>`;
    return;
  }

  document.title = `${p.titulo} — ${SITE.nombre}`;

  const meta = [formatearFecha(p.fecha), p.autor].filter(Boolean).join(" · ");

  destino.innerHTML = `
    <header class="post-head">
      <p class="post-meta">${esc(meta)}</p>
      <h1>${esc(p.titulo)}</h1>
      ${chips(p.tags)}
    </header>
    <div class="post-body">${marked.parse(p.cuerpo)}</div>
    <nav class="post-nav" id="post-nav"></nav>`;

  const cuerpo = destino.querySelector(".post-body");
  const encabezados = prepararEncabezados(cuerpo);
  if (window.Prism) Prism.highlightAllUnder(cuerpo);

  if (lateral) renderLateral(lateral, p, encabezados);
  renderAnteriorSiguiente(slug);
}

/* Agrega id y ancla a cada h2/h3 del post, y devuelve la lista. */
function prepararEncabezados(cuerpo) {
  const usados = new Set();
  const encabezados = [...cuerpo.querySelectorAll("h2, h3")];

  for (const h of encabezados) {
    let id = h.textContent.toLowerCase().trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    if (!id) id = "seccion";
    let unico = id, n = 2;
    while (usados.has(unico)) unico = `${id}-${n++}`;
    usados.add(unico);

    h.id = unico;
    const ancla = document.createElement("a");
    ancla.className = "heading-anchor";
    ancla.href = `#${unico}`;
    ancla.setAttribute("aria-hidden", "true");
    ancla.textContent = "#";
    h.appendChild(ancla);
  }
  return encabezados;
}

/* Barra derecha del post: fecha, etiquetas e índice con scroll activo. */
function renderLateral(lateral, p, encabezados) {
  const indice = encabezados.length ? `
    <section>
      <h2>En esta página</h2>
      <ul class="toc">
        ${encabezados.map(h => `
          <li class="level-${h.tagName === "H2" ? 2 : 3}">
            <a href="#${h.id}">${esc(h.textContent.replace(/#$/, ""))}</a>
          </li>`).join("")}
      </ul>
    </section>` : "";

  lateral.innerHTML = `
    <section>
      <h2>Publicado</h2>
      <p>${esc(formatearFecha(p.fecha))}</p>
    </section>
    ${p.tags.length ? `<section><h2>Etiquetas</h2>${chips(p.tags)}</section>` : ""}
    ${indice}`;

  if (!encabezados.length) return;

  const enlaces = new Map(
    [...lateral.querySelectorAll(".toc a")].map(a => [a.getAttribute("href").slice(1), a])
  );

  const observador = new IntersectionObserver(entradas => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue;
      enlaces.forEach(a => a.classList.remove("active"));
      enlaces.get(entrada.target.id)?.classList.add("active");
    }
  }, { rootMargin: "0px 0px -75% 0px", threshold: 0 });

  encabezados.forEach(h => observador.observe(h));
}

/* Enlaces al post anterior y al siguiente. */
async function renderAnteriorSiguiente(slug) {
  const nav = document.getElementById("post-nav");
  if (!nav) return;

  try {
    const posts = await cargarTodos();
    const i = posts.findIndex(x => x.slug === slug);
    if (i === -1) return;

    const nuevo = posts[i - 1];
    const viejo = posts[i + 1];

    nav.innerHTML = `
      ${viejo ? `<a href="post.html?p=${encodeURIComponent(viejo.slug)}">
        <span class="direction">← Anterior</span>${esc(viejo.titulo)}</a>` : "<span></span>"}
      ${nuevo ? `<a style="text-align:right" href="post.html?p=${encodeURIComponent(nuevo.slug)}">
        <span class="direction">Siguiente →</span>${esc(nuevo.titulo)}</a>` : ""}`;
  } catch (err) {
    console.warn("No se pudo armar la navegación entre posts:", err);
  }
}
