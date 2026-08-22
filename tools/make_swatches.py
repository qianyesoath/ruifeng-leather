#!/usr/bin/env python3
"""Generate grainy leather swatches + hero + about + paper + favicon.

Tasteful material-library tiles. Not product photos. Not 1688 grids.
"""
from __future__ import annotations

import math
import os
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SWATCH_DIR = ROOT / "img" / "swatches"
IMG_DIR = ROOT / "img"
DATA_JS = ROOT / "js" / "data.js"

# Grain style per known id (reuse the existing library look).
STYLE_BY_ID = {
    "oxblood": "lychee",
    "black": "nappa",
    "natural-veg": "veg",
    "cognac": "crazyhorse",
    "olive": "oilwax",
    "ivory": "nappa",
    "navy": "nappa",
    "honey": "oilwax",
    "chestnut": "veg",
    "sand": "nubuck",
    "charcoal": "crazyhorse",
    "cream": "sheep",
    "terra": "veg",
    "ash": "sheep",
    "deep-brown": "oilwax",
    "wine": "lychee",
    "moss": "nubuck",
    "camel": "oilwax",
    "graphite": "crazyhorse",
    "etoupe": "nubuck",
    "gold": "oilwax",
    "fauve": "oilwax",
    "havane": "crazyhorse",
    "kraft": "veg",
    "tabac": "oilwax",
    "chataigne": "veg",
    "craie": "sheep",
    "craie-warm": "nappa",
    "carmin": "lychee",
    "rouge": "lychee",
    "brick": "veg",
    "orange": "oilwax",
    "potiron": "oilwax",
    "jaune": "oilwax",
    "butter": "nubuck",
    "vert-cypress": "nubuck",
    "cactus": "oilwax",
    "vert-fonce": "nappa",
    "indigo": "nappa",
    "bleu-nuit": "nappa",
    "petrol": "nappa",
    "jean": "nappa",
    "rose": "sheep",
    "sakura": "nappa",
    "bois-de-rose": "oilwax",
    "anemone": "nappa",
    "raisin": "oilwax",
    "ink": "nappa",
    "espresso": "oilwax",
    "stone": "sheep",
    "mist": "nappa",
    "slate": "crazyhorse",
    "pewter": "nubuck",
    "tobacco": "oilwax",
    "caramel": "veg",
    "parchment": "sheep",
    "garnet": "lychee",
    "rust": "veg",
    "apricot": "oilwax",
    "persimmon": "veg",
    "mustard": "oilwax",
    "straw": "nubuck",
    "forest": "nappa",
    "sage": "nubuck",
    "cobalt": "nappa",
    "blush": "sheep",
    "petal": "nappa",
    "plum": "oilwax",
    "mauve": "sheep",
    "aubergine": "nappa",
}

STYLE_BY_FAMILY = {
    "dark": "nappa",
    "grey": "sheep",
    "gold-brown": "oilwax",
    "light": "nappa",
    "red": "lychee",
    "orange": "veg",
    "yellow": "oilwax",
    "green": "nubuck",
    "blue": "nappa",
    "pink": "sheep",
    "purple": "nappa",
}

COLOR_RX = re.compile(
    r'"([a-z0-9-]+)"\s*:\s*\{\s*'
    r'zh:\s*"[^"]+",\s*'
    r'en:\s*"[^"]+",\s*'
    r'hex:\s*"(#[0-9a-fA-F]{6})",\s*'
    r'family:\s*"([^"]+)",\s*'
    r'code:\s*"(RF-[0-9]+)"'
)

# id -> (hex, style)  filled by load_colors()
COLORS: dict[str, tuple[str, str]] = {}


def load_colors() -> dict[str, tuple[str, str]]:
    text = DATA_JS.read_text(encoding="utf-8")
    found = COLOR_RX.findall(text)
    if len(found) < 40:
        raise SystemExit(f"parsed only {len(found)} colors from {DATA_JS}")
    COLORS.clear()
    for name, hx, family, _code in found:
        style = STYLE_BY_ID.get(name) or STYLE_BY_FAMILY.get(family, "nappa")
        COLORS[name] = (hx, style)
    return COLORS


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def _noise(h: int, w: int, rng: np.random.Generator, octaves: int = 4) -> np.ndarray:
    acc = np.zeros((h, w), dtype=np.float32)
    amp = 1.0
    total = 0.0
    for i in range(octaves):
        sh, sw = max(2, h >> (octaves - 1 - i)), max(2, w >> (octaves - 1 - i))
        small = rng.random((sh, sw)).astype(np.float32)
        tile = np.array(
            Image.fromarray((small * 255).astype(np.uint8), "L").resize((w, h), Image.BICUBIC),
            dtype=np.float32,
        ) / 255.0
        acc += tile * amp
        total += amp
        amp *= 0.55
    return acc / total


def leather(hex_color: str, size: int, style: str, seed: int) -> Image.Image:
    rng = np.random.default_rng(seed)
    r, g, b = hex_to_rgb(hex_color)
    h = w = size
    yy, xx = np.mgrid[0:h, 0:w]
    n1 = _noise(h, w, rng, 5)
    n2 = _noise(h, w, rng, 3)

    if style == "lychee":
        # Soft pebbled grain — overlapping basins, not cheap plastic dots
        cell = max(14, size // 28)
        gx = (xx + (n1 * cell * 0.7)).astype(np.float32)
        gy = (yy + (n2 * cell * 0.7)).astype(np.float32)
        px = np.mod(gx, cell) / cell - 0.5
        py = np.mod(gy, cell) / cell - 0.5
        d = np.sqrt(px * px + py * py)
        pebble = np.clip(0.55 - d * 1.15, 0, 1)
        grain = 0.42 + pebble * 0.38 + n1 * 0.12
        spec = np.clip(0.22 - d, 0, 1) * 0.18
    elif style == "nubuck":
        grain = 0.46 + (n1 - 0.5) * 0.28 + (n2 - 0.5) * 0.08
        spec = np.zeros_like(grain)
    elif style == "nappa":
        grain = 0.50 + (n1 - 0.5) * 0.14 + (n2 - 0.5) * 0.04
        spec = np.clip(n2 - 0.62, 0, 1) * 0.08
    elif style == "sheep":
        grain = 0.52 + (n1 - 0.5) * 0.10
        spec = np.clip(n1 - 0.7, 0, 1) * 0.05
    elif style == "crazyhorse":
        streak = np.sin((xx * 0.035 + n2 * 8) + n1 * 4) * 0.08
        grain = 0.48 + (n1 - 0.5) * 0.34 + streak
        spec = np.clip(n2 - 0.58, 0, 1) * 0.16
    elif style == "oilwax":
        pull = np.sin(yy * 0.012 + n1 * 3.2) * 0.10
        grain = 0.50 + (n1 - 0.5) * 0.22 + pull
        spec = np.clip(n2 - 0.55, 0, 1) * 0.20
    else:  # veg — open, warm, pores
        pores = (rng.random((h, w)) > 0.993).astype(np.float32)
        pores = np.array(
            Image.fromarray((pores * 255).astype(np.uint8), "L")
            .filter(ImageFilter.GaussianBlur(1.1)),
            dtype=np.float32,
        ) / 255.0
        grain = 0.50 + (n1 - 0.5) * 0.22 - pores * 0.18
        spec = np.clip(n2 - 0.68, 0, 1) * 0.07

    # Soft studio light — material library, not a cave
    cx, cy = w * 0.42, h * 0.38
    dist = np.sqrt(((xx - cx) / w) ** 2 + ((yy - cy) / h) ** 2)
    light = np.clip(1.12 - dist * 0.38, 0.78, 1.18)

    rgb = np.stack(
        [
            np.clip((r / 255.0) * (0.72 + grain * 0.52) * light + spec * 0.35, 0, 1),
            np.clip((g / 255.0) * (0.72 + grain * 0.52) * light + spec * 0.30, 0, 1),
            np.clip((b / 255.0) * (0.72 + grain * 0.52) * light + spec * 0.22, 0, 1),
        ],
        axis=-1,
    )
    # Keep hue: lift lights slightly, keep darks rich
    img = Image.fromarray((rgb * 255).astype(np.uint8), "RGB")
    img = img.filter(ImageFilter.UnsharpMask(radius=1.1, percent=60, threshold=2))
    if style in ("nappa", "sheep"):
        img = img.filter(ImageFilter.GaussianBlur(0.35))
    elif style == "nubuck":
        img = ImageEnhance.Color(img).enhance(0.92)
        img = img.filter(ImageFilter.GaussianBlur(0.25))
    return img


def paper_tile(size: int = 256) -> Image.Image:
    rng = np.random.default_rng(11)
    base = np.array([253, 252, 251], dtype=np.float32)
    n = _noise(size, size, rng, 4)
    fleck = rng.random((size, size))
    rgb = base + (n[:, :, None] - 0.5) * 6
    rgb[fleck > 0.992] -= 8
    return Image.fromarray(np.clip(rgb, 240, 255).astype(np.uint8), "RGB")


def make_hero() -> Image.Image:
    W, H = 1920, 1080
    rng = np.random.default_rng(2026)
    # Full-bleed dark cognac field — Accio-like close-up, generated
    field = leather("#3a2418", 1400, "oilwax", 77).resize((W + 80, H + 80), Image.LANCZOS)
    field = field.crop((40, 40, 40 + W, 40 + H))
    canvas = field.convert("RGB")

    # Quiet sample strip along the lower third — material library, not a 1688 grid
    strip_ids = ["ivory", "natural-veg", "honey", "cognac", "oxblood", "navy"]
    margin = 72
    gap = 18
    n = len(strip_ids)
    tile_w = (W - margin * 2 - gap * (n - 1)) // n
    tile_h = 168
    y0 = H - tile_h - 64
    draw = ImageDraw.Draw(canvas, "RGBA")
    # Soft dark veil so white hero type will read
    veil = Image.new("RGBA", (W, H), (10, 8, 6, 0))
    vd = ImageDraw.Draw(veil)
    for i in range(H):
        a = int(70 + (i / H) * 50)
        vd.line([(0, i), (W, i)], fill=(12, 10, 8, a))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), veil).convert("RGB")

    for i, cid in enumerate(strip_ids):
        hx, st = COLORS[cid]
        tile = leather(hx, 420, st, 300 + i).resize((tile_w, tile_h), Image.LANCZOS)
        x = margin + i * (tile_w + gap)
        # paper-thin frame
        frame = Image.new("RGB", (tile_w + 8, tile_h + 8), (253, 252, 251))
        canvas.paste(frame, (x - 4, y0 - 4))
        canvas.paste(tile, (x, y0))

    canvas = ImageEnhance.Contrast(canvas).enhance(1.04)
    canvas = ImageEnhance.Color(canvas).enhance(0.96)
    return canvas.convert("RGB")


def make_about() -> Image.Image:
    # Portrait sample — warm veg, material-library crop
    img = leather("#c6a674", 1100, "veg", 19)
    # Layer a sliver of chestnut at the edge like stacked hides
    sliver = leather("#703a1e", 1100, "veg", 23).crop((0, 0, 180, 1100))
    img.paste(sliver, (0, 0))
    ivory = leather("#eadec8", 1100, "nappa", 29).crop((0, 0, 70, 1100))
    img.paste(ivory, (180, 0))
    img = img.crop((0, 40, 880, 1140))
    img = img.resize((880, 1100), Image.LANCZOS)
    return img


def make_favicon() -> Image.Image:
    src = leather("#3c2418", 256, "oilwax", 5).resize((64, 64), Image.LANCZOS)
    return src


def main() -> None:
    extras = "--all" in sys.argv
    load_colors()
    SWATCH_DIR.mkdir(parents=True, exist_ok=True)
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    for i, (name, (hx, style)) in enumerate(COLORS.items()):
        im = leather(hx, 400, style, 1000 + i * 17)
        path = (SWATCH_DIR / f"{name}.jpg").resolve()
        if not str(path).startswith(str(SWATCH_DIR.resolve()) + "/"):
            raise SystemExit("refusing to write outside img/swatches: " + str(path))
        im.save(path, "JPEG", quality=82, optimize=True, progressive=True)
        print("swatch", path.name, hx, style, im.size)
    print("swatches", len(COLORS))

    if not extras:
        return

    hero = make_hero()
    hero.save(IMG_DIR / "hero.jpg", "JPEG", quality=88, optimize=True)
    print("hero", hero.size)

    about = make_about()
    about.save(IMG_DIR / "about.jpg", "JPEG", quality=88, optimize=True)
    print("about", about.size)

    paper = paper_tile(256)
    paper.save(IMG_DIR / "paper.png", "PNG", optimize=True)
    print("paper", paper.size)

    fav = make_favicon()
    fav.save(IMG_DIR / "favicon.png", "PNG", optimize=True)
    print("favicon", fav.size)


if __name__ == "__main__":
    main()
