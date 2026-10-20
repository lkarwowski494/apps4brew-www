// fix-004-tablica.mjs — 04-studio-projektowe-004: litery tablicy indeksu „wsuwają się” (klasa .wsuwa) przy PIERWSZEJ zmianie języka nowego gościa (D-011).
// Warunki: bez zapisanego języka pierwszy klik „EN” daje wsuwa > 0; z zapisanym EN pierwszy klik „PL” też; przy „Ogranicz ruch” zawsze 0; start bez ruchu (0 przy wczytaniu).
import { uruchom, otworz } from './fix-wspolne.mjs';

await uruchom('04-studio-projektowe-004', async (b, zapisz) => {
  for (const [zapisany, ruch, kliki] of [[null, 'no-preference', ['#lang-en', '#lang-pl']], ['en', 'no-preference', ['#lang-pl', '#lang-en']], [null, 'reduce', ['#lang-en', '#lang-pl']]]) {
    const { ctx, p } = await otworz(b, 'index.html', { w: 1440, h: 900, ctx: { reducedMotion: ruch }, init: zapisany ? `localStorage.setItem('a4b-lang', '${zapisany}')` : undefined });
    const licz = () => p.evaluate(() => document.querySelectorAll('.litery i.wsuwa').length);
    const opis = `zapisany język: ${zapisany ?? 'brak'}, ruch: ${ruch}`;
    zapisz((await licz()) === 0, `${opis}: przy wczytaniu bez ruchu (wsuwa=${await licz()})`);
    for (const [i, k] of kliki.entries()) {
      await p.click(k);
      const n = await licz();
      zapisz(ruch === 'reduce' ? n === 0 : n > 0, `${opis}: klik ${i + 1} (${k}): wsuwa=${n}${ruch === 'reduce' ? ' (oczekiwane 0)' : ' (oczekiwane > 0)'}`);
    }
    await ctx.close();
  }
});
