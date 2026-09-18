---
title: Cómo escribir un post nuevo
date: 2026-09-10
author: Tu nombre
summary: Crear un archivo markdown, actualizar el índice y hacer push. Eso es todo.
tags: [guía, markdown]
---

Cada post es un archivo `.md` dentro de la carpeta `posts`. No hay base de datos ni
build step: el navegador lee los archivos y los convierte a HTML.

## Los tres pasos

1. Creá un archivo en `posts/`, por ejemplo `2026-09-20-mi-idea.md`.
2. Corré `python3 build-index.py` para regenerar `posts/index.json`.
3. Hacé commit y push. GitHub Pages publica los cambios en un minuto.

## El frontmatter

Arriba de todo va un bloque entre líneas de tres guiones con los datos del post:

```markdown
---
title: Cómo escribir un post nuevo
date: 2026-09-10
author: Tu nombre
summary: Una línea que aparece en el listado.
tags: [guía, markdown]
draft: false
---
```

Solo `title` y `date` son necesarios. Si no ponés `summary`, se usa el primer párrafo.
Si ponés `draft: true`, el post queda en la carpeta pero no aparece en el sitio.

## Qué podés escribir en el cuerpo

Markdown estándar: **negrita**, *cursiva*, [enlaces](https://github.com), listas,
citas y código.

> Las citas quedan con una línea ámbar al costado.

También andan las tablas:

| Campo | Obligatorio | Para qué sirve |
|-------|-------------|----------------|
| title | sí | El título que se muestra |
| date  | sí | Ordena el listado |
| tags  | no | Etiquetas debajo del título |

Y los bloques de código:

```javascript
const posts = await cargarTodos();
console.log(posts.length);
```

## El nombre del archivo importa

El nombre sin `.md` es la URL del post. `2026-09-10-como-escribir-un-post.md` se
abre en `post.html?p=2026-09-10-como-escribir-un-post`. Usá solo minúsculas,
números y guiones, sin espacios ni tildes.
