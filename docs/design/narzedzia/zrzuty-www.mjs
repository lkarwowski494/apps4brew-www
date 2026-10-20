// zrzuty-www.mjs — użycie: node zrzuty-www.mjs <katalog-wyjścia> <plik.html>... [--szer=390,1440] [--motyw=light,dark] [--ruch]
// Zrzut całej strony; domyślnie „Ogranicz ruch” (stan końcowy animacji). --ruch: bez emulacji, zrzut po 250 ms (klatka w trakcie ruchu).
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';
const arg = process.argv.slice(2);
const out = arg[0]; const pliki = arg.slice(1).filter((a) => !a.startsWith('--'));
const opt = (k, d) => (arg.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).split('=')[1].split(',');
const szer = opt('szer', '390,1440').map(Number), motywy = opt('motyw', 'light,dark'), ruch = arg.includes('--ruch');
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
for (const f of pliki) for (const w of szer) for (const m of motywy) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, reducedMotion: ruch ? 'no-preference' : 'reduce' });
  await p.goto('file://' + resolve(f)); await p.evaluate(() => document.fonts.ready);
  await p.evaluate((m) => { document.documentElement.dataset.theme = m; }, m);
  const brak = await p.evaluate(() => [...document.fonts].filter((x) => x.status !== 'loaded').map((x) => x.family));
  await p.waitForTimeout(ruch ? 250 : 100);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const path = `${out}/${basename(f, '.html')}-${w}-${m}${ruch ? '-ruch' : ''}.png`;
  await p.screenshot({ path, fullPage: true });
  console.log(path, sw ? `PRZEWIJANIE POZIOME +${sw}px` : '', brak.length ? `NIEZAŁADOWANE: ${brak.join(',')}` : '');
  await p.close();
}
await b.close();
