#!/usr/bin/env python3
"""
Regenera posts/index.json con todos los archivos .md de la carpeta posts.

Uso, parado en la carpeta del proyecto:

    python3 build-index.py

Corrélo cada vez que agregues, renombres o borres un post, antes del commit.
"""

import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
CARPETA = RAIZ / "posts"
INDICE = CARPETA / "index.json"


def main() -> int:
    if not CARPETA.is_dir():
        print(f"No encontré la carpeta {CARPETA}")
        return 1

    archivos = sorted(
        (p.name for p in CARPETA.glob("*.md") if not p.name.startswith("_")),
        reverse=True,
    )

    INDICE.write_text(
        json.dumps(archivos, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print(f"posts/index.json actualizado con {len(archivos)} post(s):")
    for nombre in archivos:
        print("  -", nombre)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
