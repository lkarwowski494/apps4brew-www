// Obraz Open Graph (D-019): zrzut górnej części nowej strony głównej, motyw jasny, 1200×630 → assets/og-image.png.
// Uruchomienie z katalogu repo: node docs/m6/narzedzia/og-image.mjs
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const port = 8765;
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: repo, stdio: 'ignore' });
try {
  await new Promise((r) => setTimeout(r, 800));
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce', locale: 'pl-PL' });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(repo, 'assets/og-image.png'), clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await browser.close();
} finally {
  server.kill();
}
