/* =========================================================
   site-config.js — lo único que hace falta editar para
   cambiar el nombre del sitio, el menú y la barra lateral.
   ========================================================= */

const SITE = {
  nombre: "cuaderno.dev",
  logo: "💾",
  descripcion:
    'Soy <a href="sobre-mi.html">Tu Nombre</a>, desarrollador. Este es mi jardín digital. 🌱',

  // Menú principal: aparece en la barra lateral y en la de arriba.
  nav: [
    { texto: "Inicio", href: "index.html", icono: "🏠" },
    { texto: "Blog", href: "blog.html", icono: "📝" },
    { texto: "Proyectos", href: "proyectos.html", icono: "🧰" },
    { texto: "Sobre mí", href: "sobre-mi.html", icono: "👋" }
  ],

  // Posts que querés tener siempre a mano (usá el slug del archivo .md).
  destacados: [
    { texto: "Cómo escribir un post nuevo", slug: "2026-09-10-como-escribir-un-post" },
    { texto: "Arranca el cuaderno", slug: "2026-08-02-primer-post" }
  ],

  // Caja del final de la barra lateral.
  tarjeta: {
    titulo: "¿Nos escribimos?",
    texto: 'Escribime a <a href="mailto:hola@ejemplo.com">hola@ejemplo.com</a>.'
  },

  // Enlaces chicos al pie de la barra lateral.
  enlaces: [
    { texto: "GitHub", href: "https://github.com/" },
    { texto: "RSS", href: "rss.xml" }
  ],

  piePersonal: "Hecho con archivos de texto y publicado en GitHub Pages."
};
