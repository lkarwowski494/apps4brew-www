// Testy strony apps4brew.com — bez zależności, uruchamiane przez `node --test` w katalogu głównym repo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

// Pliki serwowane jako strona (README i licencje czcionek nie są częścią strony).
const SITE_EXT = new Set(['.html', '.css', '.js', '.svg']);
function siteFiles(dir = '') {
  const out = [];
  for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'tests' || e.name === 'node_modules') continue;
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...siteFiles(rel));
    else if (SITE_EXT.has(path.extname(e.name))) out.push(rel);
  }
  return out;
}
const FILES = siteFiles();
const HTML = FILES.filter((f) => f.endsWith('.html'));

// Dozwolone domeny w linkach <a href> (użytkownik klika sam; nic nie ładuje się automatycznie).
const LINK_HOSTS = new Set(['www.apple.com', 'apple.com', 'lkarwowski494.github.io']);
// Własna domena: tylko adres kanoniczny i tagi Open Graph (muszą być bezwzględne).
const OWN_HOST = 'apps4brew.com';

test('lista plików strony nie jest pusta', () => {
  assert.ok(HTML.includes('index.html'));
  assert.ok(HTML.includes('404.html'));
});

test('brak zewnętrznych zasobów i domen poza dozwolonymi linkami', () => {
  for (const f of FILES) {
    // Przestrzeń nazw SVG to identyfikator, nie zasób sieciowy.
    const src = read(f).replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '');
    const urls = [...src.matchAll(/(?:https?:)?\/\/[a-z0-9.-]+\.[a-z]{2,}[^\s"'()<>]*/gi)].map((m) => m[0]);
    for (const u of urls) {
      const host = new URL(u.startsWith('//') ? 'https:' + u : u).hostname;
      assert.ok(LINK_HOSTS.has(host) || host === OWN_HOST, `${f}: niedozwolona domena ${host} (${u})`);
    }
    if (f.endsWith('.html')) {
      // Zasoby (src, link href, url()) wyłącznie lokalne.
      for (const m of src.matchAll(/\ssrc="([^"]+)"/g)) {
        assert.ok(!/^(https?:)?\/\//.test(m[1]), `${f}: zewnętrzny src ${m[1]}`);
      }
      for (const m of src.matchAll(/<link\b[^>]*>/g)) {
        const href = (m[0].match(/href="([^"]+)"/) || [])[1] || '';
        if (/rel="canonical"/.test(m[0])) {
          assert.equal(href, 'https://apps4brew.com/', `${f}: zły adres kanoniczny`);
        } else {
          assert.ok(!/^(https?:)?\/\//.test(href), `${f}: zewnętrzny <link> ${href}`);
        }
      }
      for (const m of src.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
        const h = m[1];
        if (/^(https?:)?\/\//.test(h)) {
          assert.ok(LINK_HOSTS.has(new URL(h).hostname), `${f}: link do niedozwolonej domeny ${h}`);
        }
      }
      for (const m of src.matchAll(/https?:\/\/apps4brew\.com[^\s"]*/g)) {
        const ctx = src.slice(Math.max(0, m.index - 60), m.index);
        assert.ok(/rel="canonical"|property="og:/.test(ctx), `${f}: bezwzględny adres własnej domeny poza canonical/OG`);
      }
    }
    assert.ok(!/@import/.test(src), `${f}: @import`);
    assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(src), `${f}: Google Fonts`);
  }
});

test('mailto tylko na adresy studia', () => {
  for (const f of HTML) {
    for (const m of read(f).matchAll(/mailto:([^"?]+)/g)) {
      assert.ok(['hello@apps4brew.com', 'support@apps4brew.com'].includes(m[1]), `${f}: mailto ${m[1]}`);
    }
    const emails = [...read(f).matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)].map((m) => m[0]);
    for (const e of emails) assert.match(e, /^(hello|support)@apps4brew\.com$/, `${f}: obcy e-mail ${e}`);
  }
});

test('bez ciasteczek, analityki i skryptów zewnętrznych; localStorage tylko na język', () => {
  for (const f of FILES) {
    const src = read(f);
    assert.ok(!/document\.cookie/.test(src), `${f}: document.cookie`);
    assert.ok(!/sessionStorage|indexedDB/.test(src), `${f}: inny magazyn przeglądarki`);
    assert.ok(!/\b(gtag|googletagmanager|analytics|plausible|umami|fbq)\b/i.test(src), `${f}: analityka`);
    for (const m of src.matchAll(/localStorage\.(setItem|getItem)\('([^']+)'/g)) {
      assert.equal(m[2], 'a4b-lang', `${f}: localStorage z kluczem ${m[2]}`);
    }
  }
});

test('brak słów MAKIETA / MOCKUP', () => {
  for (const f of FILES) assert.ok(!/makieta|mockup/i.test(read(f)), `${f}: zawiera MAKIETA/MOCKUP`);
});

test('CNAME = apps4brew.com i jest .nojekyll', () => {
  assert.equal(read('CNAME').trim(), 'apps4brew.com');
  assert.ok(fs.existsSync(path.join(root, '.nojekyll')));
});

test('każdy element z data-pl ma też data-en (i odwrotnie), tak samo alt/label/content', () => {
  for (const f of HTML) {
    // Atrybuty mogą zawierać „<em>”, więc znacznik czytamy atrybut po atrybucie.
    const tags = read(f).match(/<[a-z][\w-]*(?:\s+[\w:-]+(?:="[^"]*")?)*\s*\/?>/gi) || [];
    for (const t of tags) {
      for (const [pl, en] of [['data-pl', 'data-en'], ['data-alt-pl', 'data-alt-en'], ['data-label-pl', 'data-label-en'], ['data-content-pl', 'data-content-en']]) {
        const hasPl = new RegExp(`\\s${pl}="`).test(t);
        const hasEn = new RegExp(`\\s${en}="`).test(t);
        assert.equal(hasPl, hasEn, `${f}: ${pl}/${en} bez pary w ${t.slice(0, 90)}`);
        if (hasPl) {
          assert.ok(!new RegExp(`\\s${en}=""`).test(t), `${f}: pusty ${en} w ${t.slice(0, 90)}`);
        }
      }
    }
  }
});

test('brak cen aplikacji; kwoty tylko na paragonach indeksu espresso', () => {
  const src = read('index.html');
  const start = src.indexOf('<!-- indeks-espresso:start -->');
  const end = src.indexOf('<!-- indeks-espresso:end -->');
  assert.ok(start > 0 && end > start, 'brak znaczników indeksu espresso');
  const receipts = src.slice(start, end);
  const outside = src.slice(0, start) + src.slice(end);

  // Typowe ceny aplikacji: x,99 / x.99, „/mies.”, „/month”, „zł miesięcznie”.
  const appPrice = /\b\d+[,.]99\b|\/\s*(mies|miesiąc|month|mo|rok|year)\b|(zł|PLN|USD|\$|€)\s*(miesięcznie|rocznie|monthly|per month|a month)/i;
  for (const f of HTML) assert.ok(!appPrice.test(read(f)), `${f}: wygląda na cenę aplikacji: ${read(f).match(appPrice)?.[0]}`);

  // Poza paragonami nie ma żadnych kwot w walutach.
  const money = /\d\s*(zł|PLN|€|EUR|R\$|USD)\b|\$\s?\d|\bR\d/;
  assert.ok(!money.test(outside), `kwota poza indeksem espresso: ${outside.match(money)?.[0]}`);

  // Paragony: cena lokalna i przeliczenie „≈ $”.
  const items = receipts.match(/<div class="receipt">/g) || [];
  assert.ok(items.length >= 4, 'za mało paragonów');
  assert.equal((receipts.match(/≈ \$\d/g) || []).length, items.length, 'każdy paragon ma „≈ $” USD');
  assert.equal((receipts.match(/espresso\*/g) || []).length, items.length, 'każdy paragon ma cenę lokalną espresso');
});

test('sekcja „Jak robimy aplikacje” z zasadą „Jakość od pierwszej linijki”', () => {
  const src = read('index.html');
  assert.ok(src.includes('id="how"'));
  assert.ok(src.includes('Jakość od pierwszej linijki'));
});

test('stopka: linki Wsparcie, Prywatność, Warunki', () => {
  const src = read('index.html');
  assert.ok(src.includes('href="https://lkarwowski494.github.io/trening/support.html"'));
  assert.ok(src.includes('href="https://lkarwowski494.github.io/trening/privacy.html"'));
  assert.ok(src.includes('href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"'));
  assert.ok(!/apps\.apple\.com/.test(src), 'link do App Store przed publikacją aplikacji');
});

test('dokument: doctype, lang, charset, viewport, tytuł, opis, Open Graph', () => {
  for (const f of HTML) {
    const src = read(f);
    assert.match(src, /^<!doctype html>/i, f);
    assert.match(src, /<html lang="pl">/, f);
    assert.match(src, /<meta charset="utf-8">/, f);
    assert.match(src, /<meta name="viewport"/, f);
    assert.match(src, /<title[^>]*>[^<]+<\/title>/, f);
    assert.match(src, /<meta name="description" content="[^"]+"/, f);
  }
  const idx = read('index.html');
  for (const p of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) {
    assert.match(idx, new RegExp(`property="${p}" content="[^"]+"`), p);
  }
});

test('dostępność: alt obrazów, jeden h1, kolejność nagłówków, fokus, reduced motion', () => {
  for (const f of HTML) {
    const src = read(f);
    for (const m of src.matchAll(/<img\b[^>]*>/g)) {
      assert.match(m[0], /\salt="[^"]+"/, `${f}: obraz bez alt: ${m[0].slice(0, 80)}`);
    }
    assert.equal((src.match(/<h1[\s>]/g) || []).length, 1, `${f}: liczba h1`);
    let prev = 0;
    for (const m of src.matchAll(/<h([1-6])[\s>]/g)) {
      const lvl = Number(m[1]);
      assert.ok(lvl <= prev + 1, `${f}: przeskok nagłówka h${prev} → h${lvl}`);
      prev = lvl;
    }
  }
  assert.match(read('index.html'), /<img class="icon"[^>]*alt="Trening: dziennik siłowni"/);
  const css = read('assets/site.css');
  assert.match(css, /:focus-visible\{outline:3px solid var\(--focus\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});

test('czcionki lokalne istnieją, każda rodzina ma licencję OFL', () => {
  const css = read('assets/site.css');
  const refs = [...css.matchAll(/url\("\.\.\/(fonts\/[^"]+\.woff2)"\)/g)].map((m) => m[1]);
  assert.ok(refs.length >= 3);
  for (const r of refs) assert.ok(fs.existsSync(path.join(root, r)), `brak ${r}`);
  for (const fam of ['Bricolage Grotesque', 'Instrument Sans', 'JetBrains Mono']) {
    assert.ok(css.includes(`font-family:"${fam}"`), `brak @font-face ${fam}`);
    const lic = `fonts/LICENSE-${fam.toLowerCase().replace(/ /g, '-')}-OFL.txt`;
    assert.match(read(lic), /SIL OPEN FONT LICENSE Version 1\.1/i, lic);
  }
});

test('lokalne odwołania w HTML wskazują istniejące pliki', () => {
  for (const f of HTML) {
    const src = read(f);
    for (const m of src.matchAll(/\s(?:src|href)="([^"#:][^"]*)"/g)) {
      if (/^[a-z]+:/i.test(m[1])) continue; // https:, mailto: — sprawdzane w innych testach
      const p = m[1].replace(/^\//, '');
      if (p === '') continue;
      assert.ok(fs.existsSync(path.join(root, p)), `${f}: brak pliku ${m[1]}`);
    }
  }
});
