#!/usr/bin/env python3
"""Render the provided course PDFs, preserving selectable text and PDF-page numbering."""
from pathlib import Path
import hashlib,json,re,subprocess,tempfile
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
DEST=ROOT/'platform/public/reseaux/cours'
for name in ['Intro','Routage','IP','TCP']:
    pdf=DEST/f'{name}.pdf'; target=DEST/name; target.mkdir(exist_ok=True)
    digest=hashlib.sha256(pdf.read_bytes()).hexdigest()
    index=target/'pages.json'
    if index.exists() and json.loads(index.read_text()).get('sha256')==digest:
        print(name,'already rendered');continue
    # Use the existing paginated extraction; it is not re-created.
    text=(ROOT/f'docs/reseaux-refonte/.cache/text/Cours/{name}.txt').read_text()
    pages=re.split(r'=== PAGE PDF \d+ ===\s*',text)[1:]
    with tempfile.TemporaryDirectory(prefix='reseaux-pages-') as tmp:
        subprocess.run(['pdftoppm','-scale-to','1600','-png',str(pdf),str(Path(tmp)/'page')],check=True)
        images=sorted(Path(tmp).glob('page-*.png'),key=lambda p:int(p.stem.split('-')[-1]))
        assert len(images)==len(pages),(name,len(images),len(pages))
        for i,img in enumerate(images,1):
            Image.open(img).convert('RGB').save(target/f'{i}.webp','WEBP',quality=86)
    index.write_text(json.dumps({'sha256':digest,'pages':[p.strip() for p in pages]},ensure_ascii=False))
    print(name,len(pages),'pages rendered')
