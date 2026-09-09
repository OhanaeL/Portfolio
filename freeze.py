"""Freeze the Flask portfolio into a static site in build/.

Crawls the app with Flask's test client starting from the known entry points and
follows every local link it finds, so project/experience detail pages, embeds,
images and the resume PDF are all captured without duplicating the slug logic.
"""
import os, re, shutil, mimetypes
from collections import deque
from urllib.parse import urlsplit, unquote

from app import app

BUILD = "build"
SEEDS = ["/", "/projects", "/about", "/experience", "/timeline", "/credits",
         "/robots.txt", "/sitemap.xml"]

# href="..." / src="..." / srcset="..." / url(...) in inline styles
LINK_RE = re.compile(rb"""(?:href|src)\s*=\s*["']([^"'>]+)["']""", re.I)
SRCSET_RE = re.compile(rb"""srcset\s*=\s*["']([^"'>]+)["']""", re.I)

PAGE_TYPES = ("text/html", "application/xhtml+xml")


def is_local(url: str) -> bool:
    if not url or url.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
        return False
    parts = urlsplit(url)
    return not parts.scheme and not parts.netloc and url.startswith("/")


def dest_for(path: str) -> str:
    """Map a URL path to a file on disk. Extension-less paths become dir/index.html."""
    rel = unquote(path.lstrip("/"))
    if rel == "":
        return os.path.join(BUILD, "index.html")
    # treat a trailing extension as a real file
    if os.path.splitext(rel)[1]:
        return os.path.join(BUILD, *rel.split("/"))
    return os.path.join(BUILD, *rel.split("/"), "index.html")


def extract_links(body: bytes):
    for m in LINK_RE.finditer(body):
        yield m.group(1).decode("utf-8", "replace")
    for m in SRCSET_RE.finditer(body):
        for cand in m.group(1).decode("utf-8", "replace").split(","):
            cand = cand.strip().split(" ")[0]
            if cand:
                yield cand


def main():
    if os.path.isdir(BUILD):
        shutil.rmtree(BUILD)
    os.makedirs(BUILD, exist_ok=True)

    client = app.test_client()
    queue = deque(SEEDS)
    seen, written, failed = set(), 0, []

    while queue:
        path = queue.popleft()
        key = path.split("#")[0].split("?")[0]
        if not key or key in seen:
            continue
        seen.add(key)

        resp = client.get(key)
        if resp.status_code != 200:
            failed.append((key, resp.status_code))
            resp.close()
            continue

        body = resp.get_data()
        ctype = (resp.headers.get("Content-Type") or "").split(";")[0].strip()
        resp.close()

        dest = dest_for(key)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "wb") as fh:
            fh.write(body)
        written += 1

        if ctype in PAGE_TYPES or key.endswith(".xml"):
            for raw in extract_links(body):
                if is_local(raw):
                    queue.append(raw.split("#")[0].split("?")[0])

    # static/ is referenced by url_for and never crawled wholesale — copy it,
    # minus content already served by the image/embed routes and dead stylesheets.
    STATIC_SKIP = {"public", "style.css"}

    def _ignore(dirname, names):
        if os.path.abspath(dirname) == os.path.abspath("static"):
            return {n for n in names if n in STATIC_SKIP}
        return set()

    if os.path.isdir("static"):
        shutil.copytree("static", os.path.join(BUILD, "static"),
                        dirs_exist_ok=True, ignore=_ignore)

    print(f"crawled {len(seen)} urls, wrote {written} files")
    if failed:
        print(f"non-200 ({len(failed)}):")
        for p, code in failed[:15]:
            print(f"   {code}  {p}")


if __name__ == "__main__":
    main()
