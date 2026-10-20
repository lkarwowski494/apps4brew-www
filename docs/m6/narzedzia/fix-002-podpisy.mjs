// fix-002-podpisy.mjs — 04-studio-projektowe-002: widoczne podpisy etapów drogi ziarna na podstronach i 404 poniżej 600 px.
// Warunek: każdy widoczny podpis (.d-nazwa, .d-etap) ma ≥ 11 px przy 320 px i rośnie ≥ 1,8× przy tekście 200 % (CDP Page.setFontSizes); figura drogi mieści się w oknie.
// Uwaga: przewijanie całej strony przy tekście 200 % i 320 px wywołuje adres e-mail w stopce (poza zakresem 002; zob. raport roli 08, nowe znalezisko), dlatego mierzę figurę.
// Na czterech podstronach musi być widoczny podpis etapu (.d-etap), żeby dane etapu nie zniknęły wraz z małymi podpisami.
import { uruchom, otworz, PODSTRONY } from './fix-wspolne.mjs';

const pomiar = (p) => p.evaluate(() => {
  const w = [];
  for (const el of document.querySelectorAll('.droga .d-nazwa, .droga .d-etap')) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || r.width === 0 || r.height === 0) continue;
    w.push({ klasa: el.className, tekst: el.textContent.trim().slice(0, 40), px: parseFloat(cs.fontSize) });
  }
  const f = document.querySelector('.droga').getBoundingClientRect();
  return { podpisy: w, scroll: Math.ceil(Math.max(f.right, ...[...document.querySelectorAll('.droga *')].map((e) => e.getBoundingClientRect().right))), okno: innerWidth };
});

await uruchom('04-studio-projektowe-002', async (b, zapisz) => {
  for (const url of [...PODSTRONY, '404.html']) for (const szer of [320, 390, 599]) {
    const { ctx, p } = await otworz(b, url, { w: szer, h: 800 });
    const a = await pomiar(p);
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('Page.setFontSizes', { fontSizes: { standard: 32, fixed: 26 } });
    await p.waitForTimeout(150);
    const z = await pomiar(p);
    const za = (cl, tekst) => z.podpisy.find((x) => x.klasa === cl && x.tekst === tekst);
    for (const x of a.podpisy) {
      const y = za(x.klasa, x.tekst);
      const wsp = y ? y.px / x.px : NaN;
      zapisz(x.px >= 11 && wsp >= 1.8, `${url} ${szer}px „${x.tekst}” (${x.klasa}): ${x.px.toFixed(2)} px → ${y ? y.px.toFixed(2) : '?'} px przy tekście 200 % (×${wsp.toFixed(2)})`);
    }
    if (!url.startsWith('404')) zapisz(a.podpisy.some((x) => x.klasa === 'd-etap'), `${url} ${szer}px: widoczny podpis etapu (.d-etap)`);
    zapisz(z.scroll <= z.okno, `${url} ${szer}px: figura drogi mieści się w oknie przy tekście 200 % (prawa krawędź ${z.scroll} ≤ ${z.okno})`);
    await ctx.close();
  }
});
