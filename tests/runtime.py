#!/usr/bin/env python3
"""Run inside the built Crawl4AI image as its default unprivileged user."""

import asyncio
import base64
import http.server
import importlib.metadata
import io
import os
import subprocess
import threading
import unittest

from PIL import Image
from crawl4ai import AsyncWebCrawler, BrowserConfig, CacheMode, CrawlerRunConfig
from playwright._impl._driver import compute_driver_executable


class RuntimeSecurityTests(unittest.TestCase):
    def test_pillow(self):
        version = importlib.metadata.version("Pillow")
        self.assertGreaterEqual(int(version.split(".")[0]), 13, version)
        image = Image.new("RGB", (100, 80), "blue")
        for format in ("PNG", "JPEG"):
            with self.subTest(format=format):
                output = io.BytesIO()
                image.save(output, format=format)
                output.seek(0)
                with Image.open(output) as decoded:
                    decoded.load()
                    decoded.thumbnail((20, 20))
                    self.assertEqual(decoded.size, (20, 16))

    def test_driver_node(self):
        node, _ = compute_driver_executable()
        version = subprocess.check_output([node, "--version"], text=True).strip()
        release = tuple(map(int, version.lstrip("v").split(".")))
        self.assertEqual(release[0], 24)
        self.assertGreaterEqual(release, (24, 22, 1))
        subprocess.run([
            node, "-e",
            "const a=require('node:assert/strict'),z=require('node:zlib');"
            "const b=Buffer.from('Crawl4AI Brotli fixture');"
            "a.deepEqual(z.brotliDecompressSync(z.brotliCompressSync(b)),b)",
        ], check=True)

    def test_crawl(self):
        self.assertNotEqual(os.getuid(), 0)

        class Page(http.server.BaseHTTPRequestHandler):
            def do_GET(self):
                body = b"<!doctype html><title>Local crawl</title><h1>Crawl4AI security fixture</h1>" + b"<p>Local content for a screenshot.</p>" * 100
                self.send_response(200)
                self.send_header("Content-Type", "text/html")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)

            def log_message(self, *args):
                pass

        async def crawl(url):
            async with AsyncWebCrawler(config=BrowserConfig(headless=True)) as crawler:
                result = await crawler.arun(
                    url,
                    config=CrawlerRunConfig(
                        cache_mode=CacheMode.BYPASS, screenshot=True, pdf=True
                    ),
                )
            self.assertTrue(result.success, result.error_message)
            self.assertIn("Crawl4AI security fixture", result.markdown.raw_markdown)
            self.assertTrue(result.pdf.startswith(b"%PDF-"))
            with Image.open(io.BytesIO(base64.b64decode(result.screenshot))) as screenshot:
                screenshot.load()
                self.assertGreater(screenshot.width, 0)
                self.assertGreater(screenshot.height, 0)

        with http.server.ThreadingHTTPServer(("127.0.0.1", 0), Page) as server:
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                asyncio.run(crawl(f"http://127.0.0.1:{server.server_port}/"))
            finally:
                server.shutdown()
                thread.join()


if __name__ == "__main__":
    unittest.main(verbosity=2)
