// fix-014-kopiuj.mjs — 04-studio-projektowe-014: gdy schowek odmówi (albo API nie istnieje), „Kopiuj” zaznacza adres i mówi, co zrobić: przycisk i status (role=status) niepuste, z „Ctrl+C / ⌘C”.
// Regresja: gdy schowek działa, komunikat „Skopiowano” / „Copied”. Bez przewijania w poziomie przy 320 px (przycisk może się zawijać).
import { uruchom, otworz } from './fix-wspolne.mjs';

const warianty = {
  odmowa: "Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new DOMException('Odmowa', 'NotAllowedError')) }, configurable: true });",
  'brak-API': "Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });",
  dziala: "Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.resolve() }, configurable: true });",
};

await uruchom('04-studio-projektowe-014', async (b, zapisz) => {
  for (const [nazwa, init] of Object.entries(warianty)) for (const lang of ['pl', 'en']) for (const w of [320, 390, 1440]) {
    const { ctx, p } = await otworz(b, 'index.html', { w, h: 900, init: (lang === 'en' ? "localStorage.setItem('a4b-lang','en');" : '') + init });
    await p.click('#copy');
    await p.waitForTimeout(150);
    const s = await p.evaluate(() => ({ przycisk: document.getElementById('copy').textContent.trim(), status: document.getElementById('copy-status').textContent.trim(), zaznaczenie: String(getSelection()), sw: document.documentElement.scrollWidth, okno: innerWidth }));
    const opis = `${nazwa} ${lang} ${w}px`;
    if (nazwa === 'dziala') {
      const oczek = lang === 'pl' ? 'Skopiowano' : 'Copied';
      zapisz(s.przycisk === oczek && s.status === oczek, `${opis}: przycisk „${s.przycisk}”, status „${s.status}”`);
    } else {
      zapisz(/Ctrl\+C/.test(s.przycisk) && /Ctrl\+C/.test(s.status), `${opis}: przycisk „${s.przycisk}”, status „${s.status}”`);
      zapisz(s.zaznaczenie === 'hello@apps4brew.com', `${opis}: zaznaczony adres „${s.zaznaczenie}”`);
    }
    zapisz(s.sw <= s.okno, `${opis}: bez przewijania w poziomie (${s.sw} ≤ ${s.okno})`);
    await ctx.close();
  }
});
