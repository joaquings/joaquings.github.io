# cuaderno.dev — blog estático para GitHub Pages

Sitio en HTML, CSS y JavaScript sin framework ni build step. Cada post es un archivo
markdown dentro de `posts/`. Tema claro y oscuro, barra lateral, índice por etiquetas,
tabla de contenidos en los posts y feed RSS.

```
index.html          portada
blog.html           listado de posts, con filtro por etiqueta
post.html           plantilla de un post (post.html?p=slug)
proyectos.html      página estática
sobre-mi.html       página estática
css/style.css       todos los estilos y variables de color
js/site-config.js   nombre del sitio, menú y barra lateral  ← editá esto
js/layout.js        arma el menú y el pie en todas las páginas
js/posts.js         lee los markdown y su encabezado
js/main.js          renderiza portada, listado y post
posts/*.md          tus posts
posts/index.json    manifiesto: qué archivos existen
build-index.py      regenera el manifiesto y el RSS
rss.xml             feed generado
.nojekyll           le dice a GitHub que sirva los archivos tal cual
```

## Por qué existe `posts/index.json`

GitHub Pages es un servidor estático y no permite listar el contenido de una carpeta.
El navegador no puede "mirar adentro" de `posts/`, así que hay un archivo que declara
qué posts existen. `build-index.py` lo genera leyendo la carpeta.

## Escribir un post nuevo

1. Creá `posts/2026-10-05-titulo-del-post.md`:

   ```markdown
   ---
   title: El título del post
   date: 2026-10-05
   author: Tu nombre
   summary: Una línea para el listado.
   tags: [una, otra]
   ---

   Acá va el texto en markdown.
   ```

2. Regenerá el índice y el feed:

   ```bash
   python3 build-index.py
   ```

3. Commit y push.

| Campo     | Obligatorio | Qué hace                                        |
|-----------|-------------|--------------------------------------------------|
| `title`   | sí          | Título en el listado y en el post                |
| `date`    | sí          | Formato `AAAA-MM-DD`; ordena y agrupa por año    |
| `summary` | no          | Si falta, se usa el primer párrafo               |
| `author`  | no          | Aparece junto a la fecha                         |
| `tags`    | no          | Lista entre corchetes; son filtrables            |
| `draft`   | no          | `true` deja el archivo sin publicar              |

El nombre del archivo sin `.md` es la URL del post. Usá minúsculas, números y guiones,
sin espacios ni tildes.

## Publicar en GitHub Pages

1. Subí todo el contenido de esta carpeta a la raíz de un repositorio:

   ```bash
   git init
   git add .
   git commit -m "Primer commit"
   git branch -M main
   git remote add origin https://github.com/USUARIO/REPO.git
   git push -u origin main
   ```

2. En el repo: **Settings → Pages**.
3. *Source*: **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
4. En un minuto queda en `https://USUARIO.github.io/REPO/`.

Antes de publicar, cambiá `SITE_URL`, `SITE_TITLE` y `SITE_DESCRIPTION` arriba de
`build-index.py` para que el RSS apunte a tu dirección real.

Para que la dirección sea `https://USUARIO.github.io` sin nada más, el repositorio tiene
que llamarse exactamente `USUARIO.github.io`.

## Probarlo en tu máquina

Abrir los HTML con doble clic no funciona: el navegador bloquea la lectura de los `.md`.
Levantá un servidor local desde esta carpeta:

```bash
python3 -m http.server 8000
```

Y entrá a `http://localhost:8000`.

## Personalizar

- **Nombre, menú, destacados, enlaces:** todo está en `js/site-config.js`. El menú se
  arma solo en las cinco páginas, no hay que tocarlas una por una.
- **Colores:** las variables están arriba de `css/style.css`. Cada color usa
  `light-dark(claro, oscuro)`, así que definís los dos temas en una línea.
  El acento del sitio es `--theme-yellow`.
- **Tema por defecto:** el botón de la luna guarda la preferencia en el navegador. Para
  cambiar el arranque, editá `color-scheme: dark` en `:root`.
- **Páginas nuevas:** copiá `proyectos.html`, cambiá el contenido y sumá el enlace al
  array `nav` de `js/site-config.js`.

## Actualizar el índice automáticamente (opcional)

`.github/workflows/indexar-posts.yml` regenera `posts/index.json` y `rss.xml` en cada
push de un `.md` nuevo. Para habilitarlo: **Settings → Actions → General → Workflow
permissions → Read and write permissions**.

## Créditos

La estética está inspirada en [taniarascia.com](https://www.taniarascia.com), cuyo
[código es abierto](https://github.com/taniarascia/taniarascia.com). El coloreado de
código usa la paleta de su tema [New Moon](https://taniarascia.github.io/new-moon/).
