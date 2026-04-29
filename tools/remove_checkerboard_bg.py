from __future__ import annotations

from collections import deque
from pathlib import Path
import sys

from PIL import Image


def looks_like_checker_bg(r: int, g: int, b: int, a: int) -> bool:
    if a == 0:
        return False
    brightest = max(r, g, b)
    darkest = min(r, g, b)
    return brightest >= 232 and darkest >= 228 and (brightest - darkest) <= 18


def remove_edge_connected_checkerboard(path: Path) -> bool:
    image = Image.open(path).convert("RGBA")
    width, height = image.size
    pixels = image.load()

    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    def try_enqueue(x: int, y: int) -> None:
        if (x, y) in visited:
            return
        visited.add((x, y))
        r, g, b, a = pixels[x, y]
        if looks_like_checker_bg(r, g, b, a):
            queue.append((x, y))

    for x in range(width):
        try_enqueue(x, 0)
        try_enqueue(x, height - 1)
    for y in range(height):
        try_enqueue(0, y)
        try_enqueue(width - 1, y)

    changed = False
    while queue:
        x, y = queue.popleft()
        r, g, b, a = pixels[x, y]
        if a != 0:
            pixels[x, y] = (r, g, b, 0)
            changed = True

        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height:
                try_enqueue(nx, ny)

    if changed:
        image.save(path)
    return changed


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: remove_checkerboard_bg.py <file-or-dir> [<file-or-dir> ...]")
        return 1

    targets = [Path(arg) for arg in sys.argv[1:]]
    pngs: list[Path] = []
    for target in targets:
        if target.is_dir():
            pngs.extend(sorted(target.rglob("*.png")))
        elif target.suffix.lower() == ".png" and target.exists():
            pngs.append(target)

    changed_count = 0
    for png in pngs:
        if remove_edge_connected_checkerboard(png):
            changed_count += 1
            print(f"cleaned {png}")

    print(f"processed={len(pngs)} cleaned={changed_count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
