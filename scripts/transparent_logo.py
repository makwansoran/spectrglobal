"""Strip white background from spectr-mark-source.png → spectr-mark.png (transparent)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "brand" / "spectr-mark-source.png"
DST = ROOT / "assets" / "brand" / "spectr-mark.png"
# Pixels at or above this level on all channels are treated as background.
WHITE_CUTOFF = 235
# Downscale large exports for faster loads (favicon / header use small display size).
MAX_OUTPUT_SIDE = 640


def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f"Add source PNG first: {SRC}")
    im = Image.open(SRC).convert("RGBA")
    w, h = im.size
    if max(w, h) > MAX_OUTPUT_SIDE:
        scale = MAX_OUTPUT_SIDE / max(w, h)
        w = max(1, int(w * scale))
        h = max(1, int(h * scale))
        im = im.resize((w, h), Image.Resampling.LANCZOS)
    pixels = list(im.getdata())
    out: list[tuple[int, int, int, int]] = []
    for r, g, b, a in pixels:
        if r >= WHITE_CUTOFF and g >= WHITE_CUTOFF and b >= WHITE_CUTOFF:
            out.append((0, 0, 0, 0))
        else:
            out.append((r, g, b, a))
    out_im = Image.new("RGBA", (w, h))
    out_im.putdata(out)
    DST.parent.mkdir(parents=True, exist_ok=True)
    out_im.save(DST, optimize=True)
    opaque = sum(1 for px in out_im.getdata() if px[3] > 0)
    print(f"Wrote {DST} ({w}x{h}), opaque pixels: {opaque}")


if __name__ == "__main__":
    main()
