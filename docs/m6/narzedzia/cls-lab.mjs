// cls-lab.mjs — CLS laboratoryjny (nie dane z pola) na 6 stronach w profilu telefonu: 390 px, sieć Slow 4G (RTT 150 ms, 1,6 Mb/s), CPU 4× (CDP),
// zimna pamięć podręczna, 3 przebiegi na stronę. Test 04-studio-projektowe-001: każdy przebieg ≤ 0,1 (web.dev: „pages should maintain a CLS of 0.1. or less.”).
// Uruchomienie: python3 -m http.server 8765 --bind 127.0.0.1 w katalogu repo, potem node docs/m6/narzedzia/cls-lab.mjs [strona ...]; kod wyjścia 1 = jest przebieg > 0,1.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';

const WSZYSTKIE = ['index.html', 'trening/privacy.html', 'trening/support.html', 'piekarz/privacy.html', 'piekarz/support.html', '404.html'];
const strony = process.argv.length > 2 ? process.argv.slice(2) : WSZYSTKIE;
const b = await chromium.launch();
let zle = 0;
for (const url of strony) {
  const wyniki = [];
  for (let run = 0; run < 3; run++) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
    const p = await ctx.newPage();
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await p.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    await p.goto('http://127.0.0.1:8765/' + url, { waitUntil: 'load' });
    await p.waitForTimeout(3000);
    // przewinięcie, żeby złapać przesunięcia poniżej pierwszego ekranu (CLS liczy całe życie strony)
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } });
    await p.waitForTimeout(500);
    wyniki.push(await p.evaluate(() => window.__cls));
    await ctx.close();
  }
  const max = Math.max(...wyniki);
  if (max > 0.1) zle++;
  console.log(`${url}: CLS ${wyniki.map((x) => x.toFixed(4)).join(', ')} (max ${max.toFixed(4)}) ${max > 0.1 ? 'POWYŻEJ 0,1' : 'ok'}`);
}
await b.close();
console.log(`strony z CLS > 0,1: ${zle}`);
process.exit(zle ? 1 : 0);
