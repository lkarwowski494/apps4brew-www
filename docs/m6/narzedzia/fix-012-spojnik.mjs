// fix-012-spojnik.mjs — 04-studio-projektowe-012: w nagłówku ramki „Kolejne aplikacje w przygotowaniu.”
//  (a) żaden wiersz nie kończy się jednoliterowym słowem (polski skład),
//  (b) żadne słowo nie jest łamane w środku (regres po poprawce: „przygotowani | u.” przy 320 px, bo „w przygotowaniu.” jest szersze niż pole
//      ramki, a body ma overflow-wrap:break-word).
// Pomiar: położenie pionowe każdego znaku (Range), szerokości 320–420 co 1 px oraz 599/600/768/1024/1440 px, PL i EN, tekst 100 %.
import { uruchom, otworz } from './fix-wspolne.mjs';

const SZEROKOSCI = [...Array.from({ length: 101 }, (_, i) => 320 + i), 599, 600, 768, 1024, 1440];

await uruchom('04-studio-projektowe-012', async (b, zapisz) => {
  for (const lang of ['pl', 'en']) {
    const { ctx, p } = await otworz(b, 'index.html', { w: 320, h: 900, init: lang === 'en' ? "localStorage.setItem('a4b-lang','en')" : undefined });
    let zle = 0;
    const przyklady = [];
    for (const w of SZEROKOSCI) {
      await p.setViewportSize({ width: w, height: 900 });
      const wynik = await p.evaluate(() => {
        const tn = document.querySelector('.kolejne-h').firstChild; const t = tn.textContent;
        const top = (i) => { const r = document.createRange(); r.setStart(tn, i); r.setEnd(tn, i + 1); return Math.round(r.getBoundingClientRect().top); };
        const ys = [...t].map((_, i) => top(i));
        const rozciete = []; // para sąsiednich znaków słowa (bez zwykłej spacji) w różnych wierszach
        for (let i = 1; i < t.length; i++) if (t[i] !== ' ' && t[i - 1] !== ' ' && Math.abs(ys[i] - ys[i - 1]) >= 4) rozciete.push(`${t.slice(0, i)}|${t.slice(i)}`);
        const linie = [];
        t.split(' ').reduce((i, s) => { const y = ys[i]; const l = linie.find((x) => Math.abs(x.y - y) < 4); if (l) l.s.push(s); else linie.push({ y, s: [s] }); return i + s.length + 1; }, 0);
        const wiersze = linie.map((l) => l.s.join(' '));
        return { rozciete, wiersze };
      });
      const samotne = wynik.wiersze.filter((l) => l.split(' ').pop().replace(/[^\p{L}]/gu, '').length <= 1);
      if (wynik.rozciete.length || samotne.length) { zle++; if (przyklady.length < 3) przyklady.push(`${w}px: ${wynik.rozciete[0] ?? ''} ${samotne.map((s) => `samotne „${s}”`).join(' ')}`); }
    }
    zapisz(zle === 0, `${lang}: ${SZEROKOSCI.length} szerokości bez łamania w środku słowa i bez samotnej litery na końcu wiersza (złych: ${zle}${przyklady.length ? '; np. ' + przyklady.join(' / ') : ''})`);
    await ctx.close();
  }
});
