# Cuaderno — blog estático para GitHub Pages

Sitio en HTML, CSS y JavaScript sin dependencias ni build step. Cada post es un
archivo markdown dentro de `posts/`.

```
index.html          portada
blog.html           listado de todos los posts
post.html           plantilla que renderiza un post (post.html?p=slug)
sobre-mi.html       página estática
css/style.css       estilos
js/posts.js         carga y parseo de los markdown
js/main.js          renderizado de cada página
posts/*.md          tus posts
posts/index.json    manifiesto: qué archivos existen
build-index.py      regenera index.json
.nojekyll           le dice a GitHub que sirva los archivos tal cual
```

## Por qué existe `posts/index.json`

GitHub Pages es un servidor estático y no permite listar el contenido de una carpeta.
El navegador no tiene forma de "mirar adentro" de `posts/`. Por eso hay un archivo que
declara qué posts existen, y `build-index.py` lo genera leyendo la carpeta.

## Publicar en GitHub Pages

1. Creá un repositorio nuevo y subí todo el contenido de esta carpeta a la raíz.

   ```bash
   git init
   git add .
   git commit -m "Primer commit"
   git branch -M main
   git remote add origin https://github.com/USUARIO/REPO.git
   git push -u origin main
   ```

2. En el repo, andá a **Settings → Pages**.
3. En *Source* elegí **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
4. Guardá. En un minuto el sitio queda en `https://USUARIO.github.io/REPO/`.

Si querés que la dirección sea `https://USUARIO.github.io` sin nada más, el
repositorio tiene que llamarse exactamente `USUARIO.github.io`.

## Escribir un post nuevo

1. Creá `posts/2026-10-05-titulo-del-post.md` con este encabezado:

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

2. Regenerá el índice:

   ```bash
   python3 build-index.py
   ```

3. Commit y push. Listo.

Campos del encabezado:

| Campo     | Obligatorio | Qué hace                                             |
|-----------|-------------|------------------------------------------------------|
| `title`   | sí          | Título en el listado y en el post                    |
| `date`    | sí          | Formato `AAAA-MM-DD`; ordena y agrupa por año        |
| `summary` | no          | Si falta, se usa el primer párrafo                    |
| `author`  | no          | Aparece junto a la fecha                             |
| `tags`    | no          | Lista entre corchetes                                |
| `draft`   | no          | `true` deja el archivo sin publicar                  |

El nombre del archivo sin `.md` es la URL del post. Usá minúsculas, números y
guiones, sin espacios ni tildes.

## Probarlo en tu máquina

Abrir los HTML con doble clic no funciona: el navegador bloquea la lectura de los
archivos `.md` por seguridad. Levantá un servidor local desde esta carpeta:

```bash
python3 -m http.server 8000
```

Y entrá a `http://localhost:8000`.

## Actualizar el índice automáticamente (opcional)

Si no querés acordarte de correr el script, el repo incluye
`.github/workflows/indexar-posts.yml`. Cada vez que hagas push de un `.md` nuevo,
GitHub regenera `posts/index.json` solo. Para habilitarlo andá a
**Settings → Actions → General → Workflow permissions** y elegí
**Read and write permissions**.

## Personalizar

- **Nombre del sitio:** buscá `Cuaderno` en los cuatro `.html` y en `js/main.js`.
- **Colores y tipografías:** están todos como variables arriba de `css/style.css`.
- **Menú:** el `<nav>` está repetido en cada `.html`; si agregás una página, sumá el
  enlace en los cuatro archivos.
