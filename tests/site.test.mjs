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
    if (!dir && e.name === 'docs') continue; // D-006: docs/ to dokumentacja i makiety projektu, nie strona; makiety usuwane przed scaleniem z main
    const rel = dir ? `${dir}/${e.name}` : e.name; // ukośnik zamiast path.join: te same nazwy na Windows i w CI (ubuntu)
    if (e.isDirectory()) out.push(...siteFiles(rel));
    else if (SITE_EXT.has(path.extname(e.name))) out.push(rel);
  }
  return out;
}
const FILES = siteFiles();
const HTML = FILES.filter((f) => f.endsWith('.html'));

// Dozwolone domeny w linkach <a href> (użytkownik klika sam; nic nie ładuje się automatycznie).
const LINK_HOSTS = new Set(['www.apple.com', 'apple.com']); // 14.10.2026: polityka i wsparcie Treningu na apps4brew.com/trening/ (bez github.io)
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
    const emails = [...read(f).matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)].map((m) => m[0].replace(/\.+$/, '')); // kropka kończąca zdanie nie należy do adresu
    for (const e of emails) assert.match(e, /^(hello|support)@apps4brew\.com$/, `${f}: obcy e-mail ${e}`);
  }
});

test('bez ciasteczek, analityki i skryptów zewnętrznych; localStorage tylko na język', () => {
  for (const f of FILES) {
    const src = read(f);
    assert.ok(!/document\.cookie/.test(src), `${f}: document.cookie`);
    assert.ok(!/sessionStorage|indexedDB/.test(src), `${f}: inny magazyn przeglądarki`);
    // Analityka w kodzie i zasobach; w treści HTML słowo „analytics” może paść w polityce prywatności („nie używa do … analityki”).
    const code = f.endsWith('.html') ? (src.match(/<script\b[^>]*>[\s\S]*?<\/script>|<(?:link|img|iframe|meta)\b[^>]*>/g) || []).join('\n') : src;
    assert.ok(!/\b(gtag|googletagmanager|analytics|plausible|umami|fbq)\b/i.test(code), `${f}: analityka`);
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
  assert.ok(src.includes('href="trening/support.html"'));
  assert.ok(src.includes('href="trening/privacy.html"'));
  assert.ok(!/github\.io/.test(src), 'stare adresy github.io w stopce');
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

// D-014 (20.10.2026, decyzja właściciela): tytuły Young Serif, treść Source Sans 3, litery tablicy indeksu Barlow Condensed.
test('czcionki lokalne istnieją, każda rodzina ma licencję OFL', () => {
  const css = read('assets/site.css');
  const refs = [...css.matchAll(/url\("\.\.\/(fonts\/[^"]+\.woff2)"\)/g)].map((m) => m[1]);
  assert.ok(refs.length >= 3);
  for (const r of refs) assert.ok(fs.existsSync(path.join(root, r)), `brak ${r}`);
  for (const fam of ['Young Serif', 'Source Sans 3', 'Barlow Condensed']) {
    assert.ok(css.includes(`font-family:"${fam}"`), `brak @font-face ${fam}`);
    const lic = `fonts/LICENSE-${fam.toLowerCase().replace(/ /g, '-')}-OFL.txt`;
    assert.match(read(lic), /SIL OPEN FONT LICENSE Version 1\.1/i, lic);
  }
  // Stare kroje wycofane (D-014): ani pliki, ani odwołania.
  for (const old of ['Bricolage Grotesque', 'Instrument Sans', 'JetBrains Mono']) assert.ok(!css.includes(old), `stary krój ${old} w CSS`);
  const files = fs.readdirSync(path.join(root, 'fonts'));
  assert.ok(!files.some((n) => /bricolage|instrument|jetbrains/i.test(n)), `stare pliki krojów: ${files.join(', ')}`);
});

test('lokalne odwołania w HTML wskazują istniejące pliki', () => {
  for (const f of HTML) {
    const src = read(f);
    for (const m of src.matchAll(/\s(?:src|href)="([^"#:][^"]*)"/g)) {
      if (/^[a-z]+:/i.test(m[1])) continue; // https:, mailto: — sprawdzane w innych testach
      const ref = m[1].split('#')[0]; // kotwice sprawdza osobny test („kotwice w linkach wewnętrznych…”)
      if (ref === '/') continue;
      // Ścieżka od korzenia („/assets/…”) albo względna do katalogu strony (trening/privacy.html → ../assets/…).
      const p = ref.startsWith('/') ? path.join(root, ref.slice(1)) : path.join(root, path.dirname(f), ref);
      assert.ok(fs.existsSync(p), `${f}: brak pliku ${m[1]}`);
    }
  }
});

// 14.10.2026 (decyzja właściciela D-2 A w repo aplikacji, docs/41): polityka prywatności i wsparcie aplikacji Trening pod apps4brew.com/trening/.
// Strony generowane z repo aplikacji (scripts/site/export-apps4brew.mjs) — treść sprawdzają testy tamtego repo; tu: forma, język, kontakt.
const DOCS = ['trening/privacy.html', 'trening/support.html'];

test('trening/: polityka i wsparcie istnieją, oznaczone jako generowane, w szablonie strony marki', () => {
  for (const f of DOCS) {
    const src = read(f);
    assert.ok(HTML.includes(f), `${f}: nie ma na liście stron`);
    assert.match(src, /WYGENEROWANE z repozytorium aplikacji Trening/, f);
    assert.match(src, /<link rel="stylesheet" href="\.\.\/assets\/site\.css">/, f);
    assert.match(src, /<script src="\.\.\/assets\/site\.js"><\/script>/, f);
    assert.match(src, /<a class="logo" href="\.\.\/">/, f);
    assert.match(src, /id="lang-pl"/, f); assert.match(src, /id="lang-en"/, f);
  }
});

test('trening/: sekcja PL i EN (przełącznik pokazuje jedną), bez linków do GitHuba, kontakt tylko support@apps4brew.com', () => {
  for (const f of DOCS) {
    const src = read(f);
    assert.equal((src.match(/<section lang="pl" data-lang-section="pl">/g) || []).length, 1, f);
    assert.equal((src.match(/<section lang="en" data-lang-section="en">/g) || []).length, 1, f);
    assert.ok(!/github\.(com|io)/.test(src.replace(/<!--[\s\S]*?-->/g, '')), `${f}: link do GitHuba`);
    assert.ok(src.includes('href="mailto:support@apps4brew.com"'), f);
    assert.match(src, /\[UWAGA 14\.10\.2026\] Skrzynka support@apps4brew\.com działa dopiero po weryfikacji DSA/, f);
    assert.ok(!/\+?\d{2,3}[ -]?\d{3}[ -]?\d{3}[ -]?\d{3}/.test(src), `${f}: numer telefonu`);
    assert.ok(!/\bul\.\s|\d{2}-\d{3}\s/.test(src), `${f}: adres pocztowy`);
  }
  const js = read('assets/site.js');
  assert.match(js, /\[data-lang-section\]/); assert.match(js, /el\.hidden = el\.getAttribute\('data-lang-section'\) !== l/);
});

test('trening/privacy.html: treść polityki (dane na telefonie, Apple Health, zegarek, zakupy, „Gdy do nas piszesz”) w obu językach', () => {
  const src = read('trening/privacy.html');
  for (const w of ['nie łączy się z internetem', '<h2>Apple Health (opcjonalnie)</h2>', '<h2>Apple Watch (opcjonalnie)</h2>', '<h2>Zakupy (subskrypcja)</h2>', '<h2>Gdy do nas piszesz</h2>', 'Obowiązuje od',
    'does not connect to the internet', '<h2>Apple Health (optional)</h2>', '<h2>Apple Watch (optional)</h2>', '<h2>Purchases (subscription)</h2>', '<h2>When you write to us</h2>', 'Effective']) assert.ok(src.includes(w), w);
});

test('trening/support.html: kontakt, co dołączyć, FAQ; link do polityki względny', () => {
  const src = read('trening/support.html');
  for (const w of ['<h2>Kontakt</h2>', 'Odpowiadamy zwykle w ciągu tygodnia', '<h2>Pytania i odpowiedzi</h2>', '<h2>Contact</h2>', 'We usually reply within a week', '<h2>FAQ</h2>', 'href="privacy.html"']) assert.ok(src.includes(w), w);
});

// 20.10.2026 (decyzja właściciela w repo Piekarza): polityka i wsparcie aplikacji Piekarz pod apps4brew.com/piekarz/, karta „Wkrótce” na stronie głównej.
const PIEKARZ = ['piekarz/privacy.html', 'piekarz/support.html'];

test('piekarz/: szablon strony marki, sekcja PL i EN, kontakt tylko support@apps4brew.com, bez GitHuba', () => {
  for (const f of PIEKARZ) {
    const src = read(f);
    assert.ok(HTML.includes(f), `${f}: nie ma na liście stron`);
    assert.match(src, /<link rel="stylesheet" href="\.\.\/assets\/site\.css">/, f);
    assert.match(src, /<script src="\.\.\/assets\/site\.js"><\/script>/, f);
    assert.match(src, /<a class="logo" href="\.\.\/">/, f);
    assert.equal((src.match(/<section lang="pl" data-lang-section="pl">/g) || []).length, 1, f);
    assert.equal((src.match(/<section lang="en" data-lang-section="en">/g) || []).length, 1, f);
    assert.ok(!/github\.(com|io)/.test(src.replace(/<!--[\s\S]*?-->/g, '')), `${f}: link do GitHuba`);
    assert.ok(src.includes('href="mailto:support@apps4brew.com"'), f);
    assert.match(src, /\[UWAGA 14\.10\.2026\] Skrzynka support@apps4brew\.com działa dopiero po weryfikacji DSA/, f);
  }
});

test('piekarz/privacy.html: dane na telefonie, bez aparatu, zakupy, powiadomienia, „Gdy do nas piszesz” w obu językach', () => {
  const src = read('piekarz/privacy.html');
  for (const w of ['nie łączy się z internetem', '<h2>Aparat i inne uprawnienia</h2>', '<h2>Zakupy (subskrypcja albo zakup dożywotni)</h2>', '<h2>Powiadomienia</h2>', '<h2>Gdy do nas piszesz</h2>', 'Obowiązuje od',
    'does not connect to the internet', '<h2>Camera and other permissions</h2>', '<h2>Purchases (subscription or lifetime purchase)</h2>', '<h2>Notifications</h2>', '<h2>When you write to us</h2>', 'Effective']) assert.ok(src.includes(w), w);
});

test('piekarz/support.html: kontakt bez obietnicy czasu odpowiedzi, FAQ z jednostkami, link do polityki względny', () => {
  const src = read('piekarz/support.html');
  for (const w of ['<h2>Kontakt</h2>', '<h2>Pytania i odpowiedzi</h2>', '<h2>Contact</h2>', '<h2>FAQ</h2>', 'Fahrenheita', 'Fahrenheit', 'href="privacy.html"']) assert.ok(src.includes(w), w);
  assert.ok(!/w ciągu (tygodnia|\d+)|within (a week|\d+)|24[–-]48/i.test(src.replace(/<!--[\s\S]*?-->/g, '')), 'obietnica czasu odpowiedzi');
});

// 20.10.2026: karty aplikacji w jednym wzorze (ikona, nazwa, meta, trzy cechy, prywatność, linki do polityki i wsparcia pod kartą).
test('karty aplikacji: ten sam wzór i linki do własnej polityki i wsparcia, bez App Store', () => {
  const src = read('index.html');
  for (const [app, start] of [['trening', '<article class="app">'], ['piekarz', '<article class="app" id="piekarz">']]) {
    const i = src.indexOf(start);
    assert.ok(i > 0, `brak karty ${app}`);
    const card = src.slice(i, src.indexOf('</article>', i));
    assert.match(card, /<div class="app-head">\s*<img class="icon" src="assets\/[a-z]+-icon\.(png|svg)" width="64" height="64"/, `${app}: nagłówek z ikoną`);
    assert.match(card, /<div class="meta" data-pl="iPhone · /, `${app}: meta`);
    assert.equal((card.match(/<li /g) || []).length, 3, `${app}: trzy cechy`);
    assert.ok(card.includes(`href="${app}/privacy.html"`) && card.includes(`href="${app}/support.html"`), `${app}: linki pod kartą`);
    assert.ok(!/apps\.apple\.com/.test(card), `${app}: link do App Store`);
  }
});

// ---------------------------------------------------------------------------------------------
// M6, partia 1 (20.10.2026): adresy z App Store Connect, kotwice, dokument/OG, tłumaczenia treści.

// Prosty parser HTML bez zależności: elementy z własnym tekstem i ich przodkowie (atrybuty bywają z „<” i „>”).
const VOID = new Set(['meta', 'link', 'img', 'br', 'hr', 'input', 'source', 'wbr']);
function parseHtml(html) {
  const src = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '');
  const re = /<(\/?)([a-z][\w-]*)((?:\s+[\w:-]+(?:="[^"]*")?)*)\s*(\/?)>|([^<]+)/gi;
  const attrsOf = (a) => Object.fromEntries([...a.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].map((m) => [m[1], m[2] ?? '']));
  const root0 = { tag: '#root', attrs: {}, own: '', skip: false, covered: false };
  const stack = [root0];
  const done = [];
  for (const m of src.matchAll(re)) {
    const top = stack[stack.length - 1];
    if (m[5] !== undefined) { top.own += m[5]; continue; }
    const [, close, tag0, rawAttrs, selfClose] = m;
    const tag = tag0.toLowerCase();
    if (close) {
      let i = stack.length - 1;
      while (i > 0 && stack[i].tag !== tag) i--;
      if (i > 0) while (stack.length > i) done.push(stack.pop());
      continue;
    }
    const attrs = attrsOf(rawAttrs);
    const node = {
      tag, attrs, own: '',
      skip: top.skip || attrs['aria-hidden'] === 'true' || 'data-lang-section' in attrs,
      covered: top.covered || 'data-pl' in top.attrs, // tekst przodka z data-pl jest podmieniany w całości
    };
    if (!VOID.has(tag) && !selfClose) stack.push(node); else done.push(node);
  }
  while (stack.length > 1) done.push(stack.pop());
  return done;
}

// Nazwy własne i znaki, które nie są tekstem do tłumaczenia (adres e-mail, logo, przełącznik PL/EN, nazwy aplikacji i produktów).
function needsTranslation(node) {
  if (node.attrs.id === 'lang-pl' || node.attrs.id === 'lang-en') return false;
  if (/(^|\s)logo(\s|$)/.test(node.attrs.class || '')) return false; // logo = nazwa własna
  const txt = node.own.replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '')
    .replace(/Apps4Brew|Trening|Piekarz|TestFlight|App Store|iPhone/g, '');
  return /\p{L}/u.test(txt);
}
const TEXT_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'a', 'button']);

// Plik z adresami (tests/adresy.txt): ścieżki plików i kotwice z docs/m6/adresy.txt, bez adresów zewnętrznych.
test('adresy z App Store Connect i linków zewnętrznych: każdy plik istnieje, każda kotwica jest id w index.html', () => {
  const lines = read('tests/adresy.txt').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('//'));
  assert.ok(lines.length >= 25, `za mało adresów: ${lines.length}`);
  const idx = read('index.html');
  for (const a of lines) {
    assert.match(a, /^\/(#[\w-]+|[\w./-]*)$/, `adres spoza repo albo zły format: ${a}`);
    if (a.startsWith('/#')) {
      assert.ok(new RegExp(`\\sid="${a.slice(2)}"`).test(idx), `index.html: brak id="${a.slice(2)}" (kotwica ${a})`);
    } else {
      const file = a === '/' ? 'index.html' : a.slice(1);
      assert.ok(fs.existsSync(path.join(root, file)), `brak pliku dla adresu ${a}`);
    }
  }
  for (const must of ['/', '/trening/privacy.html', '/trening/support.html', '/piekarz/privacy.html', '/piekarz/support.html', '/404.html']) {
    assert.ok(lines.includes(must), `adresy.txt bez ${must}`);
  }
});

test('kotwice w linkach wewnętrznych: każde #id wskazuje istniejący element w docelowym pliku, id są unikalne', () => {
  for (const f of HTML) {
    const src = read(f);
    const ids = [...src.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, `${f}: powtórzone id ${ids.filter((x, i) => ids.indexOf(x) !== i).join(', ')}`);
    for (const m of src.matchAll(/\shref="([^"]*)#([^"]+)"/g)) {
      if (/^[a-z]+:/i.test(m[1])) continue; // linki zewnętrzne i mailto
      let target = f;
      if (m[1]) {
        const ref = m[1].endsWith('/') ? m[1] + 'index.html' : m[1];
        target = (ref.startsWith('/') ? ref.slice(1) : path.posix.join(path.posix.dirname(f), ref));
      }
      assert.ok(fs.existsSync(path.join(root, target)), `${f}: link #${m[2]} do nieistniejącego pliku ${target}`);
      assert.ok(new RegExp(`\\sid="${m[2]}"`).test(read(target)), `${f}: kotwica #${m[2]} nie istnieje w ${target}`);
    }
  }
});

test('każda strona: lang na <html>, unikalny <title>, niepusty opis, brak powtórzonych opisów', () => {
  const titles = new Map(); const descs = new Map();
  for (const f of HTML) {
    const src = read(f);
    assert.match(src, /<html lang="(pl|en)">/, `${f}: lang`);
    const t = (src.match(/<title[^>]*>([^<]+)<\/title>/) || [])[1];
    const d = (src.match(/<meta name="description" content="([^"]+)"/) || [])[1];
    assert.ok(t && t.trim().length >= 5, `${f}: tytuł`);
    assert.ok(d && d.trim().length >= 40, `${f}: opis (min. 40 znaków)`);
    assert.ok(!titles.has(t), `${f}: tytuł taki sam jak w ${titles.get(t)}`); titles.set(t, f);
    assert.ok(!descs.has(d), `${f}: opis taki sam jak w ${descs.get(d)}`); descs.set(d, f);
  }
});

test('index.html: canonical i cztery tagi Open Graph; obraz OG 1200×630 PNG z zadeklarowanymi wymiarami', () => {
  const idx = read('index.html');
  assert.match(idx, /<link rel="canonical" href="https:\/\/apps4brew\.com\/">/);
  for (const p of ['og:title', 'og:type', 'og:image', 'og:url']) assert.match(idx, new RegExp(`<meta property="${p}" content="[^"]+">`), p);
  assert.match(idx, /<meta property="og:image" content="https:\/\/apps4brew\.com\/assets\/og-image\.png">/);
  assert.match(idx, /<meta property="og:image:width" content="1200">/);
  assert.match(idx, /<meta property="og:image:height" content="630">/);
  const png = fs.readFileSync(path.join(root, 'assets/og-image.png'));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [1200, 630], 'wymiary og-image.png');
});

// Partia 2: podstrony dostają canonical i Open Graph w nowym szablonie (jeszcze ich nie zmieniamy).
test('podstrony: canonical własnego adresu i Open Graph (og:title, og:type, og:image, og:url)', { todo: 'partia 2: podstrony w nowym szablonie' }, () => {
  for (const f of HTML.filter((x) => x !== 'index.html')) {
    const src = read(f);
    assert.match(src, /<link rel="canonical" href="https:\/\/apps4brew\.com\/[^"]*">/, `${f}: canonical`);
    for (const p of ['og:title', 'og:type', 'og:image', 'og:url']) assert.match(src, new RegExp(`<meta property="${p}" content="[^"]+">`), `${f}: ${p}`);
  }
});

// E1-01 (P1, docs/m6/e1-sprawdzenie.md): sześć zasad „Jak robimy aplikacje” w podglądzie nie miało wersji EN, a test par data-pl/data-en
// tego nie łapał (brak atrybutów to nie para). Ten test wymaga pary przy każdym tekście treści strony głównej.
test('E1-01: index.html — każdy tekst treści (h1–h6, p, li, a, button) ma parę data-pl i data-en', () => {
  const bad = parseHtml(read('index.html'))
    .filter((n) => TEXT_TAGS.has(n.tag) && !n.skip && !n.covered && needsTranslation(n))
    .filter((n) => !('data-pl' in n.attrs && 'data-en' in n.attrs))
    .map((n) => `<${n.tag}> „${n.own.trim().replace(/\s+/g, ' ').slice(0, 50)}”`);
  assert.deepEqual(bad, [], `${bad.length} tekstów bez pary data-pl/data-en`);
});

test('E1-01: sześć zasad „Jak robimy aplikacje” ma PL i EN dosłownie jak na dotychczasowej stronie (tests/zasady.json)', () => {
  const how = read('index.html');
  const sec = how.slice(how.indexOf('id="how"'), how.indexOf('id="index"'));
  const items = parseHtml(sec).filter((n) => n.tag === 'li' || n.tag === 'h3' || n.tag === 'p');
  const zasady = JSON.parse(read('tests/zasady.json'));
  assert.equal(zasady.length, 6);
  for (const z of zasady) {
    for (const [tag, v] of [['h3', z.h3], ['p', z.p]]) {
      const n = items.find((x) => x.tag === tag && x.attrs['data-pl'] === v.pl);
      assert.ok(n, `brak <${tag}> z data-pl „${v.pl.slice(0, 40)}”`);
      assert.equal(n.attrs['data-en'], v.en, `<${tag}> „${v.pl.slice(0, 40)}”: data-en inne niż dotychczas`);
      assert.equal(n.own.trim(), v.pl, `<${tag}>: treść domyślna (PL) inna niż data-pl`);
    }
  }
});
