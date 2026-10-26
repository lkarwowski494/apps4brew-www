// Testy strony apps4brew.com — bez zależności, uruchamiane przez `node --test` w katalogu głównym repo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
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
          // Partia 2: podstrony mają własny canonical (https://apps4brew.com/<ścieżka>); wcześniej test zakładał jeden adres dla wszystkich plików.
          assert.equal(href, 'https://apps4brew.com/' + (f === 'index.html' ? '' : f), `${f}: zły adres kanoniczny`);
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
    // D-026: komentarz „[UWAGA 14.10.2026] Skrzynka … po weryfikacji DSA” usunięty (skrzynka działa); jego brak sprawdza test „D-026”.
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
    // D-026: komentarz „[UWAGA 14.10.2026] Skrzynka … po weryfikacji DSA” usunięty (skrzynka działa); jego brak sprawdza test „D-026”.
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
    assert.match(card, /<div class="meta" data-pl="Na iPhone’a, w 35 językach/, `${app}: meta`); // D-024 (016): zdanie zamiast ciągu „iPhone · …”; format sprawdza test 04-studio-projektowe-016
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

// Partia 2 (20.10.2026, D-020): podstrony dostają canonical i Open Graph; 404 jest noindex i bez canonical.
const SUBPAGES = ['trening/privacy.html', 'trening/support.html', 'trening/espresso.html', 'piekarz/privacy.html', 'piekarz/support.html'];

test('index.html i podstrony: canonical własnego adresu i Open Graph (og:title, og:type, og:image, og:url)', () => {
  for (const f of ['index.html', ...SUBPAGES]) {
    const src = read(f);
    const url = 'https://apps4brew.com/' + (f === 'index.html' ? '' : f);
    assert.ok(src.includes(`<link rel="canonical" href="${url}">`), `${f}: canonical ${url}`);
    assert.equal((src.match(/rel="canonical"/g) || []).length, 1, `${f}: liczba canonical`);
    for (const p of ['og:title', 'og:type', 'og:image', 'og:url']) assert.match(src, new RegExp(`<meta property="${p}" content="[^"]+">`), `${f}: ${p}`);
    assert.ok(src.includes(`<meta property="og:url" content="${url}">`), `${f}: og:url = canonical`);
    assert.ok(src.includes('<meta property="og:image" content="https://apps4brew.com/assets/og-image.png">'), `${f}: og:image`);
    const title = (src.match(/<title[^>]*>([^<]+)<\/title>/) || [])[1];
    assert.ok(src.includes(`<meta property="og:title" content="${title}">`), `${f}: og:title = tytuł strony`);
  }
});

test('404.html: lang, tytuł, opis, noindex, bez canonical', () => {
  const src = read('404.html');
  assert.match(src, /<html lang="pl">/);
  assert.match(src, /<title[^>]*>[^<]{5,}<\/title>/);
  assert.match(src, /<meta name="description" content="[^"]{40,}"/);
  assert.match(src, /<meta name="robots" content="noindex">/);
  assert.ok(!/rel="canonical"/.test(src), '404 nie ma canonical');
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

// ---------------------------------------------------------------------------------------------
// M6, partia 2 (20.10.2026): podstrony, 404, stopka po EN, wspólny szablon, obraz OG.

function outside(f) { return parseHtml(read(f)).filter((n) => !n.skip && !n.covered); }
const shortOf = (n) => `<${n.tag}> „${n.own.trim().replace(/\s+/g, ' ').slice(0, 50)}”`;
const hasPair = (n) => 'data-pl' in n.attrs && 'data-en' in n.attrs;
const footerOf = (f) => { const src = read(f); const a = src.indexOf('<footer'); return a < 0 ? '' : src.slice(a, src.indexOf('</footer>') + 9); };

// Rozszerzenie E1-01: wszystkie strony, wszystko poza sekcjami data-lang-section (te mają osobne wersje PL/EN w treści).
test('E1-01: wszystkie strony — każdy tekst poza sekcjami PL/EN (h1–h6, p, li, a, button) ma parę data-pl i data-en', () => {
  for (const f of HTML) {
    const bad = outside(f).filter((n) => TEXT_TAGS.has(n.tag) && needsTranslation(n) && !hasPair(n)).map(shortOf);
    assert.deepEqual(bad, [], `${f}: ${bad.length} tekstów bez pary data-pl/data-en`);
  }
});

test('E1-01: stopka (index i podstrony) — „Warszawa” → „Warsaw”, nazwy aplikacji → „Training”/„Crust”, żaden inny tekst bez pary', () => {
  for (const f of ['index.html', ...SUBPAGES]) {
    const foot = parseHtml(footerOf(f)).filter((n) => !n.skip && !n.covered);
    assert.ok(foot.length > 5, `${f}: brak stopki`);
    const bad = foot.filter((n) => needsTranslation(n) && !hasPair(n)).map(shortOf);
    assert.deepEqual(bad, [], `${f}: stopka — teksty bez pary data-pl/data-en`);
    const warsaw = foot.find((n) => /^\s*Warszawa\s*$/.test(n.own));
    assert.ok(warsaw, `${f}: stopka bez osobnego elementu „Warszawa”`);
    assert.equal(warsaw.attrs['data-pl'], 'Warszawa', `${f}: data-pl „Warszawa”`);
    assert.equal(warsaw.attrs['data-en'], 'Warsaw', `${f}: data-en „Warsaw”`);
    for (const [pl, en] of [['Trening', 'Training'], ['Piekarz', 'Crust']]) {
      const n = foot.find((x) => x.own.trim() === pl);
      assert.ok(n, `${f}: stopka bez elementu z nazwą ${pl}`);
      assert.deepEqual([n.attrs['data-pl'], n.attrs['data-en']], [pl, en], `${f}: nazwa ${pl} → ${en}`);
    }
    // Żadna nazwa aplikacji nie zostaje gołym tekstem.
    for (const n of foot) if (/Trening|Piekarz/.test(n.own)) assert.ok(n.own.trim() === 'Trening' || n.own.trim() === 'Piekarz', `${f}: nazwa aplikacji w gołym tekście: ${shortOf(n)}`);
  }
});

// Treść polityk i wsparcia przenoszona bez zmian (D-002; zasada M6: treść to decyzja właściciela).
// tests/tresc-podstron.json = skrót sha256 znormalizowanej treści każdej sekcji [data-lang-section] zapisany PRZED zmianą szablonu.
test('treść podstron bez zmian: sekcje PL i EN polityk i wsparcia zgodne z zapisem sprzed zmiany szablonu', () => {
  const zapis = JSON.parse(read('tests/tresc-podstron.json'));
  assert.deepEqual(Object.keys(zapis).sort(), [...SUBPAGES].sort());
  for (const f of SUBPAGES) {
    const src = read(f);
    for (const l of ['pl', 'en']) {
      const sec = [...src.matchAll(new RegExp(`<section lang="${l}" data-lang-section="${l}">([\\s\\S]*?)</section>`, 'g'))];
      assert.equal(sec.length, 1, `${f}: sekcja ${l}`);
      const norm = sec[0][1].replace(/\s+/g, ' ').trim();
      assert.equal(norm.length, zapis[f][l].znakow, `${f} [${l}]: długość treści`);
      assert.equal(crypto.createHash('sha256').update(norm).digest('hex'), zapis[f][l].sha256, `${f} [${l}]: treść zmieniona (początek: ${zapis[f][l].poczatek})`);
    }
  }
});

test('podstrony: nowy nagłówek, main.dokument z h1 i drogą ziarna aplikacji, bez starych klas', () => {
  const stage = { trening: 'Trening', piekarz: 'Piekarz' };
  for (const f of SUBPAGES) {
    const src = read(f);
    const app = f.split('/')[0];
    assert.match(src, /<header class="naglowek">\s*<a class="logo" href="\.\.\/">Apps4Brew<\/a>/, `${f}: nagłówek`);
    assert.match(src, /<div class="jezyk" role="group" aria-label="Język \/ Language">/, `${f}: przełącznik języka`);
    assert.ok(!/class="(hero|doc-hero|bar|lang|wrap|foot|doc)\b/.test(src.replace(/<section[\s\S]*?<\/section>/g, '')), `${f}: stare klasy szablonu`);
    assert.match(src, /<main class="dokument" id="main">\s*<h1 data-pl="[^"]+" data-en="[^"]+">[^<]+<\/h1>\s*<figure class="droga" role="img"/, `${f}: main.dokument → h1 → figure.droga`);
    const fig = src.slice(src.indexOf('<figure class="droga"'), src.indexOf('</figure>'));
    assert.ok(fig.includes(`Droga aplikacji ${stage[app]}: etap 4 z 5`), `${f}: opis drogi z nazwą aplikacji`);
    assert.equal((fig.match(/class="d-(zbior|obrobka|palenie|parzenie|podanie)\b/g) || []).length, 5, `${f}: pięć etapów`);
    assert.equal((fig.match(/\bteraz\b/g) || []).length, 1, `${f}: jeden etap „teraz”`);
    assert.ok(/class="d-parzenie zrobione teraz"/.test(fig), `${f}: etap bieżący = parzenie`);
    assert.ok(src.includes('<footer class="stopka">'), `${f}: stopka`);
    assert.equal((src.match(/<main\b/g) || []).length, 1, `${f}: jeden main`);
  }
});

test('404.html: nagłówek jak na podstronach, main.blad z pustą drogą ziarna, h1 „Tego ziarna tu nie ma.”', () => {
  const src = read('404.html');
  assert.match(src, /<header class="naglowek">\s*<a class="logo" href="\/">Apps4Brew<\/a>/);
  assert.match(src, /<main class="blad" id="main">\s*<figure class="droga" role="img"/);
  assert.match(src, /<h1 data-pl="Tego ziarna tu nie ma\." data-en="This bean isn’t here\.">Tego ziarna tu nie ma\.<\/h1>/);
  const fig = src.slice(src.indexOf('<figure class="droga"'), src.indexOf('</figure>'));
  assert.equal((fig.match(/class="d-(zbior|obrobka|palenie|parzenie|podanie)\b/g) || []).length, 5);
  assert.ok(!/\b(zrobione|teraz)\b/.test(fig), '404: żaden etap drogi nie jest zrobiony');
  assert.match(src, /<a class="przycisk" href="\/" data-pl="Strona główna" data-en="Home page">/);
  assert.ok(!/class="(hero|wrap|nf|btn)\b/.test(src), '404: stare klasy');
  assert.match(src, /<script src="\/assets\/site\.js"><\/script>/);
});

// Szablon przeniesiony do skryptu eksportu (D-017, D-022): wspólne części muszą być identyczne na wszystkich podstronach,
// żeby dało się je wkleić do skryptu raz. Dopuszczalna różnica to wyłącznie ścieżka do aktywnej aplikacji; stopka linkuje do obu
// aplikacji tak samo na każdej podstronie, więc w tej wersji szablonu różnic nie ma wcale.
test('szablon: nagłówek i stopka identyczne na 4 podstronach (poza ścieżkami do aktywnej aplikacji)', () => {
  const part = (f, tag) => {
    const src = read(f); const a = src.indexOf(`<${tag}`);
    assert.ok(a >= 0, `${f}: brak <${tag}>`);
    return src.slice(a, src.indexOf(`</${tag}>`) + tag.length + 3).replace(/\s+/g, ' ');
  };
  for (const tag of ['header', 'footer']) {
    const ref = part(SUBPAGES[0], tag);
    assert.match(ref, tag === 'header' ? /^<header class="naglowek">/ : /^<footer class="stopka">/, `${tag}: nowy szablon`);
    for (const f of SUBPAGES.slice(1)) assert.equal(part(f, tag), ref, `${tag}: ${f} różni się od ${SUBPAGES[0]}`);
  }
  for (const f of SUBPAGES) for (const l of ['trening/support', 'trening/privacy', 'piekarz/support', 'piekarz/privacy']) assert.ok(footerOf(f).includes(`href="../${l}.html"`), `${f}: stopka bez linku ${l}`);
});

test('trening/*.html: komentarz „WYGENEROWANE…” zostaje, pod nim adnotacja o ręcznej zmianie szablonu (D-017, D-022)', () => {
  const line = 'Szablon zmieniony ręcznie w M6 20.10.2026 (D-017, D-022); eksport do zmiany na gałęzi f020-sklep repo trening przed następnym eksportem.';
  for (const f of ['trening/privacy.html', 'trening/support.html']) {
    const src = read(f);
    const i = src.indexOf('<!-- WYGENEROWANE z repozytorium aplikacji Trening');
    assert.ok(i > 0, `${f}: komentarz WYGENEROWANE`);
    const end = src.indexOf('-->', i) + 3;
    assert.ok(src.slice(end).trimStart().startsWith(`<!-- ${line} -->`), `${f}: adnotacja pod komentarzem WYGENEROWANE`);
  }
});

// D-021: osobna kompozycja 1200×630, nie zrzut strony; HTML kompozycji siedzi w skrypcie (bez nowego pliku .html w repo).
test('obraz OG: skrypt renderuje kompozycję przez setContent z lokalnego serwera (D-021), PNG 1200×630', () => {
  const js = read('docs/m6/narzedzia/og-image.mjs');
  assert.match(js, /page\.setContent\(/);
  assert.ok(!/page\.goto\(/.test(js), 'skrypt nie robi zrzutu strony (goto)');
  assert.match(js, /http:\/\/localhost:\$\{port\}\/assets\/site\.css/);
  assert.match(js, /\/fonts\//);
  assert.match(js, /Aplikacje tańsze niż espresso\./);
  for (const w of ['Zbiór', 'Obróbka', 'Palenie', 'Parzenie', 'Podanie']) assert.ok(js.includes(w), `etap ${w}`);
  const png = fs.readFileSync(path.join(root, 'assets/og-image.png'));
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [1200, 630]);
});

// ---------------------------------------------------------------------------------------------
// M6, rola 08 w trybie fix (20.10.2026): zatwierdzone znaleziska weryfikacji 04-studio-projektowe (D-023, D-024).
// Testy wymagające przeglądarki: docs/m6/narzedzia/ (cls-lab.mjs, fix-przegladarka.mjs); tu testy treści i kodu.

// 04-studio-projektowe-001: podmiana kroju przesuwała tekst (CLS lab 0,175 na stronach wsparcia); pomiar: docs/m6/narzedzia/cls-lab.mjs.
test('04-studio-projektowe-001: kroje zastępcze z size-adjust i nadpisaniem metryk stoją w stosach krojów', () => {
  const css = read('assets/site.css');
  for (const fam of ['Source Sans 3', 'Young Serif']) {
    const face = css.match(new RegExp(`@font-face\\{font-family:"${fam} Fallback";([^}]*)\\}`));
    assert.ok(face, `brak @font-face "${fam} Fallback"`);
    for (const prop of ['size-adjust', 'ascent-override', 'descent-override', 'line-gap-override']) assert.match(face[1], new RegExp(`${prop}:`), `${fam} Fallback: brak ${prop}`);
    assert.match(face[1], /src:local\(/, `${fam} Fallback: krój zastępczy z local()`);
  }
  assert.match(css, /--kroj-tresc:"Source Sans 3","Source Sans 3 Fallback",/);
  assert.match(css, /--kroj-tytul:"Young Serif","Young Serif Fallback",/);
});

// 04-studio-projektowe-002: podpisy etapów (px/vw) nie rosły z tekstem; poniżej 600 px na podstronach stoi jeden podpis tekstowy. Pomiar: docs/m6/narzedzia/fix-002-podpisy.mjs.
test('04-studio-projektowe-002: podstrony mają podpis etapu „Etap 4 z 5” (PL/EN), 404 nie; CSS nie zawiera podpisów w vw', () => {
  for (const f of SUBPAGES) {
    const src = read(f);
    assert.match(src, /<\/span><span class="d-etap" data-pl="Etap 4 z 5: parzenie" data-en="Stage 4 of 5: brewing">Etap 4 z 5: parzenie<\/span>\s*<\/figure>/, `${f}: podpis etapu w figurze`);
  }
  assert.ok(!read('404.html').includes('d-etap'), '404: bez podpisu etapu (żaden etap nie jest bieżący)');
  const css = read('assets/site.css');
  assert.ok(!/\.d-nazwa\{[^}]*vw/.test(css), '.d-nazwa: rozmiar w vw nie rośnie z tekstem');
  assert.match(css, /\.dokument \.d-nazwa,\.blad \.d-nazwa\{display:none\}/);
});

// 04-studio-projektowe-003 (D-024): obraz OG pokazywał wszystkie 5 etapów jako ukończone, także „Podanie / App Store”; ma być neutralną legendą drogi.
function decodePng(buf) {
  assert.deepEqual([...buf.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], 'sygnatura PNG');
  let off = 8; let ihdr = null; const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off); const type = buf.toString('latin1', off + 4, off + 8); const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') ihdr = { w: data.readUInt32BE(0), h: data.readUInt32BE(4), depth: data[8], color: data[9], interlace: data[12] };
    if (type === 'IDAT') idat.push(data);
    off += 12 + len;
  }
  assert.equal(ihdr.depth, 8); assert.equal(ihdr.interlace, 0); assert.ok([2, 6].includes(ihdr.color), 'PNG RGB albo RGBA');
  const bpp = ihdr.color === 6 ? 4 : 3; const stride = ihdr.w * bpp;
  const raw = zlib.inflateSync(Buffer.concat(idat)); const px = Buffer.alloc(stride * ihdr.h);
  for (let y = 0; y < ihdr.h; y++) {
    const f = raw[y * (stride + 1)]; const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? px[y * stride + x - bpp] : 0; const b = y ? px[(y - 1) * stride + x] : 0; const c = x >= bpp && y ? px[(y - 1) * stride + x - bpp] : 0;
      let v = line[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const p = a + b - c; const pa = Math.abs(p - a); const pb = Math.abs(p - b); const pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      px[y * stride + x] = v & 255;
    }
  }
  return { w: ihdr.w, h: ihdr.h, bpp, px };
}

test('04-studio-projektowe-003: obraz OG bez wypełnień „zrobione” (barwy etapów), skrypt bez klasy zrobione', () => {
  const css = read('assets/site.css');
  const kolory = ['--e-zbior', '--e-obrobka', '--e-palenie', '--e-parzenie', '--e-podanie'].map((t) => {
    const m = css.match(new RegExp(`:root\\{[\\s\\S]*?${t}:#([0-9A-Fa-f]{6})`)); assert.ok(m, `token ${t}`);
    return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)];
  });
  const img = decodePng(fs.readFileSync(path.join(root, 'assets/og-image.png')));
  assert.deepEqual([img.w, img.h], [1200, 630]);
  const n = kolory.map(() => 0);
  for (let i = 0; i < img.w * img.h; i++) {
    const r = img.px[i * img.bpp]; const g = img.px[i * img.bpp + 1]; const b = img.px[i * img.bpp + 2];
    kolory.forEach((k, j) => { if (r === k[0] && g === k[1] && b === k[2]) n[j]++; });
  }
  // Wypełniony odcinek paska to ok. 200 × 30 = 6000 px jednego koloru; neutralna legenda nie ma żadnego.
  assert.ok(n.every((x) => x < 100), `piksele w barwach etapów zrobionych (zbiór, obróbka, palenie, parzenie, podanie): ${n.join(', ')}`);
  const js = read('docs/m6/narzedzia/og-image.mjs');
  assert.ok(!/class="d-[a-z]+ zrobione"/.test(js), 'skrypt OG: odcinki bez klasy zrobione');
});

// 04-studio-projektowe-005 (D-024): linia praw Apple w stopce każdej strony ze stopką (404 stopki nie ma).
// Źródło (odczyt 20.10.2026): Apple, Marketing Resources and Identity Guidelines, „Include Apple credit lines wherever legal information is provided.”;
// wzór poza USA: „______ and______ are trademarks of Apple Inc.”; „A translation of the legal notice and credit lines (but not the trademarks) can be used in materials distributed outside the U.S.”
test('04-studio-projektowe-005: stopka każdej strony ma linię praw Apple (PL i EN) z użytymi znakami i adresem źródła w komentarzu', () => {
  const pl = 'iPhone, App Store, Apple Watch i Apple Health są znakami towarowymi Apple Inc.';
  const en = 'iPhone, App Store, Apple Watch and Apple Health are trademarks of Apple Inc.';
  for (const f of ['index.html', ...SUBPAGES]) {
    const foot = footerOf(f);
    assert.ok(foot.includes(`<p class="prawa" data-pl="${pl}" data-en="${en}">${pl}</p>`), `${f}: linia praw Apple w stopce`);
    assert.ok(foot.includes('developer.apple.com/app-store/marketing/guidelines/') && foot.includes('20.10.2026') && foot.includes('Include Apple credit lines wherever legal information is provided.'), `${f}: komentarz ze źródłem, datą i cytatem`);
  }
  // Każdy znak Apple użyty w widocznym tekście którejkolwiek strony musi być na liście w linii (lista znaków: Apple Trademark List, odczyt 20.10.2026).
  for (const f of HTML) {
    const vis = read(f).replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ');
    for (const znak of new Set(vis.match(/\b(iPhone|iPad|iPod touch|App Store|Apple Watch|Apple Health|Apple Pay|Apple TV|Apple Pencil|Apple Vision Pro|TestFlight|HealthKit|StoreKit|Siri|MacBook Air|MacBook Pro|iMac|Mac App Store)\b/g) || [])) assert.ok(en.includes(znak) && pl.includes(znak), `${f}: znak ${znak} jest w tekście, ale nie na liście w linii praw`);
  }
});

// 04-studio-projektowe-006: WCAG 2.2, 2.5.3 — nazwa dostępna przycisku zawiera widoczny tekst (Voice Control: „stuknij PL”).
test('04-studio-projektowe-006: nazwa dostępna przycisków PL/EN zaczyna się od widocznego tekstu (6 stron)', () => {
  for (const f of HTML) {
    const przyciski = [...read(f).matchAll(/<button\b[^>]*\bid="lang-(pl|en)"[^>]*>([^<]*)<\/button>/g)];
    assert.equal(przyciski.length, 2, `${f}: dwa przyciski języka`);
    for (const m of przyciski) {
      const label = m[0].match(/aria-label="([^"]*)"/)?.[1];
      const widoczny = m[2].trim();
      assert.ok(label, `${f}: aria-label przycisku ${widoczny}`);
      assert.ok(label.toLowerCase().startsWith(widoczny.toLowerCase()), `${f}: nazwa dostępna „${label}” nie zaczyna się od widocznego „${widoczny}”`);
    }
  }
});

// 04-studio-projektowe-007 (D-024): cele dotykowe linków w stopce i na kartach ≥ 44 px. Pomiar w przeglądarce: docs/m6/narzedzia/fix-007-cele.mjs.
test('04-studio-projektowe-007: CSS stopki i linków kart daje cele ≥ 44 px (padding 12 px + linia ≥ 20 px, min-width 44 px, odstęp 16 px)', () => {
  const css = read('assets/site.css');
  // N-1: do reguły doszło overflow-wrap:anywhere (adres w stopce przy tekście 200 % i 320 px); cele dotykowe bez zmian
  assert.match(css, /\.stopka a\{display:inline-block;min-width:44px;padding-block:var\(--o-3\)(;overflow-wrap:anywhere)?\}/);
  assert.match(css, /\.app-linki a\{display:inline-block;padding-block:var\(--o-3\)\}/);
  assert.match(css, /\.stopka li a\+a\{margin-left:var\(--o-4\)\}/);
});

// 04-studio-projektowe-008: pytania FAQ (h3) w dokumentach mniejsze niż nagłówek sekcji (h2) i z odstępem nad sobą. Pomiar: docs/m6/narzedzia/fix-008-faq.mjs.
test('04-studio-projektowe-008: .dokument h3 ma osobną regułę (rozmiar treści, odstęp ≥ 16 px nad)', () => {
  const css = read('assets/site.css');
  const m = css.match(/\.dokument h3\{font:650 var\(--r-tresc\)\/1\.3 var\(--kroj-tresc\);margin:var\(--o-6\) 0 var\(--o-2\)\}/);
  assert.ok(m, 'reguła .dokument h3');
});

// 04-studio-projektowe-009: wiersze indeksu espresso poniżej 600 px w stałym układzie (siatka, nie zawijanie flex). Pomiar: docs/m6/narzedzia/fix-009-indeks.mjs.
test('04-studio-projektowe-009: poniżej 600 px .receipt to siatka z krajem w pierwszym wierszu i etykietą ceny w osobnej linii', () => {
  const css = read('assets/site.css');
  assert.match(css, /@media \(max-width:599px\)\{\.receipt\{display:grid;grid-template-columns:minmax\(0,1fr\) auto;gap:var\(--o-1\) var\(--o-4\)\}\.receipt\{align-items:end\}\.receipt \.kraj\{grid-column:1\/-1\}/);
  assert.match(css, /\.receipt \.etykieta\{display:block\}\}/);
});

// 04-studio-projektowe-010 (D-024): w wersji EN nazwy aplikacji ze sklepu: „Training” i „Crust” (bez „Trening”, „Piekarz”, „Crust (Piekarz)”) w szablonie stron.
// Poza zakresem: sekcje [data-lang-section] to treść generowana z repo aplikacji (zob. test „treść podstron bez zmian”) — tam „Trening” zostaje do zmiany eksportu (D-022).
test('04-studio-projektowe-010: teksty EN poza sekcjami treści używają nazw „Training” i „Crust”', () => {
  for (const f of HTML) {
    const src = read(f).replace(/<section lang="(?:pl|en)" data-lang-section="(?:pl|en)">[\s\S]*?<\/section>/g, '').replace(/<!--[\s\S]*?-->/g, '');
    const en = [...src.matchAll(/\sdata-(?:en|alt-en|label-en|content-en)="([^"]*)"/g)].map((m) => m[1]);
    assert.ok(en.length > 5, `${f}: teksty EN`);
    for (const t of en) assert.ok(!/Trening|Piekarz/.test(t), `${f}: nazwa polska w tekście EN: „${t.slice(0, 70)}”`);
  }
  const index = read('index.html');
  assert.ok(index.includes('data-en="Training: Gym Log &amp; Rest Timer"') && index.includes('data-en="Crust: Sourdough Baking"') && index.includes('data-alt-en="Crust: Sourdough Baking"'));
  assert.ok(index.includes('data-label-en="Training path: stage 4 of 5') && index.includes('data-label-en="Crust path: stage 4 of 5'));
  for (const [f, app, tytul] of [['trening/privacy.html', 'Training', 'Privacy Policy'], ['trening/support.html', 'Training', 'Support'], ['piekarz/privacy.html', 'Crust', 'Privacy Policy'], ['piekarz/support.html', 'Crust', 'Support']]) {
    const src = read(f);
    assert.ok(src.includes(`data-en="${app} — ${tytul} — Apps4Brew"`), `${f}: tytuł EN`);
    assert.ok(src.includes(`<h1 data-pl="`) && src.includes(`data-en="${app} — ${tytul}">`), `${f}: h1 EN`);
    assert.ok(src.includes(`data-label-en="${app} path: stage 4 of 5`), `${f}: opis drogi EN`);
  }
  // D-029: sekcje EN w piekarz/ (treść utrzymywana ręcznie w tym repo) też bez „Piekarz” w nazwie aplikacji („The Crust app”, nie „The Crust (Piekarz) app”).
  // trening/ nadal wyłączone: treść z eksportu repo aplikacji, nazwa „Trening” zostaje do zmiany eksportu (D-022).
  for (const f of HTML.filter((x) => x.startsWith('piekarz/'))) {
    const sec = [...read(f).matchAll(/<section lang="en" data-lang-section="en">([\s\S]*?)<\/section>/g)];
    assert.equal(sec.length, 1, `${f}: sekcja EN`);
    const tekst = sec[0][1].replace(/<!--[\s\S]*?-->/g, '');
    assert.ok(!/Piekarz/.test(tekst), `${f}: nazwa polska w sekcji EN: „${(tekst.match(/.{0,30}Piekarz.{0,30}/) || [''])[0]}”`);
  }
});

// 04-studio-projektowe-011: tryb wymuszonych kolorów — stan „zrobione” i punktory listy cech. Pomiar w przeglądarce: docs/m6/narzedzia/fix-011-forced-colors.mjs.
test('04-studio-projektowe-011: @media (forced-colors: active) wypełnia „zrobione” i punktory kolorem systemowym', () => {
  const css = read('assets/site.css');
  const od = css.indexOf('@media (forced-colors:active){');
  assert.ok(od > 0, 'blok forced-colors');
  const blok = css.slice(od);
  assert.match(blok, /\.droga-pasek>span\.zrobione::before\{background:CanvasText;forced-color-adjust:none\}/);
  assert.match(blok, /\.app-cechy li::before\{background:CanvasText;forced-color-adjust:none\}/);
});

// 04-studio-projektowe-012: jednoliterowy przyimek „w” nie kończy wiersza nagłówka ramki (twarda spacja, text-wrap: balance). Pomiar: docs/m6/narzedzia/fix-012-spojnik.mjs.
test('04-studio-projektowe-012: „Kolejne aplikacje w przygotowaniu.” z twardą spacją po „w” (PL), nagłówek ramki z text-wrap: balance', () => {
  const src = read('index.html');
  assert.ok(src.includes('data-pl="Kolejne aplikacje w&nbsp;przygotowaniu." data-en="More apps are brewing.">Kolejne aplikacje w&nbsp;przygotowaniu.</p>'));
  assert.match(read('assets/site.css'), /\.kolejne-h\{[^}]*text-wrap:balance\}/);
});

// 04-studio-projektowe-013: podstrony mają w <head> to samo co strona główna: apple-touch-icon, theme-color (jasny i ciemny), twitter:card (404 pomijamy: noindex).
test('04-studio-projektowe-013: <head> podstron ma apple-touch-icon, theme-color i twitter:card jak index.html', () => {
  for (const f of SUBPAGES) {
    const head = read(f).slice(0, read(f).indexOf('</head>'));
    assert.ok(head.includes('<link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">'), `${f}: apple-touch-icon`);
    assert.ok(head.includes('<meta name="theme-color" content="#E9EDE0" media="(prefers-color-scheme: light)">'), `${f}: theme-color jasny`);
    assert.ok(head.includes('<meta name="theme-color" content="#1C1410" media="(prefers-color-scheme: dark)">'), `${f}: theme-color ciemny`);
    assert.ok(head.includes('<meta name="twitter:card" content="summary_large_image">'), `${f}: twitter:card`);
  }
});

// 04-studio-projektowe-014: „Kopiuj” z komunikatem w ścieżce zapasowej (schowek odmówił). Pomiar w przeglądarce: docs/m6/narzedzia/fix-014-kopiuj.mjs.
test('04-studio-projektowe-014: site.js — ścieżka zapasowa kopiowania pokazuje komunikat PL i EN w przycisku i statusie', () => {
  const js = read('assets/site.js');
  assert.ok(js.includes('Adres zaznaczony — skopiuj go (Ctrl+C / ⌘C)') && js.includes('Address selected — copy it (Ctrl+C / ⌘C)'));
  assert.match(js, /var sel = function \(\) \{[\s\S]*?say\(/, 'sel() wywołuje say()');
});

// 04-studio-projektowe-015: wartości wyglądu tylko z tokenów w CSS — bez atrybutu style= w HTML (SP-03).
test('04-studio-projektowe-015: brak atrybutu style= w HTML stron; odstęp przypisu indeksu z tokenu --o-6', () => {
  for (const f of HTML) assert.ok(!/\sstyle="/.test(read(f)), `${f}: atrybut style=`);
  assert.match(read('assets/site.css'), /\.indeks-lista \.przypis\{margin-top:var\(--o-6\)\}/);
});

// 04-studio-projektowe-016 (D-024): linia stanu aplikacji na karcie jako zwykłe zdanie (PL i EN), nie ciąg „A · B · C”.
test('04-studio-projektowe-016: linia .meta kart aplikacji to zdania, bez ciągu „·” (PL i EN)', () => {
  const src = read('index.html');
  const metas = [...src.matchAll(/<div class="meta" data-pl="([^"]*)" data-en="([^"]*)">([^<]*)<\/div>/g)];
  assert.equal(metas.length, 2, 'dwie karty');
  for (const m of metas) {
    for (const t of [m[1], m[2], m[3]]) {
      assert.ok(!t.includes('·'), `ciąg „·” w linii stanu: „${t}”`);
      assert.match(t, /\.$/, `linia stanu kończy się kropką: „${t}”`);
    }
    assert.equal(m[3], m[1], 'treść domyślna = data-pl');
  }
  assert.deepEqual(metas.map((m) => [m[1], m[2]]), [
    ['Na iPhone’a, w 35 językach. W App Store jesienią 2026.', 'For iPhone, in 35 languages. In the App Store in autumn 2026.'],
    ['Na iPhone’a, w 35 językach przed wydaniem.', 'For iPhone, in 35 languages before release.'],
  ]);
});

// D-026 (20.10.2026, właściciel: „e-mail już działa”): komentarze robocze o skrzynce niedziałającej do weryfikacji DSA usunięte z podstron.
test('D-026: w HTML brak komentarza „[UWAGA 14.10.2026] Skrzynka … działa dopiero po weryfikacji DSA”', () => {
  // Sprawdza tylko komentarze HTML: od 21.10.2026 polityka Treningu wymienia Google Workspace jako odbiorcę danych (decyzja właściciela, M8 Q5/Q10).
  for (const f of HTML) {
    const komentarze = (read(f).match(/<!--[\s\S]*?-->/g) || []).join('\n');
    assert.ok(!/UWAGA 14\.10\.2026|weryfikacji DSA|Google Workspace/.test(komentarze), `${f}: komentarz o skrzynce support@ (D-026)`);
    assert.ok(!/UWAGA 14\.10\.2026|weryfikacji DSA/.test(read(f)), `${f}: uwaga o skrzynce support@ (D-026)`);
  }
});

// B-01/B-02 audytu 1.0 (26.10.2026): adresy wpisane w aplikację Trening (PRIVACY_URL, SUPPORT_URL, ESPRESSO_URL, marketingUrl) muszą istnieć;
// publicznie bez „TestFlight” i bez haseł o oparciu na badaniach (decyzja właściciela 25.10.2026: zero wzmianek o źródłach).
test('B-01: trening/espresso.html, privacy.html i support.html istnieją, mają treść PL i EN', () => {
  for (const f of ['trening/espresso.html', 'trening/privacy.html', 'trening/support.html']) {
    assert.ok(fs.existsSync(path.join(root, f)), `brak ${f}`);
    const src = read(f);
    assert.match(src, /<section lang="pl" data-lang-section="pl">/, `${f}: sekcja PL`);
    assert.match(src, /<section lang="en" data-lang-section="en">/, `${f}: sekcja EN`);
  }
});

test('B-02: żadna strona nie zawiera słów „TestFlight”, „oparte na badaniach”, „based on research”', () => {
  for (const f of HTML) {
    const src = read(f);
    assert.ok(!/TestFlight/i.test(src), `${f}: TestFlight`);
    assert.ok(!/oparte na badaniach|opartych na badaniach|based on research|research-based/i.test(src), `${f}: hasło o oparciu na badaniach`);
  }
});

test('B-01: polityka Treningu zgodna z 1.0 (bez okresu próbnego i przypomnienia o ważeniu), wsparcie opisuje subskrypcję', () => {
  const priv = read('trening/privacy.html');
  assert.ok(!/okres[ua]? próbn|przypomnienie o ważeniu|free trial|weigh-in reminder/i.test(priv), 'polityka: pozostałość po wersji sprzed 1.0');
  const sup = read('trening/support.html');
  assert.ok(sup.includes('Nie ma okresu próbnego') && sup.includes('There is no free trial'), 'wsparcie: sekcja o subskrypcji');
});

test('B-01: linki wewnętrzne (href, src) w trening/*.html prowadzą do istniejących plików i kotwic', () => {
  for (const f of HTML) {
    const dir = path.posix.dirname(f);
    for (const m of read(f).matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const u = m[1];
      if (/^(https?:|mailto:)/.test(u)) continue;
      const [p, hash] = u.split('#');
      const target = p === '' ? f : p.startsWith('/') ? p.slice(1) : path.posix.normalize(path.posix.join(dir, p));
      const file = target === '' || target.endsWith('/') ? target + 'index.html' : target;
      assert.ok(fs.existsSync(path.join(root, file)), `${f}: link do nieistniejącego pliku ${u}`);
      if (hash && file.endsWith('.html')) assert.ok(new RegExp(`\\bid="${hash}"`).test(read(file)), `${f}: brak kotwicy ${u}`);
    }
  }
});
