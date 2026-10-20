// fix-007-cele.mjs — 04-studio-projektowe-007 (D-024): cele dotykowe linków w stopce i na kartach aplikacji ≥ 44 px (wysokość i szerokość), PL i EN, 320/390/1440 px;
// sąsiednie linki w jednym wierszu oddzielone ≥ 8 px (odstęp poziomy 16 px z zalecenia; test: ≥ 8 px, żeby cele nie stykały się).
import { uruchom, otworz, SZEST } from './fix-wspolne.mjs';

await uruchom('04-studio-projektowe-007', async (b, zapisz) => {
  for (const lang of ['pl', 'en']) for (const w of [320, 390, 1440]) for (const url of SZEST) {
    const { ctx, p } = await otworz(b, url, { w, h: 900, init: lang === 'en' ? "localStorage.setItem('a4b-lang','en')" : undefined });
    const cele = await p.evaluate(() => [...document.querySelectorAll('.stopka a, .app-linki a')].map((a) => {
      const r = a.getBoundingClientRect();
      return { t: a.textContent.trim(), w: r.width, h: r.height, l: r.left, r: r.right, top: r.top, bottom: r.bottom };
    }));
    for (const c of cele) zapisz(c.h >= 44 && c.w >= 44, `${url} ${lang} ${w}px „${c.t}”: ${c.w.toFixed(1)} × ${c.h.toFixed(1)} px`);
    for (const [i, a] of cele.entries()) for (const c of cele.slice(i + 1)) {
      const wTymSamymWierszu = Math.abs(a.top - c.top) < 4;
      if (wTymSamymWierszu) zapisz(c.l - a.r >= 8 || a.l - c.r >= 8, `${url} ${lang} ${w}px: odstęp „${a.t}” ↔ „${c.t}” ${(Math.max(c.l - a.r, a.l - c.r)).toFixed(1)} px`);
    }
    await ctx.close();
  }
});
