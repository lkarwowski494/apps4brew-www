// fix-011-forced-colors.mjs — 04-studio-projektowe-011: w trybie wymuszonych kolorów (forced-colors: active) odcinek etapu „zrobione” różni się od niezrobionego,
// znacznik bieżącego etapu jest widoczny, a punktory listy cech są widoczne. Pomiar: computed style pseudoelementów, jasny i ciemny motyw, 390 i 1440 px; do tego zrzut (opcjonalnie: FIX_ZRZUT=ścieżka).
import { uruchom, ORIGIN } from './fix-wspolne.mjs';

await uruchom('04-studio-projektowe-011', async (b, zapisz) => {
  for (const scheme of ['light', 'dark']) for (const w of [390, 1440]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, forcedColors: 'active', colorScheme: scheme, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto(ORIGIN + 'index.html', { waitUntil: 'networkidle' });
    const fc = await p.evaluate(() => matchMedia('(forced-colors: active)').matches);
    zapisz(fc, `${scheme} ${w}px: forced-colors aktywne w przeglądarce testowej`);
    const m = await p.evaluate(() => {
      const bg = (sel, pseudo) => getComputedStyle(document.querySelector(sel), pseudo).backgroundColor;
      const bc = (sel, pseudo) => getComputedStyle(document.querySelector(sel), pseudo).borderTopColor;
      return {
        plotno: getComputedStyle(document.body).backgroundColor,
        zrobione: bg('.d-zbior.zrobione', '::before'), niezrobione: bg('.d-podanie', '::before'),
        punktor: bg('.app-cechy li', '::before'),
        znacznik: bc('.droga-pasek > span.teraz', '::after'),
      };
    });
    zapisz(m.zrobione !== m.niezrobione, `${scheme} ${w}px: odcinek „zrobione” ${m.zrobione} ≠ niezrobiony ${m.niezrobione}`);
    zapisz(m.punktor !== m.plotno, `${scheme} ${w}px: punktor listy cech ${m.punktor} ≠ tło strony ${m.plotno}`);
    zapisz(m.znacznik !== m.plotno, `${scheme} ${w}px: znacznik bieżącego etapu ${m.znacznik} ≠ tło strony ${m.plotno}`);
    if (process.env.FIX_ZRZUT && scheme === 'dark' && w === 390) { await p.locator('.droga').first().scrollIntoViewIfNeeded(); await p.screenshot({ path: process.env.FIX_ZRZUT }); }
    await ctx.close();
  }
});
