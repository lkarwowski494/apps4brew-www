// fix-n1-stopka-tekst200.mjs — N-1 (P3, z weryfikacji po naprawach): przy tekście 200 % i szerokości 320 px adres support@apps4brew.com w stopce
// poszerzał stronę (~340 px). Warunek: scrollWidth == 320 na 6 stronach, PL i EN, tekst 100 % i 200 % (CDP Page.setFontSizes 32 px = 200 % z 16 px);
// dodatkowo przy 1440 px stopka nie łamie adresu (jeden wiersz) i scrollWidth == 1440.
import { uruchom, otworz, SZEST } from './fix-wspolne.mjs';

await uruchom('N-1', async (b, zapisz) => {
  for (const lang of ['pl', 'en']) for (const url of SZEST) for (const tekst of [100, 200]) {
    const { ctx, p } = await otworz(b, url, { w: 320, h: 800, init: lang === 'en' ? "localStorage.setItem('a4b-lang','en')" : undefined });
    if (tekst === 200) { const cdp = await ctx.newCDPSession(p); await cdp.send('Page.setFontSizes', { fontSizes: { standard: 32, fixed: 26 } }); await p.waitForTimeout(150); }
    const sw = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, fs: parseFloat(getComputedStyle(document.body).fontSize) }));
    zapisz(sw.sw === 320 && sw.iw === 320, `${url} ${lang} 320px tekst ${tekst}% (body ${sw.fs}px): scrollWidth ${sw.sw}`);
    await ctx.close();
  }
  for (const lang of ['pl', 'en']) for (const url of SZEST.filter((u) => u !== '404.html')) {
    const { ctx, p } = await otworz(b, url, { w: 1440, h: 900, init: lang === 'en' ? "localStorage.setItem('a4b-lang','en')" : undefined });
    const m = await p.evaluate(() => { const a = [...document.querySelectorAll('.stopka a')].find((x) => x.textContent.includes('support@')); return { sw: document.documentElement.scrollWidth, h: a ? a.getClientRects().length : -1 }; });
    zapisz(m.sw === 1440 && m.h === 1, `${url} ${lang} 1440px: scrollWidth ${m.sw}, adres w ${m.h} wierszu/ach`);
    await ctx.close();
  }
});
