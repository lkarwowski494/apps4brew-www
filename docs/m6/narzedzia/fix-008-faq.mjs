// fix-008-faq.mjs — 04-studio-projektowe-008: na stronach wsparcia pytania FAQ (h3) mniejsze niż nagłówek sekcji (h2) i odsunięte od poprzedniej odpowiedzi ≥ 16 px.
// Pomiar: 320/390/1440 px, sekcja PL i EN (widoczna).
import { uruchom, otworz } from './fix-wspolne.mjs';

await uruchom('04-studio-projektowe-008', async (b, zapisz) => {
  for (const url of ['trening/support.html', 'piekarz/support.html']) for (const lang of ['pl', 'en']) for (const w of [320, 390, 1440]) {
    const { ctx, p } = await otworz(b, url, { w, h: 900, init: lang === 'en' ? "localStorage.setItem('a4b-lang','en')" : undefined });
    const m = await p.evaluate(() => {
      const sec = [...document.querySelectorAll('[data-lang-section]')].find((s) => !s.hidden);
      const h2 = sec.querySelector('h2'); const h2px = parseFloat(getComputedStyle(h2).fontSize);
      return [...sec.querySelectorAll('h3')].map((h) => {
        const prev = h.previousElementSibling; const gap = h.getBoundingClientRect().top - prev.getBoundingClientRect().bottom;
        return { t: h.textContent.trim().slice(0, 30), px: parseFloat(getComputedStyle(h).fontSize), h2px, gap, prev: prev.tagName };
      });
    });
    zapisz(m.length >= 4, `${url} ${lang} ${w}px: pytań FAQ ${m.length}`);
    for (const x of m) zapisz(x.px < x.h2px && (x.prev === 'H2' || x.gap >= 16), `${url} ${lang} ${w}px „${x.t}”: h3 ${x.px} px < h2 ${x.h2px} px; odstęp od ${x.prev} ${x.gap.toFixed(1)} px`);
    await ctx.close();
  }
});
