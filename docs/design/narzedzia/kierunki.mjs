// kierunki.mjs — generuje makiety E2 (strona główna + polityka prywatności) dla trzech kierunków.
// użycie: node docs/design/narzedzia/kierunki.mjs   (z katalogu repo strony)
// Treść: z inwentarza (index.html, trening/privacy.html); nowe teksty kierunków oznaczone w komentarzach [PROPOZYCJA].
// Wynik: docs/design/kierunki/<k>-glowna.html i <k>-polityka.html (usuwane przed publikacją, D-006).
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const out = resolve(repo, 'docs/design/kierunki');
const A = '../../../assets';

// Treść polityki: prawdziwy plik Treningu, sekcja PL (szablon podstrony ma przyjąć eksport bez zmian struktury).
const priv = readFileSync(resolve(repo, 'trening/privacy.html'), 'utf8');
const polPL = priv.match(/<section lang="pl" data-lang-section="pl">([\s\S]*?)<\/section>/)[1];

const T = {
  nav: [['#aplikacje', 'Aplikacje', 'Apps'], ['#jak', 'Jak robimy', 'How we work'], ['#indeks', 'Indeks espresso', 'Espresso index'], ['#studio', 'Studio', 'About'], ['#kontakt', 'Kontakt', 'Contact']],
  h1: ['Aplikacje tańsze niż espresso.', 'Apps for less than an espresso.'],
  kto: ['Studio aplikacji z Warszawy', 'App studio from Warsaw'],
  lead: ['Robimy małe, dopracowane aplikacje na iPhone’a. Miesięczna subskrypcja kosztuje mniej niż jedno espresso w kawiarni. Bez reklam i bez sprzedawania danych.',
    'We make small, carefully built iPhone apps. A monthly subscription costs less than a single espresso at a café. No ads, no selling your data.'],
  cta1: ['Zobacz aplikacje', 'See the apps'], cta2: ['Indeks espresso', 'Espresso index'],
  apps: [
    { id: 'trening', ikona: `${A}/trening-icon.png`, nazwa: ['Trening: dziennik siłowni', 'Training: Gym Log & Rest Timer'], krotka: 'Trening',
      meta: [['iPhone', 'iPhone'], ['35 języków', '35 languages'], ['TestFlight; App Store jesienią 2026', 'TestFlight; App Store in autumn 2026']],
      cechy: [['Plan tygodnia, kalendarz i generator planu dopasowany do Twojego sprzętu', 'Weekly plan, calendar and a plan generator matched to your equipment'],
        ['Serie, przerwy i postępy — wskazówki oparte na badaniach, nie na modzie', 'Sets, rest and progress — guidance based on research, not trends'],
        ['Apple Health: zapis treningów i odczyt kroków oraz tętna z zegarka', 'Apple Health: saves workouts and reads steps and watch heart rate']],
      wersja: '0.20.0' },
    { id: 'piekarz', ikona: `${A}/piekarz-icon.svg`, nazwa: ['Piekarz: chleb na zakwasie', 'Crust (Piekarz): Sourdough Baking'], krotka: 'Piekarz',
      meta: [['iPhone', 'iPhone'], ['35 języków przed wydaniem', '35 languages before release'], ['TestFlight', 'TestFlight']],
      cechy: [['Od receptury do bochenka: ilości w procencie piekarskim i temperatura wody', 'From recipe to loaf: baker’s percentages and water temperature'],
        ['Pilnuje czasu etapów, także gdy telefon śpi', 'Keeps time for each step, even while your phone sleeps'],
        ['Prowadzenie zakwasu i dziennik wypieków, żeby następny bochenek wyszedł lepiej', 'Starter care and a bake log, so your next loaf turns out better']],
      wersja: '1.0' }],
  prywatnosc: ['Prywatność: bez konta, dane tylko na Twoim telefonie, działa bez internetu.', 'Privacy: no account, data stays on your phone, works offline.'],
  kolejne: ['Kolejne aplikacje w przygotowaniu.', 'More apps are brewing.'],
  karta: ['Każda aplikacja ma własną kartę prywatności — zbieramy tylko to, czego potrzebuje do działania.', 'Every app has its own privacy card — we only collect what it needs to work.'],
  jakH: ['Jak robimy aplikacje', 'How we build apps'],
  jakSub: ['AI na każdym etapie. Dlatego taniej niż espresso.', 'AI at every step. That’s why it costs less than an espresso.'],
  jakLead: ['Pracujemy z AI od researchu po testy. Dzięki temu mały zespół robi to, co zwykle wymaga dużej firmy.', 'We work with AI from research to testing, so a small team can do what usually takes a big company.'],
  zasady: [
    ['Jakość od pierwszej linijki', 'Każda funkcja powstaje razem z testami automatycznymi i według wspólnych wzorców: ta sama czynność wszędzie działa, wygląda i nazywa się tak samo — także dla VoiceOver i w 35 językach. Testy pilnują tego przy każdej zmianie, więc aplikacja zostaje przewidywalna i prosta w obsłudze.'],
    ['Cena niższa niż espresso', 'AI przejmuje powtarzalną pracę, więc zrobienie aplikacji kosztuje mało. Ta oszczędność trafia do Ciebie.'],
    ['Częste, bezpieczne wydania', 'Automatyczne testy i kontrola przed każdą wersją pozwalają wprowadzać poprawki szybko i pod pełną kontrolą.'],
    ['Twój głos zmienia aplikację', 'Czytamy każdą opinię, a AI pomaga je porządkować, żeby żadna prośba nie zginęła. W aplikacjach dla zwykłych ludzi to wciąż rzadkość.'],
    ['Research zamiast zgadywania', 'Funkcje projektujemy na podstawie badań rynku, a to, czego aplikacja uczy, na podstawie badań naukowych.'],
    ['Bez reklam i śledzenia', 'Nie sprzedajemy danych. Każda aplikacja zbiera tylko to, czego potrzebuje do działania.']],
  indH: ['Indeks espresso', 'Espresso index'], indSub: ['Miesiąc tańszy niż espresso.', 'A month for less than an espresso.'],
  indLead: ['Jak indeks Big Maca, tylko z filiżanki. Raz w roku sprawdzamy, ile kosztuje espresso w kawiarniach na różnych kontynentach. Nasza zasada jest prosta: miesięczna subskrypcja każdej aplikacji kosztuje mniej niż jedno espresso.',
    'Like the Big Mac index, but in a cup. Once a year we check what an espresso costs in cafés across continents. Our rule is simple: a monthly subscription to any of our apps costs less than one espresso.'],
  // indeks-espresso: dane z index.html (źródła w przypisie strony), bez zmian
  ind: [['Włochy', 'Italy', '1,08–1,51 €', '≈ $1.21–1.69'], ['Polska', 'Poland', '~9 zł', '≈ $2.29'], ['Brazylia', 'Brazil', '8,31 R$', '≈ $1.66'], ['RPA', 'South Africa', 'R24–30', '≈ $1.45–1.81']],
  indPrzypis: '* Włochy: dane ministerstwa (MIMIT), 19 miast, czerwiec 2026. Polska: średnia z ponad 2 tys. kawiarni, sierpień 2025. Brazylia: urząd ochrony konsumentów stanu São Paulo (Procon-SP), 50 lokali, wrzesień 2025. RPA: 9 sieci kawiarni, lipiec 2024. Przeliczenie na USD według kursów referencyjnych EBC z 12.10.2026. Indeks aktualizujemy raz w roku.',
  oH: ['Studio, które zaczęło od własnej potrzeby.', 'A studio that started with its own need.'],
  oT: ['Wszystko zaczęło się od sportu: żadna aplikacja do treningu siłowego nie była jednocześnie prosta, rzetelna i uczciwa cenowo. Więc ją zrobiliśmy. Apps4Brew to studio z Warszawy — kolejne aplikacje powstają z tej samej potrzeby.',
    'It all started with sport: no strength-training app was simple, reliable and fairly priced at the same time. So we built one. Apps4Brew is a studio from Warsaw — our next apps come from the same need.'],
  pH: ['Partnerzy i inwestorzy', 'Partners and investors'], pT: ['Chętnie porozmawiamy i wyślemy prezentację.', 'We’re happy to talk and send our deck.'],
};

const t = (pair, tag = 'span', cls = '') => `<${tag}${cls ? ` class="${cls}"` : ''} data-pl="${pair[0].replace(/"/g, '&quot;')}" data-en="${pair[1].replace(/"/g, '&quot;')}">${pair[0]}</${tag}>`;

const head = (k, tytul, poziom = '') => `<!doctype html>
<html lang="pl" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<!-- Makieta E2 roli 04 (20.10.2026), kierunek „${k}”. Wygenerowana: docs/design/narzedzia/kierunki.mjs. Nie jest stroną; usuwana przed publikacją (D-006). -->
<title>${tytul}</title>
<link rel="stylesheet" href="${poziom}wspolne.css">
<link rel="stylesheet" href="${poziom}${k}.css">
<script src="${poziom}wspolne.js" defer></script>
<script src="${poziom}${k}.js" defer></script>
</head>`;

const jezyk = `<div class="jezyk" role="group" aria-label="Język / Language"><button type="button" data-lang="pl" aria-pressed="true" lang="pl">PL</button><button type="button" data-lang="en" aria-pressed="false" lang="en">EN</button></div>`;
const motyw = (etykiety) => `<button type="button" class="motyw" data-motyw aria-pressed="false">${etykiety}</button>`;

const kartaApp = (a, extra = '') => `<article class="app" id="${a.id}" aria-labelledby="${a.id}-h">
  <img class="app-ikona" src="${a.ikona}" width="64" height="64" alt="">
  <div class="app-tresc">
    ${t(a.nazwa, 'h3', '')}${extra}
    <ul class="app-meta">${a.meta.map((m) => t(m, 'li')).join('')}</ul>
    <ul class="app-cechy">${a.cechy.map((c) => t(c, 'li')).join('')}</ul>
    ${t(T.prywatnosc, 'p', 'app-pryw')}
    <p class="app-linki"><a href="../../../${a.id}/privacy.html">${t(['Polityka prywatności', 'Privacy policy'])}</a> <a href="../../../${a.id}/support.html">${t(['Wsparcie', 'Support'])}</a></p>
  </div>
</article>`.replace(`data-pl="${a.nazwa[0]}"`, `id="${a.id}-h" data-pl="${a.nazwa[0]}"`);

const zasady = () => `<ul class="zasady">${T.zasady.map(([h, p]) => `<li><h3>${h}</h3><p>${p}</p></li>`).join('')}</ul>`;

const indeks = (wiersz) => `<table class="indeks-tab">
  <caption class="sr-only">Cena espresso w czterech krajach</caption>
  <thead><tr><th scope="col">${t(['Kraj', 'Country'])}</th><th scope="col">${t(['Espresso*', 'Espresso*'])}</th><th scope="col">USD</th></tr></thead>
  <tbody>${T.ind.map(wiersz).join('')}</tbody>
</table>
<p class="przypis">${T.indPrzypis}</p>`;
const wierszProsty = ([pl, en, lok, usd]) => `<tr><th scope="row">${t([pl, en])}</th><td>${lok}</td><td>${usd}</td></tr>`;

const stopka = () => `<footer class="stopka">
  <p class="stopka-studio">© 2026 Apps4Brew, Warszawa</p>
  <nav aria-label="Informacje"><ul>
    <li>${t(['Trening:', 'Trening:'])} <a href="../../../trening/privacy.html">${t(['prywatność', 'privacy'])}</a>, <a href="../../../trening/support.html">${t(['wsparcie', 'support'])}</a></li>
    <li>${t(['Piekarz:', 'Piekarz:'])} <a href="../../../piekarz/privacy.html">${t(['prywatność', 'privacy'])}</a>, <a href="../../../piekarz/support.html">${t(['wsparcie', 'support'])}</a></li>
    <li><a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">${t(['Warunki (licencja Apple)', 'Terms (Apple licence)'])}</a></li>
    <li><a href="mailto:support@apps4brew.com">support@apps4brew.com</a></li>
  </ul></nav>
</footer>`;
// [PROPOZYCJA] stopka rozdziela linki prywatności i wsparcia na obie aplikacje (znalezisko E0: dziś prowadzą tylko do Treningu).

const kontakt = () => `<section class="kontakt" id="kontakt" aria-labelledby="kontakt-h">
  ${t(T.pH, 'h2').replace('<h2 ', '<h2 id="kontakt-h" ')}
  ${t(T.pT, 'p')}
  <p class="mail"><a href="mailto:hello@apps4brew.com">hello@apps4brew.com</a> <button type="button" class="kopiuj" data-kopiuj="hello@apps4brew.com">${t(['Kopiuj', 'Copy'])}</button> <span class="kopiuj-stan" role="status"></span></p>
</section>`;

const studio = () => `<section class="studio" id="studio" aria-labelledby="studio-h">
  ${t(T.oH, 'h2').replace('<h2 ', '<h2 id="studio-h" ')}
  ${t(T.oT, 'p')}
</section>`;

const nav = () => `<nav class="menu" aria-label="Sekcje"><ul>${T.nav.map(([h, pl, en]) => `<li><a href="${h}">${t([pl, en])}</a></li>`).join('')}</ul></nav>`;

// ——— A2: Ziarno („Od ziarna do filiżanki”) ———
const ETAPY = [ // [PROPOZYCJA] nazwy etapów (D-009; „parzenie” zamiast „degustacji” wg kolejności NCA, 02-zrodla.md K30); uproszczenie: pomija suszenie, mielenie, eksport
  ['zbior', ['Zbiór', 'Harvest'], ['research', 'research']],
  ['obrobka', ['Obróbka', 'Processing'], ['projekt', 'design']],
  ['palenie', ['Palenie', 'Roasting'], ['budowa z testami', 'build with tests']],
  ['parzenie', ['Parzenie', 'Brewing'], ['testy z ludźmi (TestFlight)', 'testing with people (TestFlight)']],
  ['podanie', ['Podanie', 'Served'], ['App Store', 'App Store']],
];
const ETAP_APLIKACJI = { trening: 3, piekarz: 3 }; // indeks w ETAPY; dane: obie w TestFlight (inwentarz M6)

const droga = (id, etap, nazwa) => {
  const opis = `${nazwa}: etap ${etap + 1} z 5, ${ETAPY[etap][1][0].toLowerCase()} (${ETAPY[etap][2][0]})`;
  return `<figure class="droga" data-etap="${etap}" role="img" aria-label="${opis}">
  <ol class="droga-pasek" aria-hidden="true">${ETAPY.map(([k, n, s], i) => `<li class="d-${k}${i <= etap ? ' zrobione' : ''}${i === etap ? ' teraz' : ''}"><span class="d-nazwa">${t(n)}</span><span class="d-studio">${t(s)}</span></li>`).join('')}</ol>
</figure>`;
};

const ziarnoGlowna = () => `${head('ziarno', 'Kierunek A2 „Od ziarna do filiżanki” — strona główna')}
<body>
<a class="skip" href="#tresc">${t(['Przejdź do treści', 'Skip to content'])}</a>
<header class="naglowek"><a class="logo" href="#">Apps4Brew</a>${nav()}<div class="przelaczniki">${jezyk}${motyw('<span data-pl="Ciemny" data-en="Dark">Ciemny</span>')}</div></header>
<main id="tresc" data-ekran="glowna">
  <section class="bohater" aria-labelledby="h1">
    ${t(T.kto, 'p', 'kto')}
    ${t(T.h1, 'h1').replace('<h1 ', '<h1 id="h1" ')}
    <div class="bohater-opis">${t(T.lead, 'p', 'lead')}
    <p class="cta"><a class="przycisk" href="#aplikacje">${t(T.cta1)}</a> <a class="link-mocny" href="#indeks">${t(T.cta2)}</a></p></div>
  </section>
  <section class="aplikacje" id="aplikacje" aria-labelledby="apps-h">
    <h2 id="apps-h">${t(['Od ziarna do filiżanki', 'From bean to cup'])}</h2>
    <!-- [PROPOZYCJA] podtytuł sekcji aplikacji z metafory -->
    ${t(['Każda aplikacja przechodzi tę samą drogę. Pasek pokazuje, gdzie jest dziś.', 'Every app takes the same path. The bar shows where it is today.'], 'p', 'sekcja-lead')}
    ${T.apps.map((a) => kartaApp(a, droga(a.id, ETAP_APLIKACJI[a.id], a.krotka))).join('\n')}
    <div class="kolejne">${t(T.kolejne, 'p', 'kolejne-h')}${t(T.karta, 'p')}</div>
  </section>
  <section class="jak" id="jak" aria-labelledby="jak-h">
    ${t(T.jakH, 'h2').replace('<h2 ', '<h2 id="jak-h" ')}
    ${t(T.jakSub, 'p', 'podtytul')}
    ${t(T.jakLead, 'p')}
    ${zasady()}
  </section>
  <section class="indeks" id="indeks" aria-labelledby="ind-h">
    ${t(T.indH, 'h2').replace('<h2 ', '<h2 id="ind-h" ')}
    ${t(T.indSub, 'p', 'podtytul')}
    ${t(T.indLead, 'p')}
    ${indeks(wierszProsty)}
  </section>
  ${studio()}
  ${kontakt()}
</main>
${stopka()}
</body>
</html>`;

// ——— B: Tablica z wsuwanymi literami ———
const tablica = (wiersze, cls = '') => `<div class="tablica ${cls}" aria-hidden="true"><div class="filc">${wiersze.map((w) => `<p class="rzad">${w.map(([pl, en, kl = '']) => `<span class="litery ${kl}" data-pl="${pl}" data-en="${en}">${[...pl].map((c) => `<i>${c === ' ' ? '&nbsp;' : c}</i>`).join('')}</span>`).join('')}</p>`).join('')}</div></div>`;

const tablicaGlowna = () => `${head('tablica', 'Kierunek B „Tablica z wsuwanymi literami” — strona główna')}
<body>
<a class="skip" href="#tresc">${t(['Przejdź do treści', 'Skip to content'])}</a>
<header class="naglowek"><a class="logo" href="#">Apps4Brew</a>${nav()}<div class="przelaczniki">${jezyk}${motyw('<span data-pl="Ciemny" data-en="Dark">Ciemny</span>')}</div></header>
<main id="tresc" data-ekran="glowna">
  <section class="bohater" aria-labelledby="h1">
    ${t(T.kto, 'p', 'kto')}
    <h1 id="h1" class="sr-only" data-pl="${T.h1[0]}" data-en="${T.h1[1]}">${T.h1[0]}</h1>
    ${tablica([[['APLIKACJE', 'APPS']], [['TAŃSZE NIŻ', 'FOR LESS THAN']], [['ESPRESSO.', 'AN ESPRESSO.']]], 'tablica-bohater')}
    ${t(T.lead, 'p', 'lead')}
    <p class="cta"><a class="przycisk" href="#aplikacje">${t(T.cta1)}</a> <a class="link-mocny" href="#indeks">${t(T.cta2)}</a></p>
  </section>
  <section class="aplikacje" id="aplikacje" aria-labelledby="apps-h">
    <h2 id="apps-h">${t(['Menu', 'Menu'])}</h2>
    <!-- [PROPOZYCJA] sekcja aplikacji jako „menu” studia -->
    <div class="menu-aplikacji">${T.apps.map((a) => kartaApp(a)).join('\n')}</div>
    <div class="kolejne">${t(T.kolejne, 'p', 'kolejne-h')}${t(T.karta, 'p')}</div>
  </section>
  <section class="indeks" id="indeks" aria-labelledby="ind-h">
    ${t(T.indH, 'h2').replace('<h2 ', '<h2 id="ind-h" ')}
    ${tablica([[['ESPRESSO', 'ESPRESSO']], ...T.ind.map(([pl, en, lok]) => [[pl.toUpperCase(), en.toUpperCase(), 'kraj'], [lok.toUpperCase(), lok.toUpperCase(), 'cena']]), [[' ', ' ']], [['APLIKACJA', 'AN APP', 'kraj'], ['< 1 ESPRESSO', '< 1 ESPRESSO', 'cena akcent']]], 'tablica-cennik')}
    ${t(T.indSub, 'p', 'podtytul')}
    ${t(T.indLead, 'p')}
    ${indeks(wierszProsty)}
  </section>
  <section class="jak" id="jak" aria-labelledby="jak-h">
    ${t(T.jakH, 'h2').replace('<h2 ', '<h2 id="jak-h" ')}
    ${t(T.jakSub, 'p', 'podtytul')}
    ${t(T.jakLead, 'p')}
    ${zasady()}
  </section>
  ${studio()}
  ${kontakt()}
</main>
${stopka()}
</body>
</html>`;

// ——— C: Warszawski neon ———
const neonGlowna = () => `${head('neon', 'Kierunek C „Warszawski neon” — strona główna')}
<body>
<a class="skip" href="#tresc">${t(['Przejdź do treści', 'Skip to content'])}</a>
<header class="naglowek"><a class="logo" href="#">Apps4Brew</a>${nav()}<div class="przelaczniki">${jezyk}${motyw('<span data-pl="Noc" data-en="Night">Noc</span>')}</div></header>
<main id="tresc" data-ekran="glowna">
  <section class="bohater" aria-labelledby="h1">
    <div class="fasada">
      <figure class="szyld" role="img" aria-label="Szyld Apps4Brew z rurek neonowych. Świecą nazwy aplikacji gotowych do testów: Trening i Piekarz. Trzecia rurka, kolejna aplikacja, jest zgaszona.">
        <svg class="szyld-svg szyld-szeroki" viewBox="0 0 900 300" aria-hidden="true">
          <g class="rurki"><text class="rurka logo-rurka" x="450" y="140" text-anchor="middle">apps4brew</text>
          <text class="rurka male swieci" x="160" y="256" text-anchor="middle">TRENING</text>
          <text class="rurka male swieci" x="450" y="256" text-anchor="middle">PIEKARZ</text>
          <text class="rurka male zgaszona" x="740" y="256" text-anchor="middle">WKRÓTCE</text></g>
          <g class="blask" aria-hidden="true"><text class="rurka logo-rurka" x="450" y="140" text-anchor="middle">apps4brew</text>
          <text class="rurka male swieci" x="160" y="256" text-anchor="middle">TRENING</text>
          <text class="rurka male swieci" x="450" y="256" text-anchor="middle">PIEKARZ</text>
          <text class="rurka male zgaszona" x="740" y="256" text-anchor="middle">WKRÓTCE</text></g>
        </svg>
        <svg class="szyld-svg szyld-waski" viewBox="0 0 600 470" aria-hidden="true">
          <g class="rurki"><text class="rurka logo-rurka" x="300" y="130" text-anchor="middle" textLength="560" lengthAdjust="spacingAndGlyphs">apps4brew</text>
          <text class="rurka male swieci" x="300" y="250" text-anchor="middle">TRENING</text>
          <text class="rurka male swieci" x="300" y="345" text-anchor="middle">PIEKARZ</text>
          <text class="rurka male zgaszona" x="300" y="440" text-anchor="middle">WKRÓTCE</text></g>
          <g class="blask"><text class="rurka logo-rurka" x="300" y="130" text-anchor="middle" textLength="560" lengthAdjust="spacingAndGlyphs">apps4brew</text>
          <text class="rurka male swieci" x="300" y="250" text-anchor="middle">TRENING</text>
          <text class="rurka male swieci" x="300" y="345" text-anchor="middle">PIEKARZ</text></g>
        </svg>
      </figure>
    </div>
    ${t(T.kto, 'p', 'kto')}
    ${t(T.h1, 'h1').replace('<h1 ', '<h1 id="h1" ')}
    ${t(T.lead, 'p', 'lead')}
    <p class="cta"><a class="przycisk" href="#aplikacje">${t(T.cta1)}</a> <a class="link-mocny" href="#indeks">${t(T.cta2)}</a></p>
  </section>
  <section class="aplikacje" id="aplikacje" aria-labelledby="apps-h">
    ${t(['Aplikacje', 'Apps'], 'h2').replace('<h2 ', '<h2 id="apps-h" ')}
    ${T.apps.map((a) => kartaApp(a)).join('\n')}
    <div class="kolejne">${t(T.kolejne, 'p', 'kolejne-h')}${t(T.karta, 'p')}</div>
  </section>
  <section class="jak" id="jak" aria-labelledby="jak-h">
    ${t(T.jakH, 'h2').replace('<h2 ', '<h2 id="jak-h" ')}
    ${t(T.jakSub, 'p', 'podtytul')}
    ${t(T.jakLead, 'p')}
    ${zasady()}
  </section>
  <section class="indeks" id="indeks" aria-labelledby="ind-h">
    ${t(T.indH, 'h2').replace('<h2 ', '<h2 id="ind-h" ')}
    ${t(T.indSub, 'p', 'podtytul')}
    ${t(T.indLead, 'p')}
    ${indeks(wierszProsty)}
  </section>
  ${studio()}
  ${kontakt()}
</main>
${stopka()}
</body>
</html>`;

// Element firmowy w nagłówku podstrony (dane: aplikacja, której dotyczy dokument, i jej etap).
const znakPodstrony = (k) => k === 'ziarno' ? `<div class="znak">${droga('trening', ETAP_APLIKACJI.trening, 'Trening')}</div>`
  : k === 'tablica' ? `<div class="znak">${tablica([[['TRENING', 'TRENING']], [['TESTFLIGHT', 'TESTFLIGHT']]], 'tablica-mala')}</div>`
  : `<div class="znak"><svg class="szyld-maly" viewBox="0 0 420 90" role="img" aria-label="Neon: Trening świeci, aplikacja w testach"><g class="rurki"><text class="rurka male swieci" x="0" y="64">TRENING</text></g><g class="blask"><text class="rurka male swieci" x="0" y="64">TRENING</text></g></svg></div>`;

// ——— Polityka (szablon podstrony, wspólna struktura dla eksportu Treningu) ———
const polityka = (k, nazwa) => `${head(k, `Kierunek ${nazwa} — polityka prywatności (szablon podstrony)`)}
<body class="podstrona">
<a class="skip" href="#tresc">${t(['Przejdź do treści', 'Skip to content'])}</a>
<header class="naglowek"><a class="logo" href="${k}-glowna.html">Apps4Brew</a><div class="przelaczniki">${jezyk}${motyw(k === 'neon' ? '<span data-pl="Noc" data-en="Night">Noc</span>' : '<span data-pl="Ciemny" data-en="Dark">Ciemny</span>')}</div></header>
<main id="tresc" class="dokument" data-ekran="polityka">
  <p class="okruchy"><a href="${k}-glowna.html#trening">Trening</a></p>
  <h1>Trening — polityka prywatności</h1>
  ${znakPodstrony(k)}
  <section lang="pl" data-lang-section="pl">${polPL}</section>
</main>
${stopka()}
</body>
</html>`;

const pliki = {
  'ziarno-glowna.html': ziarnoGlowna(), 'ziarno-polityka.html': polityka('ziarno', 'A2 „Od ziarna do filiżanki”'),
  'tablica-glowna.html': tablicaGlowna(), 'tablica-polityka.html': polityka('tablica', 'B „Tablica z wsuwanymi literami”'),
  'neon-glowna.html': neonGlowna(), 'neon-polityka.html': polityka('neon', 'C „Warszawski neon”'),
};
for (const [n, s] of Object.entries(pliki)) { writeFileSync(resolve(out, n), s); console.log('OK', n); }
