// fix-009-indeks.mjs — 04-studio-projektowe-009: wiersze indeksu espresso (.receipt) poniżej 600 px mają kraj, cenę i przeliczenie w tych samych miejscach we wszystkich wierszach.
// Podpis układu wiersza: (cena pod nazwą kraju?, przeliczenie na dole bloku ceny (ta sama dolna linia)?, lewa krawędź ceny względem wiersza, prawa krawędź przeliczenia względem wiersza).
// Wszystkie 4 wiersze muszą mieć ten sam podpis przy 320, 360, 390 i 599 px (PL i EN); bez przewijania w poziomie.
import { uruchom, otworz } from './fix-wspolne.mjs';

await uruchom('04-studio-projektowe-009', async (b, zapisz) => {
  for (const lang of ['pl', 'en']) for (const w of [320, 360, 390, 599]) {
    const { ctx, p } = await otworz(b, 'index.html', { w, h: 900, init: lang === 'en' ? "localStorage.setItem('a4b-lang','en')" : undefined });
    const wiersze = await p.evaluate(() => [...document.querySelectorAll('.receipt')].map((row) => {
      const R = row.getBoundingClientRect(); const k = row.querySelector('.kraj').getBoundingClientRect(); const c = row.querySelector('.cena').getBoundingClientRect(); const u = row.querySelector('.usd').getBoundingClientRect();
      return { kraj: row.querySelector('.kraj').textContent.trim(), podpis: [c.top >= k.bottom - 1 ? 'cena pod krajem' : 'cena obok kraju', Math.abs(u.bottom - c.bottom) < 6 ? 'przeliczenie na dole ceny' : 'przeliczenie gdzie indziej', Math.round(c.left - R.left), Math.round(R.right - u.right)].join(' | ') };
    }));
    const ref = wiersze[0].podpis;
    zapisz(wiersze.length === 4, `index ${lang} ${w}px: wierszy ${wiersze.length}`);
    for (const x of wiersze) zapisz(x.podpis === ref, `index ${lang} ${w}px ${x.kraj}: ${x.podpis}`);
    const sw = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    zapisz(sw[0] <= sw[1], `index ${lang} ${w}px: bez przewijania w poziomie (${sw[0]} ≤ ${sw[1]})`);
    await ctx.close();
  }
});
