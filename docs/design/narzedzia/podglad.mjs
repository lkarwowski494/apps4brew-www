// podglad.mjs — składa wzorcową stronę A2 (E3 roli 04) w układzie katalogów strony: docs/design/system/podglad/
// użycie: node docs/design/narzedzia/podglad.mjs   (z katalogu repo strony)
// Treść: index.html i podstrony z repo (bez zmian treści); układ i style: docs/design/system/site.css, site.js.
// Adresy, kotwice (#apps #piekarz #how #index #about #top #main) i identyfikatory skryptu (lang-pl/en, copy, addr, copy-status) jak na obecnej stronie.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { T } from './kierunki.mjs';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const sys = resolve(repo, 'docs/design/system');
const out = resolve(sys, 'podglad');
for (const d of ['', 'assets', 'fonts', 'trening', 'piekarz']) mkdirSync(join(out, d), { recursive: true });

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const t = ([pl, en], tag = 'span', at = '') => `<${tag}${at} data-pl="${esc(pl)}" data-en="${esc(en)}">${pl}</${tag}>`;

// Element firmowy: droga ziarna. Dane: etap aplikacji (indeks w ETAPY). Opis tekstowy dla czytnika w aria-label.
const ETAPY = [
  ['zbior', ['Zbiór', 'Harvest'], ['research', 'research']],
  ['obrobka', ['Obróbka', 'Processing'], ['projekt', 'design']],
  ['palenie', ['Palenie', 'Roasting'], ['budowa z testami', 'build with tests']],
  ['parzenie', ['Parzenie', 'Brewing'], ['testy z ludźmi (TestFlight)', 'testing with people (TestFlight)']],
  ['podanie', ['Podanie', 'Served'], ['App Store', 'App Store']],
];
export const ETAP = { trening: 3, piekarz: 3 }; // dane: obie aplikacje w TestFlight (inwentarz M6, 20.10.2026)
const droga = (nazwa, e) => {
  const opis = (j) => j === 0
    ? `Droga aplikacji ${nazwa}: etap ${e + 1} z 5, ${ETAPY[e][1][0].toLowerCase()}, czyli ${ETAPY[e][2][0]}.`
    : `${nazwa} path: stage ${e + 1} of 5, ${ETAPY[e][1][1].toLowerCase()}, that is ${ETAPY[e][2][1]}.`;
  return `<figure class="droga" role="img" aria-label="${esc(opis(0))}" data-label-pl="${esc(opis(0))}" data-label-en="${esc(opis(1))}">
      <span class="droga-pasek">${ETAPY.map(([k, n, s], i) => `<span class="d-${k}${i <= e ? ' zrobione' : ''}${i === e ? ' teraz' : ''}">${t(n, 'span', ' class="d-nazwa"')}${t(s, 'span', ' class="d-studio"')}</span>`).join('')}</span>
    </figure>`;
};

// Tablica z wsuwanymi literami (D-011): litery w <i>, teksty w data-tab-pl/en (zmienia je site.js przy zmianie języka).
const litery = (s) => [...s].map((c) => `<i>${c === ' ' ? '&nbsp;' : esc(c)}</i>`).join('');
const rzad = (...k) => `<p class="rzad">${k.map(([pl, en]) => `<span class="litery" data-tab-pl="${esc(pl)}" data-tab-en="${esc(en)}">${litery(pl)}</span>`).join('')}</p>`;
const tablica = () => `<div class="tablica" aria-hidden="true"><div class="filc">
        ${rzad(['ESPRESSO', 'ESPRESSO'])}
        ${T.ind.map(([pl, en, lok]) => rzad([pl.toUpperCase(), en.toUpperCase()], [lok.toUpperCase(), lok.toUpperCase()])).join('\n        ')}
        ${rzad([' ', ' '])}
        ${rzad(['APLIKACJA', 'AN APP'], ['< 1 ESPRESSO', '< 1 ESPRESSO'])}
      </div></div>`;

const naglowek = (root, menu = true) => `<header class="naglowek">
  <a class="logo" href="${root}">Apps4Brew</a>
  ${menu ? `<nav class="menu" aria-label="Sekcje" data-label-pl="Sekcje" data-label-en="Sections"><ul>
    <li><a href="#apps" data-pl="Aplikacje" data-en="Apps">Aplikacje</a></li>
    <li><a href="#how" data-pl="Jak robimy" data-en="How we work">Jak robimy</a></li>
    <li><a href="#index" data-pl="Indeks espresso" data-en="Espresso index">Indeks espresso</a></li>
    <li><a href="#about" data-pl="Studio" data-en="About">Studio</a></li>
  </ul></nav>` : ''}
  <div class="jezyk" role="group" aria-label="Język / Language">
    <button type="button" id="lang-pl" aria-pressed="true" lang="pl" aria-label="Polski">PL</button>
    <button type="button" id="lang-en" aria-pressed="false" lang="en" aria-label="English">EN</button>
  </div>
</header>`;

const stopka = (r) => `<footer class="stopka">
  <span>© 2026 Apps4Brew, Warszawa</span>
  <nav data-label-pl="Stopka" data-label-en="Footer" aria-label="Stopka"><ul>
    <li><a href="${r}trening/support.html" data-pl="Wsparcie" data-en="Support">Wsparcie</a> <a href="${r}trening/privacy.html" data-pl="Prywatność" data-en="Privacy">Prywatność</a>: Trening</li>
    <li><a href="${r}piekarz/support.html" data-pl="Wsparcie" data-en="Support">Wsparcie</a> <a href="${r}piekarz/privacy.html" data-pl="Prywatność" data-en="Privacy">Prywatność</a>: Piekarz</li>
    <li><a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" data-pl="Warunki" data-en="Terms">Warunki</a></li>
    <li><a href="mailto:support@apps4brew.com">support@apps4brew.com</a></li>
  </ul></nav>
</footer>`;

const karta = (a, id) => {
  const meta = [a.meta.map((m) => m[0]).join(' · '), a.meta.map((m) => m[1]).join(' · ')];
  return `<article class="app"${id ? ` id="${id}"` : ''}>
      <div class="app-head">
        <img class="icon" src="assets/${a.id}-icon.${a.id === 'trening' ? 'png' : 'svg'}" width="64" height="64" alt="${esc(a.nazwa[0])}" data-alt-pl="${esc(a.nazwa[0])}" data-alt-en="${esc(a.nazwa[1])}">
        ${t(a.nazwa, 'h3')}
      </div>
      <div class="app-tresc">
        ${droga(a.krotka, ETAP[a.id])}
        <div class="meta" data-pl="${esc(meta[0])}" data-en="${esc(meta[1])}">${meta[0]}</div>
        <ul class="app-cechy">${a.cechy.map((c) => t(c, 'li')).join('')}</ul>
        ${t(T.prywatnosc, 'p', ' class="app-pryw"')}
        <p class="app-linki"><a href="${a.id}/privacy.html" data-pl="Polityka prywatności" data-en="Privacy policy">Polityka prywatności</a> <a href="${a.id}/support.html" data-pl="Wsparcie" data-en="Support">Wsparcie</a></p>
      </div>
    </article>`;
};

// index.html: <head> z obecnej strony (CSP, OG, canonical bez zmian), nowe preload i theme-color
const stary = readFileSync(resolve(repo, 'index.html'), 'utf8');
let glowa = stary.slice(0, stary.indexOf('</head>'))
  .replace(/<link rel="preload"[^>]*>\n/g, '')
  .replace('<meta name="theme-color" content="#f7e9dc" media="(prefers-color-scheme: light)">', '<meta name="theme-color" content="#E9EDE0" media="(prefers-color-scheme: light)">')
  .replace('<meta name="theme-color" content="#2b2420" media="(prefers-color-scheme: dark)">', '<meta name="theme-color" content="#1C1410" media="(prefers-color-scheme: dark)">')
  .replace('<link rel="stylesheet" href="assets/site.css">', '<link rel="preload" href="fonts/young-serif-latin.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="preload" href="fonts/source-sans-3-latin.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="stylesheet" href="assets/site.css">');

const indeksPrzypis = stary.match(/<p[^>]*data-pl="\* Włochy[\s\S]*?<\/p>/)[0].replace(/class="[^"]*"/, 'class="przypis"');

const index = `${glowa}</head>
<body>
<a class="skip" href="#main" data-pl="Przejdź do treści" data-en="Skip to content">Przejdź do treści</a>
${naglowek('./')}
<main id="main">
  <section class="sekcja bohater" id="top" aria-labelledby="h1">
    ${t(T.kto, 'p', ' class="kto"')}
    ${t(T.h1, 'h1', ' id="h1"')}
    <div class="bohater-opis">
      ${t(T.lead, 'p', ' class="lead"')}
      <p class="cta"><a class="przycisk" href="#apps" data-pl="${T.cta1[0]}" data-en="${T.cta1[1]}">${T.cta1[0]}</a> <a class="link-mocny" href="#index" data-pl="${T.cta2[0]}" data-en="${T.cta2[1]}">${T.cta2[0]}</a></p>
    </div>
  </section>
  <section class="sekcja" id="apps" aria-labelledby="apps-h">
    ${t(['Od ziarna do filiżanki', 'From bean to cup'], 'h2', ' id="apps-h"')}
    ${t(['Każda aplikacja przechodzi tę samą drogę. Pasek pokazuje, gdzie jest dziś.', 'Every app takes the same path. The bar shows where it is today.'], 'p', ' class="sekcja-lead"')}
    ${karta(T.apps[0])}
    ${karta(T.apps[1], 'piekarz')}
    <div class="kolejne">${t(T.kolejne, 'p', ' class="kolejne-h"')}${t(T.karta, 'p')}</div>
  </section>
  <section class="sekcja" id="how" aria-labelledby="how-h">
    ${t(T.jakH, 'h2', ' id="how-h"')}
    ${t(T.jakSub, 'p', ' class="podtytul"')}
    ${t(T.jakLead, 'p')}
    <ul class="zasady">${T.zasady.map(([h, p]) => `<li><h3>${h}</h3><p>${p}</p></li>`).join('')}</ul>
  </section>
  <section class="sekcja" id="index" aria-labelledby="index-h">
    ${t(T.indH, 'h2', ' id="index-h"')}
    ${t(T.indSub, 'p', ' class="podtytul"')}
    ${t(T.indLead, 'p')}
    <!-- indeks-espresso:start -->
    <div class="indeks-uklad">
      ${tablica()}
      <div class="indeks-lista">
        ${T.ind.map(([pl, en, lok, usd]) => `<div class="receipt"><span class="kraj" data-pl="${pl}" data-en="${en}">${pl}</span><span class="cena"><span class="etykieta">espresso*</span> ${lok}</span><span class="usd">${usd}</span></div>`).join('\n        ')}
        ${indeksPrzypis}
      </div>
    </div>
    <!-- indeks-espresso:end -->
  </section>
  <section class="sekcja studio" id="about" aria-labelledby="about-h">
    ${t(T.oH, 'h2', ' id="about-h"')}
    ${t(T.oT, 'p')}
    ${t(T.pH, 'h3', ' class="kontakt-h"')}
    ${t(T.pT, 'p')}
    <p class="mail"><a class="addr" id="addr" href="mailto:hello@apps4brew.com">hello@apps4brew.com</a> <button class="kopiuj" type="button" id="copy" data-pl="Kopiuj" data-en="Copy">Kopiuj</button> <span class="sr-only" id="copy-status" role="status" aria-live="polite"></span></p>
  </section>
</main>
${stopka('')}
<script src="assets/site.js"></script>
</body>
</html>
`;
writeFileSync(join(out, 'index.html'), index);

// Podstrony: treść bez zmian; nowy nagłówek, h1 w <main class="dokument">, znak drogi ziarna aplikacji, nowa stopka.
for (const f of ['trening/privacy.html', 'trening/support.html', 'piekarz/privacy.html', 'piekarz/support.html']) {
  const src = readFileSync(resolve(repo, f), 'utf8');
  const app = f.split('/')[0], nazwa = app === 'trening' ? 'Trening' : 'Piekarz';
  const h1 = src.match(/<h1[\s\S]*?<\/h1>/)[0];
  const glowaP = src.slice(0, src.indexOf('<header'));
  const tresc = src.slice(src.indexOf('<main'), src.indexOf('</main>') + 7)
    .replace(/<main[^>]*>/, `<main class="dokument" id="main">\n${h1}\n${droga(nazwa, ETAP[app])}`);
  const koniec = src.slice(src.indexOf('</main>') + 7).replace(/<footer[\s\S]*?<\/footer>/, stopka('../'));
  writeFileSync(join(out, f), `${glowaP}${naglowek('../', false)}\n${tresc}${koniec}`);
}

// 404: absolutne ścieżki /assets/ (GitHub Pages serwuje 404.html z dowolnej ścieżki)
const s404 = readFileSync(resolve(repo, '404.html'), 'utf8');
const g404 = s404.slice(0, s404.indexOf('</head>'));
writeFileSync(join(out, '404.html'), `${g404}</head>
<body>
${naglowek('/', false).replace('href="/"', 'href="/"')}
<main class="blad" id="main">
  <figure class="droga" role="img" aria-label="Droga zakończona przed zbiorem: tej strony nie ma." data-label-pl="Droga zakończona przed zbiorem: tej strony nie ma." data-label-en="The path ends before harvest: this page does not exist."><span class="droga-pasek">${ETAPY.map(([k, n, s]) => `<span class="d-${k}">${t(n, 'span', ' class="d-nazwa"')}${t(s, 'span', ' class="d-studio"')}</span>`).join('')}</span></figure>
  ${t(['Tego ziarna tu nie ma.', 'This bean isn’t here.'], 'h1')}
  ${t(['Nie ma takiej strony. Może adres się zmienił albo zawiera literówkę.', 'There’s no such page. The address may have changed or contain a typo.'], 'p', ' class="lead"')}
  <p class="cta"><a class="przycisk" href="/" data-pl="Strona główna" data-en="Home page">Strona główna</a></p>
</main>
<script src="/assets/site.js"></script>
</body>
</html>
`);

// zasoby: styl, skrypt, ikony aplikacji, obraz OG, kroje z licencjami
copyFileSync(join(sys, 'site.css'), join(out, 'assets/site.css'));
copyFileSync(join(sys, 'site.js'), join(out, 'assets/site.js'));
for (const a of ['trening-icon.png', 'piekarz-icon.svg', 'og-image.png']) copyFileSync(resolve(repo, 'assets', a), join(out, 'assets', a));
for (const a of ['favicon.svg', 'apple-touch-icon.png']) copyFileSync(resolve(repo, 'docs/design/ikona', a), join(out, 'assets', a)); // nowa ikona strony (E3)
const fw = resolve(repo, 'docs/design/fonty/woff2');
for (const f of readdirSync(fw)) copyFileSync(join(fw, f), join(out, 'fonts', f));
console.log('OK podglad:', out);
