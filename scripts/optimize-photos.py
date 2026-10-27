"""Resizes venue photos to responsive WebP (960w + 1920w) and strips metadata (EXIF/GPS).

    python3 scripts/optimize-photos.py <source.jpg> <name> [<source.jpg> <name> ...]

Output: public/media/photos/<name>-960.webp and <name>-1920.webp
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

OUT = Path(__file__).resolve().parent.parent / 'public' / 'media' / 'photos'
OUT.mkdir(parents=True, exist_ok=True)

args = sys.argv[1:]
for src, name in zip(args[::2], args[1::2]):
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    for w in (960, 1920):
        h = round(im.height * w / im.width)
        out = OUT / f'{name}-{w}.webp'
        im.resize((w, h), Image.LANCZOS).save(out, 'WEBP', quality=78, method=6)
        print(f'{out.name:28} {w}x{h} {out.stat().st_size // 1024} kB')
