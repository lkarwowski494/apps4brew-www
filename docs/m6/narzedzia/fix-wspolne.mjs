// fix-wspolne.mjs — wspólne dla skryptów fix-NNN-*.mjs (testy przeglądarkowe znalezisk 04-studio-projektowe, tryb fix roli 08).
// Wymaga serwera: python3 -m http.server 8765 --bind 127.0.0.1 w katalogu repo oraz Playwrighta z /opt/node-tools.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';

export const ORIGIN = 'http://127.0.0.1:8765/';
export const PODSTRONY = ['trening/privacy.html', 'trening/support.html', 'piekarz/privacy.html', 'piekarz/support.html'];
export const SZEST = ['index.html', ...PODSTRONY, '404.html'];

// Uruchamia próbę: fn(ctxFactory, zapisz) → zapisz(ok, opis) zbiera wyniki; kod wyjścia 1, gdy którykolwiek wynik jest zły.
export async function uruchom(id, fn) {
  const b = await chromium.launch();
  const wyniki = [];
  const zapisz = (ok, opis) => { wyniki.push(ok); console.log(`${ok ? 'ok   ' : 'ZLE  '} ${opis}`); };
  try {
    await fn(b, zapisz);
  } finally {
    await b.close();
  }
  const zle = wyniki.filter((x) => !x).length;
  console.log(`${id}: ${wyniki.length - zle}/${wyniki.length} ok, ${zle} złych`);
  process.exit(zle || !wyniki.length ? 1 : 0);
}

export async function otworz(b, url, opcje = {}) {
  const ctx = await b.newContext({ viewport: { width: opcje.w ?? 390, height: opcje.h ?? 844 }, ...(opcje.ctx ?? {}) });
  if (opcje.init) await ctx.addInitScript(opcje.init);
  const p = await ctx.newPage();
  await p.goto(ORIGIN + url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  return { ctx, p };
}
