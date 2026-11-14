"""Make the website's font files from the brand fonts in brand/fonts.

The brand fonts contain characters the site never uses. This script keeps only
what each language needs, so phones download less:

  src/fonts/onest-latin.woff2      Onest, Latin only (English, and Latin words on Urdu pages)
  src/fonts/nastaliq.woff2         Noto Nastaliq Urdu Regular, Urdu and Saraiki only
  src/fonts/nastaliq-labels.woff2  Noto Nastaliq Urdu, only the letters of اردو and سرائیکی
                                   (the language names in the chooser on English pages)
  src/fonts/coverage.json          the characters in each file, and the CSS unicode-range
                                   strings that src/fonts/onest.ts, src/fonts/nastaliq.ts and
                                   the two @font-face files in src/styles/ must use

The output is committed, so building the site never needs Python. Run this again only
when a brand font changes:

  python -m venv .venv
  .venv/Scripts/python -m pip install -r scripts/requirements.txt   (Windows; bin/ elsewhere)
  .venv/Scripts/python scripts/subset-fonts.py
"""

from __future__ import annotations

import hashlib
import json
import shutil
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
BRAND = ROOT / "brand" / "fonts"
OUT = ROOT / "src" / "fonts"

ONEST_SRC = BRAND / "Onest" / "Onest[wght].woff2"
NASTALIQ_SRC = BRAND / "NotoNastaliqUrdu" / "NotoNastaliqUrdu[wght].woff2"

# Google Fonts' "latin" subset, plus the left and right arrows used in links.
ONEST_UNICODES = [
    *range(0x0000, 0x0100),
    0x0131, 0x0152, 0x0153, 0x02BB, 0x02BC, 0x02C6, 0x02DA, 0x02DC,
    0x0304, 0x0308, 0x0329,
    *range(0x2000, 0x2070),
    0x20AC, 0x2122, 0x2190, 0x2191, 0x2192, 0x2193, 0x2212, 0x2215, 0xFEFF, 0xFFFD,
]

# What Urdu and Saraiki text uses, and nothing more. The font also has letters for Arabic,
# Persian, Pashto, Sindhi and others; leaving those out takes the file from 195 to 170 KB,
# and the fixed Regular weight below takes it to 107 KB. On slow 4G that brings Nastaliq in
# about 1.3 s sooner (Phase-1 font spike, see docs/website-plan.md).
# Latin letters and digits are left out on purpose: they come from Onest.
NASTALIQ_UNICODES = [
    *range(0x0621, 0x064B),  # Arabic letters, including those of باهرة in Bilal's introduction
    *range(0x064B, 0x0659),  # tanween, zabar, pesh, zer, shadda, sukun, madda, hamza, ulta pesh, noon ghunna
    0x0670, 0x0640,  # khari zabar, tatweel
    *range(0x0610, 0x0615),  # honorific marks used in Urdu religious text
    0x060C, 0x060E, 0x060F, 0x061B, 0x061F, 0x06D4,  # ، ؎ ؏ ؛ ؟ ۔
    0x066A, 0x066B, 0x066C, 0x066D,  # ٪ ٫ ٬ ٭
    *range(0x0660, 0x066A), *range(0x06F0, 0x06FA),  # Arabic and Urdu digits
    # Urdu letters: ٹ پ چ ڈ ڑ ژ ک گ ں ھ ہ ۂ ۃ ی ے ۓ
    0x0679, 0x067E, 0x0686, 0x0688, 0x0691, 0x0698, 0x06A9, 0x06AF,
    0x06BA, 0x06BE, 0x06C1, 0x06C2, 0x06C3, 0x06CC, 0x06D2, 0x06D3,
    # Saraiki letters ٻ ڄ ڳ ݙ ݨ, and the older spellings ڋ ڻ until Bilal chooses
    0x067B, 0x0684, 0x06B3, 0x0759, 0x0768, 0x068B, 0x06BB,
    # Spaces, invisible joining and direction marks, curly quotes, ellipsis, the dotted
    # circle that shows a lone mark, and ligatures often found in pasted text (ﷲ ﷺ ﷽).
    0x0020, 0x00A0, 0x200C, 0x200D, 0x200E, 0x200F,
    0x2018, 0x2019, 0x201C, 0x201D, 0x2026, 0x25CC,
    0xFDF2, 0xFDFA, 0xFDFD,
]
# Regular only. The weight range would make the file 170 KB instead of 107 KB; Urdu and
# Saraiki headings stand out by size and colour instead of bold.
NASTALIQ_WEIGHT = 400

LABELS_TEXT = "اردو سرائیکی"
# Two words need one weight. A fixed Regular drops the variation data: 35 KB becomes 21 KB.
LABELS_WEIGHT = 400

SARAIKI_LETTERS = {0x067B: "ٻ", 0x0684: "ڄ", 0x0759: "ݙ", 0x06B3: "ڳ", 0x0768: "ݨ"}


def options() -> subset.Options:
    o = subset.Options()
    o.flavor = "woff2"
    o.layout_features = ["*"]  # keep every OpenType feature: Nastaliq shaping needs all of them
    o.layout_scripts = ["*"]
    o.name_IDs = ["*"]
    o.name_languages = ["*"]
    o.notdef_outline = True
    o.glyph_names = False
    # The brand files have no per-glyph hinting, only a small 'prep' table that sets
    # smooth rendering on Windows. Keeping "hinting" keeps that table as it is.
    o.hinting = True
    return o


def make(src: Path, out: Path, *, unicodes=None, text=None, weight=None) -> TTFont:
    font = TTFont(src)
    sub = subset.Subsetter(options=options())
    if text is not None:
        sub.populate(text=text)
    else:
        sub.populate(unicodes=unicodes)
    sub.subset(font)
    if weight is not None:
        font = instancer.instantiateVariableFont(font, {"wght": weight})
    font.flavor = "woff2"
    font.save(out)
    return TTFont(out)


def to_unicode_range(codepoints: list[int]) -> str:
    cps = sorted(set(codepoints))
    parts: list[str] = []
    start = prev = cps[0]
    for cp in cps[1:] + [None]:
        if cp is not None and cp == prev + 1:
            prev = cp
            continue
        parts.append(f"U+{start:04X}" if start == prev else f"U+{start:04X}-{prev:04X}")
        if cp is not None:
            start = prev = cp
    return ", ".join(parts)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    # The Windows console defaults to a code page that cannot show Urdu letters.
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    OUT.mkdir(parents=True, exist_ok=True)
    for src in (ONEST_SRC, NASTALIQ_SRC):
        if not src.exists():
            print(f"Missing brand font: {src}", file=sys.stderr)
            return 1

    jobs = {
        "onest-latin.woff2": dict(src=ONEST_SRC, unicodes=ONEST_UNICODES),
        "nastaliq.woff2": dict(src=NASTALIQ_SRC, unicodes=NASTALIQ_UNICODES, weight=NASTALIQ_WEIGHT),
        "nastaliq-labels.woff2": dict(src=NASTALIQ_SRC, text=LABELS_TEXT, weight=LABELS_WEIGHT),
    }

    coverage: dict[str, object] = {
        "note": "Written by scripts/subset-fonts.py. Do not edit by hand.",
        "sources": {
            "Onest": {"file": ONEST_SRC.relative_to(ROOT).as_posix(), "sha256": sha256(ONEST_SRC)},
            "NotoNastaliqUrdu": {"file": NASTALIQ_SRC.relative_to(ROOT).as_posix(), "sha256": sha256(NASTALIQ_SRC)},
        },
        "files": {},
    }

    ok = True
    for name, job in jobs.items():
        out = OUT / name
        font = make(job["src"], out, unicodes=job.get("unicodes"), text=job.get("text"), weight=job.get("weight"))
        cmap = sorted(font.getBestCmap())
        if name == "nastaliq-labels.woff2":
            # Only the letters themselves; the space between the two words is not needed.
            cmap = [cp for cp in cmap if cp != 0x20]
        wanted = job.get("unicodes")
        if wanted is not None:
            source_cmap = TTFont(job["src"]).getBestCmap()
            lost = [cp for cp in wanted if cp in source_cmap and cp not in cmap]
            if lost:
                ok = False
                print(f"  {name}: lost {len(lost)} characters the source font has", file=sys.stderr)
        size = out.stat().st_size
        coverage["files"][name] = {
            "bytes": size,
            "glyphs": len(font.getGlyphOrder()),
            "unicodeRange": to_unicode_range(cmap),
            "codepoints": cmap,
        }
        axes = [f"{a.axisTag} {a.minValue:g}-{a.maxValue:g}" for a in font["fvar"].axes] if "fvar" in font else []
        print(f"{name:24} {size / 1024:6.1f} KB  {len(font.getGlyphOrder()):5} glyphs  {len(cmap):4} characters  {' '.join(axes)}")

    nastaliq = set(coverage["files"]["nastaliq.woff2"]["codepoints"])
    missing = [ch for cp, ch in SARAIKI_LETTERS.items() if cp not in nastaliq]
    if missing:
        ok = False
        print(f"  nastaliq.woff2 is missing Saraiki letters: {' '.join(missing)}", file=sys.stderr)
    else:
        print("Saraiki letters ٻ ڄ ݙ ڳ ݨ are all in nastaliq.woff2")

    (OUT / "coverage.json").write_text(json.dumps(coverage, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    shutil.copyfile(BRAND / "Onest" / "OFL.txt", OUT / "LICENSE-Onest.txt")
    shutil.copyfile(BRAND / "NotoNastaliqUrdu" / "OFL.txt", OUT / "LICENSE-NotoNastaliqUrdu.txt")
    print("Wrote src/fonts/coverage.json and the two licence files.")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
