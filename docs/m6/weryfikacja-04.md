# Audyt: Studio Projektowe (UX, marka, przepływy) — apps4brew.com (strona WWW, M6 E3) — 2026-10-20
Commit: 5a371ac (gałąź `strona/apps4brew-2026-10-20`) · Tryb: audit, moduły `strona-www`, `render-i-krytyka` · Środowisko: Linux x86_64, Node v22.22.0, Playwright 1.56.1 + Chromium 1194 (z `/opt/node-tools`), Python 3.13 + Pillow, serwer `python3 -m http.server 8765` w katalogu repo; `gh` bez ważnego tokenu (niepotrzebny, audyt tylko lokalnie); brak macOS/Safari/iOS (dowody: `dowody/e0-srodowisko.txt`).

## Podsumowanie
Zbudowana strona wiernie odtwarza system z `docs/design/`: 34 zrzuty wzorcowe (320–1440 px, jasny i ciemny) różnią się od zrzutów HEAD o 0,00–0,09 % pikseli, tła mają dokładnie tokeny `#E9EDE0`/`#1C1410`, a strony są identyczne z podglądem poza poprawkami dwujęzyczności i znacznikami `<head>` (SP-13: zgodne). Standardy strony (SP-22) w większości spełnione: brak przewijania w poziomie na 6 stronach × 5 szerokościach × 2 motywach, pełne przejście Tab bez problemów (fokus 3 px widoczny i niezasłonięty, cele ≥ 24 px), przełącznik PL/EN i „Kopiuj” działają z klawiatury, adresy z App Store Connect i `CNAME` bez zmian, CSP i brak śledzenia bez zmian, 0 błędów konsoli i 0 nieudanych żądań, LCP laboratoryjne ≤ 0,91 s. Najważniejsze ryzyko: laboratoryjny CLS 0,175 na obu stronach wsparcia w profilu telefonu (podmiana kroju bez dopasowanych metryk) oraz podpisy etapów drogi ziarna na podstronach, które na telefonie mają 10,9–13 px i nie rosną przy powiększeniu tekstu. Nie ma P0 ani P1. Decyzje do podjęcia: nazwy aplikacji w wersji EN, pasek na obrazie Open Graph, linia praw Apple.

| ID | Poziom | Rodzaj | Tytuł | Status |
|---|---|---|---|---|
| 04-studio-projektowe-001 | P2 | D | Strony wsparcia przeskakują przy wczytaniu krojów na telefonie (CLS lab 0,175 > 0,1) | otwarte |
| 04-studio-projektowe-002 | P2 | D | Podpisy etapów drogi ziarna na podstronach i 404 poniżej 600 px nie rosną przy powiększeniu tekstu (10,9 px przy 320) | otwarte |
| 04-studio-projektowe-003 | P2 | P | Obraz Open Graph pokazuje wszystkie 5 etapów jako ukończone, także „App Store” | otwarte |
| 04-studio-projektowe-004 | P2 | D | Pierwsza zmiana języka nowego gościa nie uruchamia „wsuwania” liter tablicy (D-011) | otwarte |
| 04-studio-projektowe-005 | P2 | D | Brak linii praw Apple tam, gdzie są informacje prawne | otwarte |
| 04-studio-projektowe-006 | P2 | D | Nazwa dostępna przycisku „PL” („Polski”) nie zawiera widocznego tekstu (WCAG 2.5.3) | otwarte |
| 04-studio-projektowe-007 | P2 | D | Linki w stopce (37 px) i na kartach aplikacji (40 px) poniżej progu studia 44 px na dotyk | otwarte |
| 04-studio-projektowe-008 | P2 | D | Na stronach wsparcia pytania FAQ (h3) mają ten sam rozmiar co nagłówek sekcji (h2) | otwarte |
| 04-studio-projektowe-009 | P2 | D | Wiersze indeksu espresso przy 320–390 px układają cenę i przeliczenie raz tak, raz inaczej | otwarte |
| 04-studio-projektowe-010 | P2 | P | Wersja EN nazywa tę samą aplikację na trzy sposoby (Training / Trening, Crust / Crust (Piekarz) / Piekarz) | otwarte |
| 04-studio-projektowe-011 | P3 | D | W trybie wymuszonych kolorów (forced-colors) pasek etapów traci stan „zrobione” i znikają punktory list | otwarte |
| 04-studio-projektowe-012 | P3 | D | Samotne „w” na końcu albo w osobnym wierszu w „Kolejne aplikacje w przygotowaniu.” | otwarte |
| 04-studio-projektowe-013 | P3 | D | Podstrony bez `apple-touch-icon`, `theme-color` i `twitter:card`, które ma strona główna | otwarte |
| 04-studio-projektowe-014 | P3 | D | „Kopiuj” bez komunikatu, gdy schowek odmówi (tylko zaznaczenie adresu) | otwarte |
| 04-studio-projektowe-015 | P3 | D | Odstęp przypisu indeksu zapisany w HTML (`style=`) zamiast z tokenu | otwarte |
| 04-studio-projektowe-016 | P3 | P | Linia stanu aplikacji to ciąg „A · B · C” z kalibracji bez osobno zapisanej decyzji | otwarte |

Skala: P0–P2 według szablonu; **P3** to rozszerzenie z polecenia koordynatora („P0–P3”): kosmetyka bez wpływu na wykonanie zadania (wyjątek nazwany, zasada wspólna 7).

## Linia bazowa i założenia
**Stan projektu (E0).** Repo nie ma `CLAUDE.md`; stan z rejestru: strona studia przed wydaniem aplikacji, obie aplikacje w TestFlight, cele w kolejności D-001 (wiarygodność studia, polityki i wsparcie, pobrania), PL/EN pod jednym adresem (D-002), adresy dla App Store Connect (D-003). Bramka opłacalności (zasada 20) nie dotyczy: przedmiotem jest strona, nie aplikacja. STOP E0 pominięty: subagent w kroku weryfikacji M6, zakres nadany przez koordynatora (wyjątek nazwany).

**Przepływy i konteksty (E0b, na nowo, potem porównane z `docs/design/00-rozpoznanie.md`):** P1 klient/inwestor z linku (laptop albo telefon, 30–60 s, ocenia wiarygodność); P2 użytkownik aplikacji albo recenzent Apple z App Store Connect (iPhone, krótka sesja, czytanie długiego tekstu, często ciemny motyw i powiększony tekst); P3 zainteresowany aplikacją (telefon, dziś bez przycisku App Store). Kontekst P2 jest najważniejszy dla jakości: iPhone + ciemny motyw + powiększenie tekstu na podstronach polityki i wsparcia. Tu leżą 001, 002, 008.

**Wymiary pokrycia:**
- Konteksty użycia: sprawdzone P1 (1440/1024), P2 (320/390, oba motywy, tekst 200 %), P3 (karty aplikacji, brak przycisku App Store zgodnie z design-spec). Oczy i ręce wolne: moduł `kontekst-oczy-zajete` pominięty.
- Stany: typowy (wszystkie strony), 404 zaprojektowany, bez JS (podstrony pokazują obie wersje językowe — poprawnie; główna tylko PL), błąd schowka (014), zapamiętany język po przeładowaniu (działa). Ładowanie: przeskok przy krojach (001). Offline, puste, brak uprawnień: nie dotyczy strony statycznej.
- Element firmowy: droga ziarna niesie prawdziwe dane (4/5, „parzenie = TestFlight”) na głównej i podstronach, `figure role="img"` z opisem PL/EN; odstępstwa: obraz OG (003), podpisy na wąskich podstronach (002), forced-colors (011).
- Podłogi dostępności: kontrast w obu motywach i w `prefers-contrast: more` spełniony; nic tylko kolorem (skala szarości: zrobione = wypełnienie, niezrobione = kreskowanie, bieżący = wyższy + znacznik); tekst 200 % i reflow bez przewijania; cele ≥ 24 px; „Ogranicz ruch” respektowany.
- Ruch, dźwięk: pasek „pali się” 5 × 140 ms, wyłączony przy reduce; litery tablicy — błąd pierwszego przełączenia (004). Dźwięku i haptyki brak.
- Obecność poza ekranem: favicon i `apple-touch-icon` z systemu (identyczne pliki), obraz OG 1200×630 (003), podgląd linku — `og:*` komplet na 6 stronach (404 bez, poprawnie, `noindex`).
- Głos i teksty: 404 mówi, co się stało i co zrobić; „Skopiowano” jako potwierdzenie; nazwy aplikacji w EN niespójne (010).
- Motyw ciemny i zwiększony kontrast: pełne warianty tokenów (nie odwrócenie), sprawdzone na zrzutach; forced-colors nie ma wariantu (011).
- Lokalizacja: po EN brak polskich resztek poza walutą „zł” i nazwiskiem administratora (`dowody/en-resztki.txt`); `lang` na `<html>` przełączany, sekcje dokumentów z `lang`.

**Soczewki (po kolei, osobno; bez subagentów):** (1) użytkownik w najtrudniejszym kontekście — iPhone SE 320 px, ciemny motyw, powiększony tekst: podpisy etapów 10,9 px bez skalowania (002), przeskok strony wsparcia przy wczytaniu (001); (2) czytnik ekranu / największy tekst: struktura nagłówków poprawna, `figure` z opisem, tablica `aria-hidden` z danymi obok; przycisk „PL” z nazwą „Polski” (006); FAQ bez hierarchii wizualnej (008); (3) krytyk kliszy: brak kremu z terakotą, fioletu, mono-wersalików, numeracji, „→”; jedyne ślady to ciąg „·” (016) i siatka 3 kolumn zasad (standard, nie zgłaszam); (4) nowa osoba: w pierwszej sekundzie hasło „Aplikacje tańsze niż espresso.” i przycisk; pasek z podpisami etapów jest czytelny bez instrukcji na głównej; na OG ten sam pasek mówi co innego (003).

**Wzorzec najlepszych:** zgodnie z kontraktem roli — rozpoznawalność z jednego elementu niosącego dane przy standardowych kontrolkach (HIG, Branding) i podłogi WCAG 2.2 AA bez utraty wyrazu. Strona to spełnia: element firmowy (droga ziarna) koduje etap aplikacji, reszta to zwykłe linki i przyciski. Źródła progów przeczytane dziś: WCAG 2.2 (`dowody/wcag22-cytaty.txt`), web.dev Web Vitals (`dowody/webvitals-cytaty.txt`), Apple Marketing Guidelines (`dowody/apple-linie-praw.txt`). Nie przeczytałem dziś `research-ux-nagradzane.md` z repo `prompts` (repo poza sesją) — porównanie z laureatami ADA ograniczone do zasad z kontraktu.

**Krytyka zrzutów (moduł render-i-krytyka, usterki najpierw):**
1. Podstrona 320 px: podpisy etapów 10,9 px pod paskiem, najmniejszy tekst strony (`zrzuty/krytyka-droga-podstrona-320.png`) → 002.
2. Wsparcie 320 px: pytania FAQ wyglądają na równie ważne jak „Pytania i odpowiedzi”, brak rytmu między pytaniem a poprzednią odpowiedzią (`zrzuty/krytyka-faq-piekarz-support-320.png`) → 008.
3. Indeks 320/390 px: „Włochy” ma cenę i przeliczenie w innym układzie niż pozostałe wiersze (`zrzuty/krytyka-paragony-indeks-320.png`) → 009.
4. Główna 320 px: „w” sam w wierszu nagłówka ramki (`zrzuty/krytyka-kolejne-indeks-320.png`) → 012.
5. 1024–1440 px: przycisk „Zobacz aplikacje” odsunięty ~400 px od akapitu wiodącego (zgodne z wzorcem, nie zgłaszam jako znalezisko; do rozważenia przy następnej iteracji).
Zalety: jeden akcent (bordo owocu), pasek jako rozpoznawalny element niosący dane, wersja ciemna zaprojektowana (jaśniejsze odpowiedniki etapów, brązowe tło palonego ziarna), tablica jako przedmiot drugiego planu. Po zakryciu nazwy stronę rozpoznaje się po pasku drogi ziarna, nie tylko po kolorze.

**Rejestr założeń:** `docs/zalozenia.md` nie istnieje; założenia P1–P3 (`[ZAŁ]` w `docs/design/00-rozpoznanie.md`) bez zmiany statusu — audyt nie dał dowodu za ani przeciw.

## Pokrycie (co sprawdzono, czego nie)
| Obszar / pliki / ekrany | Sprawdzone? | Jak (plik dowodu) |
|---|---|---|
| `index.html`, `trening/privacy.html`, `trening/support.html`, `piekarz/privacy.html`, `piekarz/support.html`, `404.html` (kod) | tak, całe | odczyt; różnice z podglądem systemu: `dowody/diff-podglad-vs-strona.txt` |
| `assets/site.css`, `assets/site.js` | tak, całe; identyczne z `docs/design/system/` | `dowody/diff-podglad-vs-strona.txt`, `dowody/sp03-grep.txt` |
| `assets/` ikony i OG, `fonts/` + licencje | tak | `dowody/ikony-head.txt`, `zrzuty/og-image-HEAD.png`, `dowody/node-test.txt` (test 13) |
| SP-13: 34 zrzuty wzorcowe vs HEAD | tak | `dowody/sp13-porownanie.txt`, pary `zrzuty/pary/` |
| Zrzuty 6 stron × 320/390/768/1024/1440 × jasny/ciemny, reflow, konsola, żądania | tak (60 kombinacji) | `dowody/zrzuty-reflow-konsola.txt`, `zrzuty/strona/` |
| Klawiatura: Tab przez 6 stron × 390/1440 × 2 motywy, przełącznik języka, „Kopiuj” | tak | `dowody/klawiatura.txt`, `zrzuty/fokus/` |
| Tekst 200 %, powiększenie 200 %, reduced-motion, prefers-contrast: more, forced-colors | tak | `dowody/tekst200-ruch-kontrast.txt`, `dowody/d-nazwa.txt`, `dowody/tablica-ruch.txt`, `zrzuty/media/` |
| Kontrast na zrzutach (390, jasny, ciemny, oba z `more`) | tak | `dowody/kontrast-zrzuty.txt` |
| Skala szarości (SP-05) | tak | `dowody/szarosc.txt`, `zrzuty/media/szarosc-karta-trening-390-jasny.png` |
| LCP, CLS (lab), waga | tak, lab; bez danych z pola | `dowody/lcp-cls-waga.txt`, `dowody/cls-zrodla.txt` |
| Adresy stara → nowa, CSP, prywatność | tak | `dowody/adresy-stara-vs-nowa.txt`, `dowody/prywatnosc-csp.txt` |
| Wersja EN kompletna | tak | `dowody/en-resztki.txt` |
| Testy repo | tak, 38/38, kod 0 | `dowody/node-test.txt` |
| Safari / iOS (krój zastępczy SF Pro, rozmiar tekstu „aA”, VoiceOver) | **nie** — brak macOS/iOS | krok właściciela (Decyzje) |
| Czytnik ekranu (NVDA/VoiceOver) na żywo | **nie** — tylko drzewo DOM, `aria-*` i kolejność | — |
| INP | **nie** — wymaga danych z pola; JS 3,5 kB bez długich zadań | — |
| Strona opublikowana (GitHub Pages: gzip, nagłówki, 404 pod zagnieżdżoną ścieżką) | **nie** — przedmiotem jest gałąź; serwer lokalny nie kompresuje | — |
| `docs/m6/`, raporty innych ról | **nie czytane** (polecenie: świeże spojrzenie) | — |

## Kontrola dowodów i sekretów
Wynik `node narzedzia/sprawdz-raport.mjs 04-studio-projektowe-2026-10-20.md /home/user/apps4brew-www . --rola 04-studio-projektowe` (uruchomione w katalogu raportu przed oddaniem):

```
OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone; format raportu 04-studio-projektowe
```
Kod wyjścia 0 (pełny zapis: `dowody/sprawdz-raport.txt`). `git status --porcelain`: pusty (`dowody/git-status.txt`; katalog `audit/` w `.git/info/exclude`).

## Stosowalność listy kontrolnej
| Pozycja | Status (dotyczy / nie dotyczy + powód / decyzja D-xx) | Wynik (ok / znalezisko ID / nie sprawdzono + powód) |
|---|---|---|
| SP-01 | dotyczy (przepływy P1–P3 jako założenia, D-008) | ok: menu → 4 sekcje, CTA → `#apps`/`#index`, karty → polityka/wsparcie, kontakt → hello@ + „Kopiuj”; brak osieroconych elementów |
| SP-02 | dotyczy | ok na stronie (etap 4/5); znalezisko 04-studio-projektowe-003 (OG) |
| SP-03 | dotyczy | 04-studio-projektowe-015 (jedyny `style=`); barwy i kroje tylko z tokenów (`dowody/sp03-grep.txt`) |
| SP-04 | dotyczy | ok: tokeny (`docs/design/kontrast/e3-tokeny.txt`) i zrzuty w 4 wariantach — 0 par poniżej progu po odjęciu artefaktu tablicy (`dowody/kontrast-zrzuty.txt`) |
| SP-05 | dotyczy | ok w skali szarości; 04-studio-projektowe-011 (forced-colors) |
| SP-06 | dotyczy (próg studia 44 px na dotyk, moduł strona-www) | 04-studio-projektowe-007 |
| SP-07 | dotyczy jako powiększenie tekstu i strony (moduł strona-www) | 04-studio-projektowe-002; nagłówki h1 z `clamp(…vw…)` rosną 1,28× — zob. Do sprawdzenia |
| SP-08 | dotyczy | ok: `prefers-reduced-motion` wyłącza pasek i tablicę; ruch krótki (≤ 1,1 s) |
| SP-09 | dotyczy | 04-studio-projektowe-010 |
| SP-10 | dotyczy (404, bez JS, błąd schowka) | ok dla 404 i bez JS; 04-studio-projektowe-014 |
| SP-11 | dotyczy | ok: bez emoji, komunikaty 404 i „Skopiowano” w głosie interfejsu |
| SP-12 | dotyczy | ok poza 04-studio-projektowe-016; pozostałe wybory z decyzjami D-009–D-014 |
| SP-13 | dotyczy (linia bazowa `docs/design/wzorce-zrzuty/`, 34 pliki) | ok: 0,00–0,09 % pikseli różnicy; usterki samego systemu: 04-studio-projektowe-004, -008, -009, -012 |
| SP-14 | rozstrzygnięte decyzją D-011, D-014 (Barlow Condensed tylko na tablicy) | ok: OFL w `fonts/`, treść Source Sans 3 400–700, bez cienkich odmian |
| SP-15 | dotyczy jako natywne elementy HTML | ok: `a`, `button` z `aria-pressed`, `nav`, `figure`; brak gestów |
| SP-16 | dotyczy (favicon, apple-touch-icon z systemu, D-015) | ok: pliki identyczne z `docs/design/ikona/`, PNG bez alfy; brak ekranu startowego i intro |
| SP-17 | dotyczy (P2: iPhone, czytanie, ciemny motyw) | ok poza 002 i 001 (oba w kontekście P2) |
| SP-18 | dotyczy jako czytnik ekranu i klawiatura | 04-studio-projektowe-006; reszta ok w DOM; czytnik na żywo nie sprawdzono (brak macOS/NVDA) |
| SP-21 | nie dotyczy: repo strony nie zawiera ikony aplikacji; ikona strony w SP-16 | — |
| SP-22 | dotyczy | reflow 320 ok; klawiatura, fokus widoczny i niezasłonięty ok; cele ≥ 24 px ok; `lang` ok; tytuły, opisy, canonical, OG ok; App Store badge nie dotyczy (TestFlight, design-spec); adresy ok; LCP ok; znaleziska 04-studio-projektowe-001, -005, -013 |

## Znaleziska (szczegóły)

### 04-studio-projektowe-001 · Strony wsparcia przeskakują przy wczytaniu krojów na telefonie (CLS lab 0,175 > 0,1)
- Pozycja listy kontrolnej: SP-22
- Poziom: P2
- Realność: brzegowy (pierwsza wizyta na wolnym łączu; druga wizyta z krojami w pamięci bez przeskoku)   · Pewność: wysoka (dla pomiaru lab)
- Rodzaj: D
- Dowód: `dowody/lcp-cls-waga.txt` — mobile (RTT 150 ms, 1,6 Mb/s, CPU 4×): trening/support CLS 0,1748, piekarz/support 0,1746 (3/3 przebiegi); desktop 0,0377. `dowody/cls-zrodla.txt`: jedno przesunięcie 0,174 w chwili wczytania krojów (t ≈ 1,14 s), źródła h3 i akapity FAQ; z zablokowanymi krojami CLS 0,0000; wstrzyknięty `preload` nie pomaga (0,188), bo przeskok wynika z innych metryk kroju zastępczego. Przyczyna w kodzie:
- `assets/site.css:9` „font-display:swap” bez `size-adjust`/`ascent-override` dla kroju zastępczego.
- Podstrony nie mają `preload` krojów (strona główna ma, `index.html:27`): `trening/support.html:12`.
- Wzorzec lub źródło: web.dev Web Vitals (odczyt 20.10.2026): „pages should maintain a CLS of 0.1. or less.” (`dowody/webvitals-cytaty.txt`). Uproszczenie nazwane: pomiar laboratoryjny Playwrightem; krój zastępczy w Linuksie to Inter (`fc-match system-ui`), na iOS SF Pro o zbliżonej szerokości — wynik na iPhonie `[DO USTALENIA]`.
- Kroki w aplikacji: App Store → „Wsparcie” → pierwsze wejście na telefonie przy słabym zasięgu → tekst FAQ przeskakuje po ok. 1 s.
- Opcje (dla P co najmniej dwie): (a) `@font-face` zastępczy z `local()` i `size-adjust`/`ascent-override` dopasowanymi do Source Sans 3 i Young Serif — bez zmiany wyglądu, ok. 1 h z pomiarem; (b) `font-display: optional` dla treści — zero przeskoku, ale przy pierwszej wizycie część osób zobaczy krój systemowy; (c) bez zmian — przeskok tylko przy pierwszej wizycie. Rekomendacja: (a).
- Test akceptacyjny: `narzedzia/wydajnosc.mjs` (profil mobile) daje CLS ≤ 0,1 na 6 stronach w 3/3 przebiegach; zrzuty wzorcowe bez zmian (SP-13 ≤ 1 %).
- Status: otwarte
- Weryfikacja przeciwna: próba obalenia — przeskok mógłby pochodzić z ukrycia sekcji EN przez JS; wykluczone (CLS 0 przy zablokowanych krojach, JS ładuje się wcześniej, t = 387 ms).

### 04-studio-projektowe-002 · Podpisy etapów drogi ziarna na podstronach i 404 poniżej 600 px nie rosną przy powiększeniu tekstu (10,9 px przy 320)
- Pozycja listy kontrolnej: SP-07 (odpowiednik strony: powiększenie tekstu, moduł strona-www)
- Poziom: P2 (dane etapu są też w kształcie paska i w opisie `aria-label`; treść polityki skaluje się poprawnie)
- Realność: realny (przepływ P2: iPhone z App Store)   · Pewność: wysoka
- Rodzaj: D
- Dowód: `assets/site.css:196` „font-size:min(.8125rem,3.4vw)”; `dowody/d-nazwa.txt`: przy 320 px 10.88px → przy tekście 200 % 10.88px; przy 390 px 13px → 13.26px; strona główna 15px → 30px. Zrzut `zrzuty/krytyka-droga-podstrona-320.png`. Własna podłoga systemu: `docs/design/narzedzia/warsztat.mjs:2` „tekst < 11 px” to błąd — warsztat uruchamiano przy 390 i 1024, nie przy 320.
- Wzorzec lub źródło: WCAG 2.2, 1.4.4 (odczyt 20.10.2026): „text can be resized without assistive technology up to 200 percent without loss of content or functionality.” (`dowody/wcag22-cytaty.txt`)
- Kroki w aplikacji: iPhone SE (320 px) → polityka Treningu → podpisy „Zbiór… Podanie” pod paskiem; powiększenie tekstu w Safari („aA”) ich nie powiększa (jednostka `vw` nie rośnie z powiększeniem).
- Opcje (dla P co najmniej dwie): (a) na wąskich podstronach pionowy pasek jak na głównej (podpisy 15 px rosną) — więcej wysokości nad treścią; (b) `font-size: max(.8125rem, …)` z zawijaniem podpisów w dwa wiersze; (c) ukryć podpisy poziomego paska i zostawić jeden wiersz tekstu „Etap 4 z 5: parzenie (TestFlight)” pod paskiem. Rekomendacja: (c) — tekst skaluje się, pasek zostaje grafiką.
- Test akceptacyjny: `narzedzia/d-nazwa.mjs` — każdy widoczny podpis etapu ≥ 11 px przy 320 px i ≥ 1,8× przy tekście 200 %; reflow 320 bez przewijania.
- Status: otwarte

### 04-studio-projektowe-003 · Obraz Open Graph pokazuje wszystkie 5 etapów jako ukończone, także „App Store”
- Pozycja listy kontrolnej: SP-02
- Poziom: P2
- Realność: realny (każdy udostępniony link do strony i podstron)   · Pewność: wysoka
- Rodzaj: P
- Dowód: zrzut `zrzuty/og-image-HEAD.png` (= `assets/og-image.png`): pięć odcinków wypełnionych barwami „zrobione”, ostatni z podpisem „Podanie / App Store”; na stronie ten sam etap jest kreskowany (niezrobiony), np. `zrzuty/pary/index-1440-jasny-ekran1-wzorzec-vs-strona.png`. Znaczenie barw w systemie: `docs/design/design-spec.md:9` „Dane: etap aplikacji”. Kompozycja zatwierdzona ogólnie: `docs/decyzje.md:27` „logo, hasło, pasek drogi ziarna, bez menu”.
- Wzorzec lub źródło: zasada studia 2 („Element firmowy niesie dane… Ozdoba, która niczego nie koduje, wylatuje”), SP-02 „używany spójnie”.
- Kroki w aplikacji: wklejenie apps4brew.com w komunikatorze lub na LinkedIn (przepływ P1) → podgląd z paskiem „wszystko gotowe, w App Store”, gdy aplikacje są w TestFlight.
- Opcje (dla P co najmniej dwie): (a) pasek jako legenda drogi: wszystkie odcinki w stanie neutralnym (obwódka + kreskowanie), bez sugestii postępu — obraz bez daty ważności; (b) prawdziwy stan 4/5 jak na stronie — wymaga regeneracji obrazu przy każdej zmianie etapu; (c) bez zmian — owner zatwierdził kompozycję (D-021), ryzyko mylnego odczytu. Rekomendacja: (a).
- Test akceptacyjny: obraz OG nie pokazuje etapu „Podanie” jako ukończonego, dopóki żadna aplikacja nie jest w App Store; `node --test` (test 38) przechodzi.
- Status: otwarte

### 04-studio-projektowe-004 · Pierwsza zmiana języka nowego gościa nie uruchamia „wsuwania” liter tablicy (D-011)
- Pozycja listy kontrolnej: SP-13 (zachowanie systemu: `docs/design/03-system.md:23` „litery tablicy 320 ms”)
- Poziom: P2
- Realność: realny (większość gości przełącza język raz)   · Pewność: wysoka
- Rodzaj: D
- Dowód: `dowody/tablica-ruch.txt` — bez zapisanego języka: klik EN wsuwa=0, następny klik PL wsuwa=82; z zapisanym EN pierwszy klik wsuwa=85. Przyczyna: flaga pierwszego wywołania przeznaczona dla ustawienia języka przy wczytaniu zostaje ustawiona dopiero przy pierwszym kliknięciu, gdy przy wczytaniu nie wywołano `setLang`:
- `assets/site.js:43` „(spokoj || pierwszy)”
- `assets/site.js:47` „pierwszy = false;”
- `assets/site.js:57` (wywołanie `setLang` przy wczytaniu tylko dla zapisanego EN albo stron dokumentów)
- Wzorzec lub źródło: `docs/decyzje.md:17` „z momentem PL/EN przestawiającym litery”
- Kroki w aplikacji: nowa osoba na stronie głównej (bez „Ogranicz ruch”) → „EN” → litery tablicy zmieniają się bez ruchu; dopiero powrót na „PL” pokazuje moment.
- Opcje (dla P co najmniej dwie): (a) ustawić `pierwszy = false` po starcie skryptu, także gdy `setLang` nie był wywołany — jedna linia; (b) zostawić — moment widoczny tylko przy drugim przełączeniu. Rekomendacja: (a).
- Test akceptacyjny: `narzedzia/tablica-ruch.mjs` — pierwszy klik EN bez zapisanego języka daje wsuwa > 0; z „Ogranicz ruch” wsuwa = 0 (`narzedzia/media.mjs`).
- Status: otwarte

### 04-studio-projektowe-005 · Brak linii praw Apple tam, gdzie są informacje prawne
- Pozycja listy kontrolnej: SP-22 (wiersz „Przyciski App Store … linie praw Apple tam, gdzie informacje prawne”)
- Poziom: P2
- Realność: realny (strona używa nazw iPhone, App Store, Apple Watch, Apple Health, TestFlight)   · Pewność: wysoka (wobec standardu modułu); ocena prawna `[DO USTALENIA]`
- Rodzaj: D
- Dowód: `dowody/apple-linie-praw.txt` — grep „trademark|Apple Inc|znak towarowy” na 6 stronach: brak (kod 1). Stopka z informacją prawną: `index.html:130` „© 2026 Apps4Brew”. Komentarz systemu traktuje link do licencji jako linię praw: `assets/site.css:179` „linie praw Apple tam, gdzie informacje prawne” (link „Warunki” prowadzi do EULA Apple, to nie jest linia praw).
- Wzorzec lub źródło: Apple, Marketing Resources and Identity Guidelines (odczyt 20.10.2026, `curl` + tekst): „Include Apple credit lines wherever legal information is provided.” oraz wzór międzynarodowy „______ and______ are trademarks of Apple Inc.”
- Kroki w aplikacji: stopka każdej strony; polityki prywatności (strony z informacją prawną).
- Opcje (dla P co najmniej dwie): (a) jedna linia w stopce wszystkich stron (PL/EN) według wzoru międzynarodowego z listą użytych znaków — mały tekst, bez zmiany układu; (b) linia tylko na podstronach polityk; (c) bez linii, dopóki nie ma przycisku App Store. Rekomendacja: (a).
- Test akceptacyjny: każda strona ze stopką zawiera linię praw Apple w obu językach; test w `tests/site.test.mjs` (rola 08).
- Status: otwarte

### 04-studio-projektowe-006 · Nazwa dostępna przycisku „PL” („Polski”) nie zawiera widocznego tekstu (WCAG 2.5.3)
- Pozycja listy kontrolnej: SP-18 (odpowiednik strony: czytnik ekranu i sterowanie głosem)
- Poziom: P2 (EN spełnia: „English” zawiera „En”; obejście istnieje — polecenie po nazwie „Polski”)
- Realność: realny dla sterowania głosem (Voice Control: „stuknij PL” nie trafia)   · Pewność: wysoka
- Rodzaj: D
- Dowód: `index.html:42` „aria-label="Polski"” przy widocznym „PL”; ten sam znacznik na wszystkich stronach, np. `trening/privacy.html:36`. `dowody/klawiatura.txt`: przystanek „Polski”.
- Wzorzec lub źródło: WCAG 2.2, 2.5.3 (odczyt 20.10.2026): „the name contains the text that is presented visually.” (`dowody/wcag22-cytaty.txt`)
- Kroki w aplikacji: Voice Control na iPhonie → „Stuknij PL” → brak trafienia.
- Opcje (dla P co najmniej dwie): (a) `aria-label="PL, Polski"` i `"EN, English"` — nazwa zaczyna się od widocznego tekstu; (b) usunąć `aria-label`, zostawić `PL`/`EN` z `lang` i `title` — czytnik przeczyta skrót. Rekomendacja: (a).
- Test akceptacyjny: nazwa dostępna każdego przycisku języka zaczyna się od widocznego tekstu (test DOM w `tests/site.test.mjs`).
- Status: otwarte

### 04-studio-projektowe-007 · Linki w stopce (37 px) i na kartach aplikacji (40 px) poniżej progu studia 44 px na dotyk
- Pozycja listy kontrolnej: SP-06 (moduł strona-www: „na dotyk studio trzyma 44 px”)
- Poziom: P2 (28–43 px; WCAG 2.5.8 24 px spełnione)
- Realność: realny (stopka: „Wsparcie” i „Prywatność” obok siebie z odstępem 8 px — to linki z przepływu P2)   · Pewność: wysoka
- Rodzaj: D
- Dowód: `dowody/klawiatura.txt` — „Wsparcie” 57×37, „Prywatność” 74×37 (stopka), „Polityka prywatności” 148×40, „Wsparcie” 64×40 (karty).
- `assets/site.css:186` „.stopka a{display:inline-block;padding-block:var(--o-2)}”
- `assets/site.css:185` „.stopka li a+a{margin-left:var(--o-2)}”
- `assets/site.css:117` „.app-linki a{display:inline-block;padding-block:var(--o-2)}”
- Wzorzec lub źródło: Podłogi dostępności (cel 44 pt, decyzja studia); WCAG 2.2, 2.5.8 „at least 24 by 24 CSS pixels” jako podłoga.
- Kroki w aplikacji: telefon → stopka → „Wsparcie” / „Prywatność” Treningu.
- Opcje (dla P co najmniej dwie): (a) `padding-block` 12 px (`--o-3`) i odstęp poziomy 16 px w stopce i kartach — cele ≥ 44 px, stopka wyższa o ok. 16 px na wiersz; (b) obniżyć próg studia dla stopki do 37 px decyzją właściciela. Rekomendacja: (a).
- Test akceptacyjny: `narzedzia/klawiatura.mjs` — wszystkie nie-inline cele ≥ 44 px wysokości przy 390 px; zrzuty wzorcowe zaktualizowane.
- Status: otwarte

### 04-studio-projektowe-008 · Na stronach wsparcia pytania FAQ (h3) mają ten sam rozmiar co nagłówek sekcji (h2)
- Pozycja listy kontrolnej: SP-13 (skala tekstu systemu: `docs/design/03-system.md:20` podaje h3 28 px; na podstronach h3 ma 22 px jak h2)
- Poziom: P2
- Realność: realny (obie strony wsparcia, przepływ P2)   · Pewność: wysoka
- Rodzaj: D
- Dowód: pomiar Playwrightem na `piekarz/support.html`: h2 Source Sans 3 22px 700, h3 Source Sans 3 22px 650, h3 margines 0/0 (390 i 1440 px). Zrzut `zrzuty/krytyka-faq-piekarz-support-320.png`. Źródło w CSS:
- `assets/site.css:191` „.dokument h2{font:700 var(--r-wieksza)”
- `assets/site.css:91` „font-size:var(--r-wieksza)” (globalne h3, bez reguły dla `.dokument h3`)
- Wzorzec lub źródło: zasady krytyki zrzutu, pkt 4 („Czy grupowanie i odstępy tworzą hierarchię”); zrzuty wzorcowe nie obejmują stron wsparcia (luka linii bazowej).
- Kroki w aplikacji: App Store → Wsparcie → „Pytania i odpowiedzi”: nagłówek sekcji i pytania wyglądają tak samo, pytanie przylega do poprzedniej odpowiedzi.
- Opcje (dla P co najmniej dwie): (a) `.dokument h3` 17–18 px 650 z odstępem 24 px nad — hierarchia h2 > h3, krótsza strona; (b) h2 podstron w Young Serif (rola krojów jak na głównej), h3 bez zmian. Rekomendacja: (a).
- Test akceptacyjny: na stronach wsparcia rozmiar h3 < h2 i odstęp nad h3 ≥ 16 px; zrzut 320/390 obu motywów dopisany do linii bazowej.
- Status: otwarte

### 04-studio-projektowe-009 · Wiersze indeksu espresso przy 320–390 px układają cenę i przeliczenie raz tak, raz inaczej
- Pozycja listy kontrolnej: SP-13 (wada samego systemu: wzorzec `index-390-*-calosc` ma ten sam układ)
- Poziom: P2
- Realność: realny (indeks to treść chroniona D-002; telefon to główne urządzenie)   · Pewność: wysoka
- Rodzaj: D
- Dowód: `zrzuty/krytyka-paragony-indeks-320.png` — „Włochy”: cena pod nazwą, przeliczenie w trzecim wierszu po lewej; „Polska”, „Brazylia”: cena w drugim wierszu po lewej, przeliczenie po prawej; przy 390 px „Polska”/„Brazylia”/„RPA” mają cenę po prawej w pierwszym wierszu, a przeliczenie pod spodem po lewej (`zrzuty/strona/index-390-jasny-calosc.png`). `assets/site.css:172` „.receipt .kraj{font-weight:650;flex:1 1 8em}” — zawijanie flex zależy od długości kwoty.
- Wzorzec lub źródło: zasady krytyki zrzutu, pkt 4; „indeks” to porównanie — kolumny muszą stać w tym samym miejscu.
- Kroki w aplikacji: telefon → „Indeks espresso” → porównanie cen między krajami.
- Opcje (dla P co najmniej dwie): (a) poniżej 600 px stały układ dwuwierszowy: kraj; cena po lewej + przeliczenie po prawej (siatka zamiast flex-wrap); (b) tabela `table` z trzema kolumnami i mniejszym krojem — czytelna semantyka, ciaśniej przy 320. Rekomendacja: (a).
- Test akceptacyjny: przy 320 i 390 px wszystkie wiersze mają cenę i przeliczenie w tych samych pozycjach (porównanie `getBoundingClientRect` wierszy); reflow bez przewijania.
- Status: otwarte

### 04-studio-projektowe-010 · Wersja EN nazywa tę samą aplikację na trzy sposoby
- Pozycja listy kontrolnej: SP-09
- Poziom: P2
- Realność: realny (gość EN, recenzent Apple)   · Pewność: wysoka
- Rodzaj: P
- Dowód (po EN):
- `index.html:61` „data-en="Training: Gym Log &amp; Rest Timer"”
- `index.html:64` „Trening path: stage 4 of 5”
- `index.html:132` „data-en="Training"”
- `trening/privacy.html:41` „data-en="Trening — Privacy Policy"”
- `index.html:133` „data-en="Crust"” — a na karcie „Crust (Piekarz): Sourdough Baking”, w opisie paska „Piekarz path”, na podstronach „Crust (Piekarz) — Privacy Policy”.
- Wzorzec lub źródło: Słownik interakcji — „Ta sama akcja ma tę samą nazwę w całym przepływie” (SP-09), tu: ten sam obiekt.
- Kroki w aplikacji: strona główna → EN → karta „Training…” → link „Privacy policy” → nagłówek „Trening — Privacy Policy”.
- Opcje (dla P co najmniej dwie): (a) w EN nazwa ze sklepu wszędzie („Training”, „Crust”) — spójnie z App Store, wymaga zmiany w eksporcie Treningu (D-022); (b) w EN nazwa polska z dopiskiem przy pierwszym użyciu („Trening (Training)”) — zgodnie z obecnymi podstronami, dłuższe etykiety. Rekomendacja: (a), decyzja właściciela (nazwy aplikacji w sklepie).
- Test akceptacyjny: po EN każda strona używa jednej, zapisanej w decyzjach nazwy każdej aplikacji (test tekstów w `tests/site.test.mjs`).
- Status: otwarte

### 04-studio-projektowe-011 · W trybie wymuszonych kolorów pasek etapów traci stan „zrobione” i znikają punktory list
- Pozycja listy kontrolnej: SP-05
- Poziom: P3
- Realność: brzegowy (Windows, motywy kontrastowe)   · Pewność: wysoka
- Rodzaj: D
- Dowód: `zrzuty/media/forced-colors-ciemny-index-390-aplikacje.png` — pięć jednakowych pustych prostokątów; bieżący etap odróżnia tylko szerokość, znacznik zamienia się w kwadrat; punktory „–” list cech znikają. `assets/site.css:128` „.d-zbior.zrobione::before{background:var(--e-zbior)}”, `assets/site.css:114` „.app-cechy li::before” (tło `currentColor`).
- Wzorzec lub źródło: Podłogi dostępności — „Kolor: nigdy jedyny nośnik informacji”; forced-colors nadpisuje tła.
- Kroki w aplikacji: Windows → Ustawienia → Motywy kontrastu → strona główna.
- Opcje (dla P co najmniej dwie): (a) `@media (forced-colors: active)` — odcinki „zrobione” wypełnione `CanvasText`, niezrobione z obwódką, `forced-color-adjust: none` dla znacznika; (b) bez zmian — dane etapu zostają w podpisach i `aria-label`. Rekomendacja: (a), 15 min.
- Test akceptacyjny: zrzut z `forcedColors: 'active'` odróżnia zrobione od niezrobionych i pokazuje punktory.
- Status: otwarte

### 04-studio-projektowe-012 · Samotne „w” w nagłówku ramki „Kolejne aplikacje w przygotowaniu.”
- Pozycja listy kontrolnej: SP-13 (typografia nagłówków; `text-wrap:balance` działa tylko na h1–h3, a to `p.kolejne-h`)
- Poziom: P3
- Realność: realny (320 px: „w” w osobnym wierszu; 390 px: na końcu wiersza)   · Pewność: wysoka
- Rodzaj: D
- Dowód: `zrzuty/krytyka-kolejne-indeks-320.png`; `index.html:88` „Kolejne aplikacje w przygotowaniu.”
- Wzorzec lub źródło: polska zasada składu (jednoliterowe spójniki i przyimki nie kończą wiersza); krytyka zrzutu.
- Kroki w aplikacji: telefon → sekcja aplikacji → ramka pod kartami.
- Opcje (dla P co najmniej dwie): (a) twarda spacja po „w” (`w&nbsp;przygotowaniu`) w PL i `text-wrap: balance` dla `.kolejne-h`; (b) bez zmian. Rekomendacja: (a).
- Test akceptacyjny: przy 320/390 px żaden wiersz nagłówka nie kończy się jednoliterowym słowem.
- Status: otwarte

### 04-studio-projektowe-013 · Podstrony bez `apple-touch-icon`, `theme-color` i `twitter:card`, które ma strona główna
- Pozycja listy kontrolnej: SP-22
- Poziom: P3
- Realność: brzegowy (dodanie podstrony do ekranu początkowego, podgląd linku w serwisach czytających `twitter:card`)   · Pewność: wysoka
- Rodzaj: D
- Dowód: `dowody/ikony-head.txt` — liczba tych znaczników: `index.html` 4, pozostałe 5 stron 0.
- Wzorzec lub źródło: moduł strona-www (spójny `<head>` każdej strony); iOS szuka ikony w znaczniku, inaczej używa zrzutu strony.
- Kroki w aplikacji: Safari na iPhonie → polityka prywatności → „Do ekranu początkowego”.
- Opcje (dla P co najmniej dwie): (a) dopisać trzy znaczniki do szablonu podstron i eksportu Treningu (D-022); (b) bez zmian. Rekomendacja: (a).
- Test akceptacyjny: test `<head>` w `tests/site.test.mjs` wymaga `apple-touch-icon` i `theme-color` na każdej stronie poza 404.
- Status: otwarte

### 04-studio-projektowe-014 · „Kopiuj” bez komunikatu, gdy schowek odmówi
- Pozycja listy kontrolnej: SP-10 (stan błędu)
- Poziom: P3
- Realność: brzegowy (Safari i Chrome zwykle pozwalają na zapis po kliknięciu)   · Pewność: wysoka
- Rodzaj: D
- Dowód: `dowody/klawiatura.txt` — bez uprawnienia: przycisk „Kopiuj”, status pusty, zaznaczony adres; z uprawnieniem: „Skopiowano” i status `role=status`. `assets/site.js:70` „var sel = function ()” — ścieżka zapasowa tylko zaznacza tekst.
- Wzorzec lub źródło: Macierz stanów, pkt 4 („Błąd: co się stało i co zrobić”).
- Kroki w aplikacji: przeglądarka bez dostępu do schowka → „Kopiuj” → nic się nie zmienia poza zaznaczeniem.
- Opcje (dla P co najmniej dwie): (a) w ścieżce zapasowej komunikat „Adres zaznaczony — skopiuj go (Ctrl+C / ⌘C)” w przycisku i statusie; (b) bez zmian. Rekomendacja: (a).
- Test akceptacyjny: `narzedzia/klawiatura.mjs` bez uprawnienia — status niepusty.
- Status: otwarte

### 04-studio-projektowe-015 · Odstęp przypisu indeksu zapisany w HTML zamiast z tokenu
- Pozycja listy kontrolnej: SP-03
- Poziom: P3
- Realność: teoretyczny dla użytkownika (wygląd poprawny), realny dla utrzymania   · Pewność: wysoka
- Rodzaj: D
- Dowód: `index.html:116` „style="margin-top:1.5rem"” — jedyny `style=` na stronach (`dowody/sp03-grep.txt`).
- Wzorzec lub źródło: SP-03 (wartości tylko z modułu motywu); token `--o-6` = 24 px.
- Kroki w aplikacji: brak skutku widocznego.
- Opcje (dla P co najmniej dwie): (a) reguła `.indeks-lista .przypis{margin-top:var(--o-6)}`; (b) bez zmian. Rekomendacja: (a).
- Test akceptacyjny: brak atrybutu `style=` w HTML stron.
- Status: otwarte

### 04-studio-projektowe-016 · Linia stanu aplikacji to ciąg „A · B · C” z kalibracji bez osobno zapisanej decyzji
- Pozycja listy kontrolnej: SP-12
- Poziom: P3
- Realność: realny (widoczny na kartach)   · Pewność: średnia (D-016 zatwierdza teksty z podglądu, ale nie wyjątek od kalibracji)
- Rodzaj: P
- Dowód: `index.html:67` „iPhone · 35 języków · TestFlight”; rozpoznanie roli 04 wymienia ten ciąg jako ślad szablonu starej strony: `docs/design/00-rozpoznanie.md:34`.
- Wzorzec lub źródło: Kalibracja domyślnych wyborów (wiersz „ciągi A · B · C”).
- Kroki w aplikacji: strona główna → karty aplikacji, wiersz pod paskiem.
- Opcje (dla P co najmniej dwie): (a) zapisać decyzję (wyjątek z powodem: krótkie metadane) — bez zmian w kodzie; (b) zdanie zwykłe („Na iPhone’a, w 35 językach. Dziś w TestFlight, App Store jesienią 2026.”). Rekomendacja: (b), bo „TestFlight” powtarza informację z paska.
- Test akceptacyjny: wpis w `docs/decyzje.md` albo linia bez ciągu „·”.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)
- **Nagłówki h1/h2 z `clamp(…vw…)`** rosną przy tekście 200 % tylko 1,28× (h1 92 → 118 px przy 1280; `dowody/tekst200-ruch-kontrast.txt`). Tekst jest już ponad 5× większy od treści, więc skutek dla czytelności jest wątpliwy; zgodność z 1.4.4 dla tak dużych nagłówków — `[DO USTALENIA]` (interpretacja Understanding 1.4.4). Kod 1 tego skryptu wynika z tych pozycji i z błędu 004 (pole „ruch no-preference”); reszta 0.
- **CLS na iPhonie:** pomiar lab używał Inter jako zastępczego `system-ui`; na iOS zastępczy SF Pro i Georgia. Potrzebny pomiar w Safari (Web Inspector) przy pierwszej wizycie — krok właściciela.
- **Skrzynka support@:** komentarze w HTML podstron mówią, że skrzynka działa „dopiero po weryfikacji DSA i założeniu Google Workspace”. Jeśli to nadal prawda, przepływ P2 kończy się na adresie, który nie odbiera poczty. Poza zakresem roli 04 — do koordynatora / roli 08. Te komentarze robocze są też publiczne w źródle strony.
- **Czytnik ekranu na żywo:** kolejność i nazwy sprawdzone w DOM; odczyt `figure role="img"` i przełączania `hidden` sekcji przez VoiceOver nie sprawdzony (brak macOS/iOS).
- **Ruch paska przy pierwszym pokazaniu:** animacja działa przy wczytaniu, nie „przy pierwszym pokazaniu” w widoku (na 390 px karty są poniżej pierwszego ekranu, więc gość zobaczy pasek już po animacji). Design-spec mówi „przy pierwszym pokazaniu” — czy chodziło o wejście w widok, `[DO USTALENIA]` z autorem systemu.

## Co działa dobrze i należy zachować
- Wierność systemowi: 34/34 zrzuty wzorcowe ≤ 0,09 % różnicy pikseli, tła równe tokenom (`dowody/sp13-porownanie.txt`).
- Klawiatura: 18–22 przystanki na głównej, kolejność jak czytanie, fokus 3 px w kolorze akcentu z odstępem 4 px, nic nie zasłania fokusu, link „Przejdź do treści” (`dowody/klawiatura.txt`).
- PL/EN pod jednym adresem: `lang`, tytuł, opis, alt, `aria-label`, sekcje dokumentów i pamięć wyboru po przeładowaniu działają; EN bez polskich resztek (`dowody/en-resztki.txt`).
- Kontrast: najniższa para tekstu 7,16:1 (jasny), 7,32:1 (ciemny), ≥ 10,46:1 przy `prefers-contrast: more` (`dowody/kontrast-zrzuty.txt`).
- Reflow 320–1440 i powiększenie 200 % bez przewijania w poziomie; 0 błędów konsoli i 0 nieudanych żądań na 60 kombinacjach (`dowody/zrzuty-reflow-konsola.txt`).
- Prywatność: CSP, `no-referrer`, kroje lokalne i jedyny zapis `a4b-lang` bez zmian wobec obecnej strony (`dowody/prywatnosc-csp.txt`); adresy z App Store Connect i `CNAME` na miejscu (`dowody/adresy-stara-vs-nowa.txt`).
- Wydajność lab: LCP 56–92 ms (desktop), 516–908 ms (telefon, Slow 4G + CPU 4×); waga 122–202 kB (ok. 107–169 kB po gzip), z czego kroje to ok. 140 kB na głównej (`dowody/lcp-cls-waga.txt`).
- Element firmowy z danymi i opisem dla czytnika, „nic tylko kolorem” spełnione (skala szarości: `zrzuty/media/szarosc-karta-trening-1440-ciemny.png`).

## Decyzje dla właściciela
1. **Nazwy aplikacji w EN (010):** (a) nazwy ze sklepu wszędzie („Training”, „Crust”) — rekomendacja; (b) nazwa polska z dopiskiem. Wymaga też zmiany eksportu Treningu (D-022).
2. **Pasek na obrazie OG (003):** (a) pasek jako neutralna legenda drogi — rekomendacja; (b) prawdziwy etap 4/5; (c) bez zmian.
3. **Linia praw Apple (005):** (a) w stopce wszystkich stron — rekomendacja; (b) tylko na politykach; (c) dopiero z przyciskiem App Store.
4. **Próg 44 px na dotyk dla stopki (007):** (a) powiększyć cele — rekomendacja; (b) zapisać wyjątek 37 px.
5. **Ciąg „·” (016):** (a) zapisać wyjątek; (b) zdanie zwykłe — rekomendacja.
6. **Kroki właściciela (czego agent nie zrobi):** pomiar CLS i powiększenia tekstu „aA” w Safari na iPhonie przy pierwszej wizycie (ok. 10 min); odsłuch VoiceOver na podstronie polityki (ok. 10 min).

Czas: naprawy 001–016 to ok. 3–4 h pracy agenta (rola 08 + aktualizacja zrzutów wzorcowych przez rolę 04), bez czekania poza CI; od właściciela 4 decyzje (ok. 10 min) i 2 sprawdzenia na iPhonie.

## Proponowane polecenie naprawy
`node tools/assemble.mjs 04-studio-projektowe --tryb fix --zadania 04-studio-projektowe-001,04-studio-projektowe-002,04-studio-projektowe-004,04-studio-projektowe-006,04-studio-projektowe-007,04-studio-projektowe-008,04-studio-projektowe-009,04-studio-projektowe-011,04-studio-projektowe-012,04-studio-projektowe-013,04-studio-projektowe-014,04-studio-projektowe-015`

Po decyzjach właściciela dopisać 003, 005, 010, 016. Zmiany w `assets/` i HTML wykonuje rola 08 w ramach systemu (zasada wspólna 15); zmiany szablonu podstron Treningu także w eksporcie (D-022).
