#!/usr/bin/env python3
"""
Find PNGs under assets/ that are not referenced by any other asset (meta, prefab, fire, script, etc.).
References are detected by UUIDs in .meta (texture + sprite-frame subMetas) and by path substrings.
"""
import os
import re
import sys
from pathlib import Path

# Project root = parent of tools/
ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
EXCLUDE = {"library", "temp", "build", "node_modules", ".git", "build-templates", "native"}

# Directories where PNGs are loaded in bulk (cc.resources.loadDir) — no per-file UUID in scenes.
# See assets/Scripts/common/ResourcesManager.ts (preload/mj, preload/bg, preload/icons, etc.)
SKIP_PNG_SUBTREES = [
    ASSETS / "resources" / "preload",
]

TEXT_EXT = {
    ".meta", ".prefab", ".fire", ".anim", ".json", ".ts", ".js", ".tsx", ".jsx",
    ".plist", ".txt", ".html", ".xml", ".csv", ".md", ".atlas", ".fnt", ".label",
    ".mtl", ".effect",
}
UUID_RE = re.compile(
    r"\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b"
)


def prune_dirs(dirs):
    dirs[:] = [d for d in dirs if d not in EXCLUDE and not d.startswith(".")]


def is_under_skip_subtree(png: Path) -> bool:
    rp = png.resolve()
    for sub in SKIP_PNG_SUBTREES:
        try:
            rp.relative_to(sub.resolve())
            return True
        except ValueError:
            continue
    return False


def extract_uuids(meta_path: Path):
    try:
        text = meta_path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return []
    return re.findall(r'"uuid"\s*:\s*"([0-9a-fA-F-]{36})"', text)


def iter_text_files_under_assets():
    for r, dirs, files in os.walk(ASSETS):
        prune_dirs(dirs)
        for f in files:
            p = Path(r) / f
            if f.endswith(".fire"):
                yield p
                continue
            suf = p.suffix.lower()
            if suf in TEXT_EXT:
                yield p


def iter_code_json_under_assets():
    """Smaller set for path-string fallback (loadRes paths)."""
    for r, dirs, files in os.walk(ASSETS):
        prune_dirs(dirs)
        for f in files:
            suf = Path(f).suffix.lower()
            if suf in (".ts", ".js", ".json"):
                yield Path(r) / f


def read_text_safe(p: Path, max_bytes=6 * 1024 * 1024):
    try:
        b = p.read_bytes()
    except OSError:
        return ""
    if len(b) > max_bytes:
        b = b[:max_bytes]
    return b.decode("utf-8", errors="ignore")


def main():
    png_paths = []
    for r, dirs, files in os.walk(ASSETS):
        prune_dirs(dirs)
        for f in files:
            if f.lower().endswith(".png"):
                p = (Path(r) / f).resolve()
                if is_under_skip_subtree(p):
                    continue
                png_paths.append(p)

    uuid_to_png = {}
    png_to_meta = {}
    for png in png_paths:
        meta = Path(str(png) + ".meta")
        png_to_meta[png] = meta.resolve() if meta.exists() else None
        if meta.exists():
            for u in extract_uuids(meta):
                uuid_to_png[u.lower()] = png

    referenced = set()
    scan_list = list(iter_text_files_under_assets())

    for fp in scan_list:
        fp_res = fp.resolve()
        if fp.suffix.lower() == ".png":
            continue
        text = read_text_safe(fp)
        if not text:
            continue
        for u in UUID_RE.findall(text):
            key = u.lower()
            if key not in uuid_to_png:
                continue
            own = uuid_to_png[key]
            m = png_to_meta.get(own)
            if fp_res == own or (m and fp_res == m):
                continue
            referenced.add(own)

    # Spine: .atlas references texture file by name; bitmap fonts: .fnt uses file="xxx.png"
    atlas_fnt_texts = []
    for fp in scan_list:
        if fp.suffix.lower() in (".atlas", ".fnt"):
            atlas_fnt_texts.append(read_text_safe(fp))

    for png in png_paths:
        if png in referenced:
            continue
        name = png.name
        for blob in atlas_fnt_texts:
            if not blob:
                continue
            if len(name) <= 5:
                hit = any(line.strip() == name for line in blob.splitlines())
            else:
                hit = name in blob
            if hit:
                referenced.add(png)
                break

    candidates = [p for p in png_paths if p not in referenced]

    # Path substring fallback only in scripts/json (avoids scanning every prefab twice)
    code_files = list(iter_code_json_under_assets())
    for png in candidates:
        rel_r = str(png.relative_to(ROOT))
        rel_a = str(png.relative_to(ASSETS))
        patterns = [rel_r, rel_a]
        if len(png.name) >= 6:
            patterns.append(png.name)
        for pat in patterns:
            if not pat:
                continue
            for fp in code_files:
                fr = fp.resolve()
                if fp.suffix.lower() == ".png" and fr == png:
                    continue
                text = read_text_safe(fp)
                if pat in text:
                    m = png_to_meta.get(png)
                    if fr == png or (m and fr == m):
                        continue
                    referenced.add(png)
                    break
            else:
                continue
            break

    unused = sorted(str(p) for p in png_paths if p not in referenced)
    print("TOTAL", len(png_paths))
    print("REFERENCED", len(referenced))
    print("UNUSED", len(unused))
    for u in unused:
        print(u)

    return unused


if __name__ == "__main__":
    paths = main()
    if "--delete" in sys.argv and paths:
        for u in paths:
            p = Path(u)
            meta = Path(str(p) + ".meta")
            try:
                p.unlink(missing_ok=True)
                meta.unlink(missing_ok=True)
                print("deleted:", u)
            except OSError as e:
                print("failed:", u, e)
