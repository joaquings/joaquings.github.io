/* =========================================================
   layout.js — arma la navegación en todas las páginas.
   Así el menú se edita en un solo lugar: js/site-config.js
   ========================================================= */

/* --- Tema claro / oscuro ---------------------------------
   Usa la propiedad color-scheme y la función light-dark() de
   CSS: no hace falta duplicar variables por tema.          */

function temaActual() {
  return document.documentElement.style.colorScheme || "dark";
}

function aplicarTema(tema) {
  document.documentElement.style.setProperty("color-scheme", tema);
  try { localStorage.setItem("tema", tema); } catch (e) { /* modo privado */ }
  document.querySelectorAll(".tema-icono").forEach(el => {
    el.textContent = tema === "dark" ? "🌙" : "☀️";
  });
  document.querySelectorAll(".tema-boton").forEach(el => {
    el.setAttribute("aria-label", tema === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
  });
}

function alternarTema() {
  aplicarTema(temaActual() === "dark" ? "light" : "dark");
}

/* --- Construcción del layout ----------------------------- */

function esPaginaActual(href) {
  const actual = location.pathname.split("/").pop() || "index.html";
  return actual === href;
}

function enlacesNav(clase) {
  return SITE.nav.map(item => `
    <a class="${esPaginaActual(item.href) ? "active" : ""}" href="${item.href}">
      <span aria-hidden="true">${item.icono || ""}</span>${item.texto}
    </a>`).join("");
}

function botonTema() {
  return `<button class="icon-button tema-boton" type="button" title="Cambiar tema">
            <span class="tema-icono" aria-hidden="true">🌙</span>
          </button>`;
}

function construirLayout() {
  const sidebar = document.getElementById("sidebar");
  const navbar = document.getElementById("navbar");
  const footer = document.getElementById("footer");

  if (navbar) {
    navbar.innerHTML = `
      <a class="navbar-title-link" href="index.html">
        <span aria-hidden="true">${SITE.logo}</span>${SITE.nombre}
      </a>
      <div class="navbar-section">
        ${botonTema()}
        <button class="icon-button nav-menu-button" type="button" aria-expanded="false" aria-label="Abrir menú">☰</button>
        <nav class="navbar-menu nav-items" aria-label="Principal">${enlacesNav()}</nav>
      </div>`;

    const boton = navbar.querySelector(".nav-menu-button");
    const menu = navbar.querySelector(".nav-items");
    boton.addEventListener("click", () => {
      const abierto = menu.classList.toggle("open");
      boton.setAttribute("aria-expanded", String(abierto));
    });
  }

  if (sidebar) {
    const destacados = SITE.destacados.map(d =>
      `<a href="post.html?p=${encodeURIComponent(d.slug)}">${d.texto}</a>`).join("");

    const enlaces = SITE.enlaces.map(e =>
      `<a href="${e.href}">${e.texto}</a>`).join("");

    sidebar.innerHTML = `
      <a class="sidebar-title-link" href="index.html">
        <span aria-hidden="true">${SITE.logo}</span>
        <span class="site-name">${SITE.nombre}</span>
      </a>

      <div class="sidebar-section">
        <p>${SITE.descripcion}</p>
      </div>

      <div class="sidebar-section">
        <nav class="sidebar-nav-links" aria-label="Principal">${enlacesNav()}</nav>
      </div>

      <div class="sidebar-section">
        <h2>Destacados</h2>
        <nav class="sidebar-menu">${destacados}</nav>
      </div>

      <div class="sidebar-bottom">
        <div class="sidebar-card">
          <h2>${SITE.tarjeta.titulo}</h2>
          <p>${SITE.tarjeta.texto}</p>
        </div>
        <div class="sidebar-sub-links">
          ${enlaces}
          ${botonTema()}
        </div>
      </div>`;
  }

  if (footer) {
    footer.innerHTML = `
      <div class="footer-inner">
        <span>© <span id="año"></span> ${SITE.nombre}</span>
        <span>${SITE.piePersonal}</span>
      </div>`;
    footer.querySelector("#año").textContent = new Date().getFullYear();
  }

  document.querySelectorAll(".tema-boton").forEach(b =>
    b.addEventListener("click", alternarTema));

  aplicarTema(temaActual());
}

document.addEventListener("DOMContentLoaded", construirLayout);
