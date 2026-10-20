// Obraz Open Graph (D-021): osobna kompozycja 1200×630 (logo, hasło, pasek drogi ziarna), nie zrzut strony → assets/og-image.png.
// HTML kompozycji jest w tym skrypcie (page.setContent), bez osobnego pliku .html w repo; kroje i style z lokalnego serwera
// (python3 -m http.server w katalogu repo): /assets/site.css (tokeny jasnego motywu, droga ziarna) i /fonts/ (przez site.css).
// Uruchomienie z katalogu repo: node docs/m6/narzedzia/og-image.mjs
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const port = 8765;
const origin = `http://localhost:${port}`;

// Marginesy bezpieczne ~60 px (podglądy linków przycinają brzegi). Barwy wyłącznie z tokenów jasnego motywu (site.css).
// Pasek drogi: pięć etapów z podpisami jak na stronie (nazwa etapu + etap pracy studia), wszystkie „zrobione” = pełna paleta.
const html = `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="http://localhost:${port}/assets/site.css">
<style>
  html, body { width: 1200px; height: 630px; margin: 0; overflow: hidden; }
  body { box-sizing: border-box; padding: 56px 60px 56px; display: flex; flex-direction: column; justify-content: space-between; }
  .logo { font-size: 44px; line-height: 1; }
  .haslo { margin: 0; font: 400 96px/1.04 var(--kroj-tytul); letter-spacing: -.015em; max-width: 1000px; text-wrap: balance; }
  .kto { margin: 22px 0 0; font: 400 28px/1.2 var(--kroj-tresc); color: var(--tusz-2); max-width: none; }
  .droga { margin: 0; padding: 0; }
  .droga-pasek { gap: 6px; }
  .droga-pasek > span { padding-top: 46px; }
  .droga-pasek > span::before { height: 30px; border-width: 3px; }
  .d-nazwa { font-size: 26px; line-height: 1.2; }
  .d-studio { font-size: 20px; line-height: 1.25; margin-top: 2px; }
  .droga-pasek > span:not(.zrobione) .d-nazwa { color: var(--tusz); }
</style>
</head>
<body>
  <div class="logo">Apps4Brew</div>
  <div>
    <h1 class="haslo">Aplikacje tańsze niż espresso.</h1>
    <p class="kto">Studio aplikacji z Warszawy</p>
  </div>
  <div class="droga" role="img" aria-label="Droga ziarna">
    <span class="droga-pasek">
      <span class="d-zbior zrobione"><span class="d-nazwa">Zbiór</span><span class="d-studio">research</span></span>
      <span class="d-obrobka zrobione"><span class="d-nazwa">Obróbka</span><span class="d-studio">projekt</span></span>
      <span class="d-palenie zrobione"><span class="d-nazwa">Palenie</span><span class="d-studio">budowa z testami</span></span>
      <span class="d-parzenie zrobione"><span class="d-nazwa">Parzenie</span><span class="d-studio">testy z ludźmi (TestFlight)</span></span>
      <span class="d-podanie zrobione"><span class="d-nazwa">Podanie</span><span class="d-studio">App Store</span></span>
    </span>
  </div>
</body>
</html>`;

const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: repo, stdio: 'ignore' });
try {
  await new Promise((r) => setTimeout(r, 800));
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce', locale: 'pl-PL' });
  const page = await ctx.newPage();
  // Strona z setContent ma pochodzenie „null”, a kroje z innego pochodzenia wymagają CORS: serwer lokalny go nie wysyła, więc dodajemy nagłówek.
  await page.route(`${origin}/**`, async (route) => {
    const res = await route.fetch();
    await route.fulfill({ response: res, headers: { ...res.headers(), 'access-control-allow-origin': '*' } });
  });
  const failed = [];
  page.on('requestfailed', (r) => failed.push(r.url()));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')));
  const ok = ['Young Serif', 'Source Sans 3'].every((f) => loaded.includes(f));
  const over = await page.evaluate(() => document.documentElement.scrollHeight > 630 || document.documentElement.scrollWidth > 1200);
  if (failed.length || !ok || over) throw new Error(`kompozycja OG niepoprawna: nieudane=${JSON.stringify(failed)} kroje=${ok} przepełnienie=${over}`);
  await page.screenshot({ path: path.join(repo, 'assets/og-image.png'), clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await browser.close();
} finally {
  server.kill();
}
