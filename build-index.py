#!/usr/bin/env python3
"""
Regenera posts/index.json (el manifiesto que lee el sitio) y rss.xml.

Uso, parado en la carpeta del proyecto:

    python3 build-index.py

Corrélo cada vez que agregues, renombres o borres un post, antes del commit.
"""

import json
import re
from datetime import datetime, timezone
from email.utils import format_datetime
from pathlib import Path
from xml.sax.saxutils import escape

# Cambiá estos tres valores por los tuyos.
SITE_URL = "https://usuario.github.io/repo"
SITE_TITLE = "cuaderno.dev"
SITE_DESCRIPTION = "Notas y apuntes sobre lo que voy construyendo."

RAIZ = Path(__file__).resolve().parent
CARPETA = RAIZ / "posts"
INDICE = CARPETA / "index.json"
FEED = RAIZ / "rss.xml"

FRONTMATTER = re.compile(r"^---\s*\n(.*?)\n---\s*\n?(.*)$", re.S)


def leer_frontmatter(texto: str) -> tuple[dict, str]:
    match = FRONTMATTER.match(texto.lstrip("\ufeff"))
    if not match:
        return {}, texto

    meta = {}
    for linea in match.group(1).splitlines():
        par = re.match(r"^([A-Za-z_][\w-]*)\s*:\s*(.*)$", linea)
        if par:
            meta[par.group(1).lower()] = par.group(2).strip().strip("\"'")
    return meta, match.group(2)


def resumen(meta: dict, cuerpo: str) -> str:
    if meta.get("summary") or meta.get("resumen"):
        return meta.get("summary") or meta["resumen"]
    for parrafo in cuerpo.split("\n\n"):
        limpio = parrafo.strip()
        if limpio and not limpio.startswith(("#", "!")):
            return re.sub(r"[*_`>#\[\]]", "", limpio)[:200]
    return ""


def main() -> int:
    if not CARPETA.is_dir():
        print(f"No encontré la carpeta {CARPETA}")
        return 1

    archivos = sorted(
        (p for p in CARPETA.glob("*.md") if not p.name.startswith("_")),
        key=lambda p: p.name,
        reverse=True,
    )

    INDICE.write_text(
        json.dumps([p.name for p in archivos], indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    items = []
    for archivo in archivos:
        meta, cuerpo = leer_frontmatter(archivo.read_text(encoding="utf-8"))
        if str(meta.get("draft", "")).lower() == "true":
            continue

        slug = archivo.stem
        enlace = f"{SITE_URL.rstrip('/')}/post.html?p={slug}"
        try:
            fecha = datetime.fromisoformat(str(meta.get("date", ""))[:10])
            fecha = fecha.replace(tzinfo=timezone.utc)
        except ValueError:
            fecha = datetime.now(timezone.utc)

        items.append(
            "    <item>\n"
            f"      <title>{escape(meta.get('title', slug))}</title>\n"
            f"      <link>{escape(enlace)}</link>\n"
            f"      <guid isPermaLink=\"true\">{escape(enlace)}</guid>\n"
            f"      <pubDate>{format_datetime(fecha)}</pubDate>\n"
            f"      <description>{escape(resumen(meta, cuerpo))}</description>\n"
            "    </item>"
        )

    FEED.write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<rss version="2.0">\n'
        "  <channel>\n"
        f"    <title>{escape(SITE_TITLE)}</title>\n"
        f"    <link>{escape(SITE_URL)}</link>\n"
        f"    <description>{escape(SITE_DESCRIPTION)}</description>\n"
        "    <language>es</language>\n" + "\n".join(items) + "\n"
        "  </channel>\n"
        "</rss>\n",
        encoding="utf-8",
    )

    print(f"posts/index.json actualizado con {len(archivos)} post(s):")
    for archivo in archivos:
        print("  -", archivo.name)
    print(f"rss.xml actualizado con {len(items)} entrada(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
