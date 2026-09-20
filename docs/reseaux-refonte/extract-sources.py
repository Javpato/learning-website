#!/usr/bin/env python3
"""Cache local PDF text once per content hash; no OCR or source modification."""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess


def main():
    root = Path(os.environ.get(
        "RESEAUX_SOURCES_DIR", "/home/javpato/Desktop/documentos/cours/Réseaux"
    )).resolve()
    if not root.is_dir():
        raise SystemExit(f"Corpus absent : {root}")
    if not shutil.which("pdftotext"):
        raise SystemExit("pdftotext est requis (Poppler).")
    files = sorted(root.rglob("*.pdf"))
    if not files:
        raise SystemExit(f"Aucun PDF dans {root}")
    cache = Path(__file__).resolve().parent / ".cache"
    cache.mkdir(exist_ok=True)
    manifest_path = cache / "manifest.json"
    old = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    previous = old.get("files", {}) if old.get("version") == 1 else {}
    records = {}
    extracted = reused = 0
    for source in files:
        relative = source.relative_to(root).as_posix()
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        output = cache / "text" / Path(relative).with_suffix(".txt")
        prior = previous.get(relative, {})
        if prior.get("sha256") == digest and output.exists():
            records[relative] = prior
            reused += 1
            continue
        text = subprocess.check_output(
            ["pdftotext", "-layout", str(source), "-"], text=True
        )
        pages = text.split("\f")
        if pages and not pages[-1].strip():
            pages.pop()
        counts = [len(page.strip()) for page in pages]
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text("\n".join(
            f"=== PAGE PDF {i} ===\n{page}" for i, page in enumerate(pages, 1)
        ), encoding="utf-8")
        records[relative] = {
            "sha256": digest,
            "pages_pdf": len(pages),
            "chars_per_page": counts,
            "visual_review_pages": [i for i, count in enumerate(counts, 1) if count < 100],
            "text": output.relative_to(cache).as_posix(),
        }
        extracted += 1
    manifest_path.write_text(json.dumps(
        {"version": 1, "source_root": str(root), "files": records},
        ensure_ascii=False, indent=2
    ) + "\n", encoding="utf-8")
    lines = [
        "# Catalogue local des extractions", "",
        "Les pages pauvres en texte (<100 caractères) exigent une lecture visuelle.",
        "Les autres pages peuvent aussi contenir des figures indispensables.", "",
        "| PDF | Pages | Pages pauvres en texte | Texte |",
        "| --- | ---: | --- | --- |",
    ]
    for relative, record in records.items():
        sparse = ", ".join(map(str, record["visual_review_pages"])) or "—"
        lines.append(f"| {relative} | {record['pages_pdf']} | {sparse} | {record['text']} |")
    (cache / "catalogue.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"{len(records)} PDF : {extracted} extraits, {reused} réutilisés. Cache : {cache}")


if __name__ == "__main__":
    main()
