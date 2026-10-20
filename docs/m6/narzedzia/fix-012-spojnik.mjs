// fix-012-spojnik.mjs — 04-studio-projektowe-012: w nagłówku ramki „Kolejne aplikacje w przygotowaniu.” żaden wiersz nie kończy się jednoliterowym słowem (polski skład).
// Pomiar: łamanie wierszy (Range na każdym słowie, grupowanie po współrzędnej y), 320/360/390/600/1024/1440 px, PL i EN.
import { uruchom, otworz } from './fix-wspolne.mjs';

await uruchom('04-studio-projektowe-012', async (b, zapisz) => {
  for (const lang of ['pl', 'en']) for (const w of [320, 360, 390, 600, 1024, 1440]) {
    const { ctx, p } = await otworz(b, 'index.html', { w, h: 900, init: lang === 'en' ? "localStorage.setItem('a4b-lang','en')" : undefined });
    const wiersze = await p.evaluate(() => {
      const el = document.querySelector('.kolejne-h'); const tn = el.firstChild; const t = tn.textContent;
      const slowa = []; const re = /[^\s ]+/g; let m;
      while ((m = re.exec(t))) { const r = document.createRange(); r.setStart(tn, m.index); r.setEnd(tn, m.index + m[0].length); slowa.push({ s: m[0], y: Math.round(r.getBoundingClientRect().top) }); }
      const linie = [];
      for (const s of slowa) { const l = linie.find((x) => Math.abs(x.y - s.y) < 4); if (l) l.slowa.push(s.s); else linie.push({ y: s.y, slowa: [s.s] }); }
      return linie.map((l) => l.slowa.join(' '));
    });
    for (const l of wiersze) {
      const ostatnie = l.split(' ').pop().replace(/[^\p{L}]/gu, '');
      zapisz(ostatnie.length > 1, `${lang} ${w}px wiersz „${l}”: ostatnie słowo „${ostatnie}”`);
    }
    await ctx.close();
  }
});
