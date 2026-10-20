# Design spec: apps4brew.com „Od ziarna do filiżanki” (rola 04 build, E4, 20.10.2026)

Krótko, z odnośnikami. Decyzje: `docs/decyzje.md` D-008–D-015. Świat i źródła: `01-swiat.md`, `01-zrodla.md`, `02-zrodla.md`. Kierunki i test generyczności: `02-kierunki.md`, `porownanie.png`. System: `03-system.md`.

## Idea
Każda aplikacja studia przechodzi drogę kawy: zbiór → obróbka → palenie → parzenie → podanie = research → projekt → budowa z testami → testy z ludźmi (TestFlight) → App Store (D-009, D-010). Strona pokazuje, gdzie na tej drodze jest dziś każda aplikacja. Indeks espresso jest cennikiem na tablicy z wsuwanymi literami (D-011).

## Element firmowy: droga ziarna
- Dane: etap aplikacji (stała `ETAP` w `narzedzia/podglad.mjs`; dziś Trening 4/5, Piekarz 4/5). Zmiana etapu = zmiana klas `zrobione`/`teraz` w HTML i opisu `aria-label`.
- Dostępność: `figure role="img"` z opisem PL/EN (`data-label-pl/en`); etap odróżnia wypełnienie + kreskowanie + znacznik + podpis, nie sam kolor; obwódka 2 px (3 px przy zwiększonym kontraście).
- Ruch: „palenie” odcinków przy pierwszym pokazaniu (5 × 140 ms); wyłączone przy `prefers-reduced-motion`.
- Wąski ekran: pionowo na stronie głównej, zwarto (poziomo, bez podpisów etapów studia) na podstronach i 404.

## Pliki dla roli 08 (wyłącznie z systemu)
| Dziś | Po zmianie | Źródło |
|---|---|---|
| `assets/site.css` | zastąpić | `system/site.css` |
| `assets/site.js` | zastąpić (te same identyfikatory i `localStorage a4b-lang`) | `system/site.js` |
| `fonts/` (Bricolage, Instrument Sans, JetBrains Mono) | zastąpić | `fonty/woff2/` (Young Serif, Source Sans 3, Barlow Condensed + licencje OFL) |
| `assets/favicon.svg`, `assets/apple-touch-icon.png` | zastąpić | `ikona/favicon.svg`, `ikona/apple-touch-icon.png` |
| `index.html`, `404.html`, `piekarz/*.html` | nowy układ, ta sama treść | `system/podglad/` |
| `trening/*.html` | nowy układ przez eksport z repo Trening | szablon: `system/podglad/trening/privacy.html` |
| `assets/og-image.png` | bez zmian w tym przebiegu (obraz w starym stylu) `[DO DECYZJI: nowy obraz OG]` | — |
| `tests/site.test.mjs` | zmiana testu krojów (rodziny z D-014) | rola 08 / M6 |

## Strona AS IS → TO BE (adresy bez zmian)
| Adres | AS IS | TO BE |
|---|---|---|
| `/` (Marketing URL, D-003) | filiżanka z parą, karty, paragony indeksu, Bricolage | hasło w Young Serif, droga ziarna przy aplikacjach, zasady „Jak robimy aplikacje”, tablica indeksu + wiersze ze źródłami, studio i kontakt |
| `/#apps`, `/#piekarz`, `/#how`, `/#index`, `/#about`, `/#top`, `/#main` | kotwice | te same kotwice |
| `/trening/privacy.html`, `/trening/support.html` (App Store Connect) | stary nagłówek | nowy nagłówek, tytuł + droga ziarna aplikacji, treść PL/EN bez zmian |
| `/piekarz/privacy.html`, `/piekarz/support.html` (App Store Connect) | jw. | jw. |
| `/404.html` | „Ta filiżanka jest pusta.” | „Tego ziarna tu nie ma.” + pusta droga, absolutne ścieżki `/assets/` |
| `CNAME`, `.nojekyll`, CSP, brak śledzenia, kroje lokalne | — | bez zmian |

## Przycisk App Store (na później, po wydaniu)
Tylko oficjalna grafika Apple, czarna preferowana, jedna na układ, minimum 40 px wysokości na ekranie, wolne pole ¼ wysokości, bez zmian i animacji, „App Store” nietłumaczone (moduł strona-www, Apple Marketing Guidelines). Dziś niepotrzebny: aplikacje w TestFlight, test zabrania linku.

## Linia bazowa audytu
`wzorce-zrzuty/` (34 pliki). Weryfikacja wdrożenia: rola 04 `audit` porównuje zbudowane strony ze zrzutami, kontrast (`kontrast/e3-tokeny.txt`), `warsztat.mjs` i tekst 200 %.

## Proponowany wpis do pamięci portfolio (dopisuje właściciel w repo `prompts`)
| Aplikacja | Metafora / element firmowy | Paleta (rdzeń) | Kroje | Uwagi właściciela |
|---|---|---|---|---|
| Strona studia apps4brew.com („Od ziarna do filiżanki”) | Droga kawy = droga aplikacji (zbiór, obróbka, palenie, parzenie, podanie); pasek etapów pokazuje etap każdej aplikacji; tablica z wsuwanymi literami jako cennik indeksu espresso; ikona: cyfra 4 nad paskiem | zielone ziarno `#E9EDE0`, palone ziarno `#1C1410`, tusz `#24170F`, owoc kawowca `#8A1B2D`; etapy `#A3233A` `#7C8D60` `#8A5A36` `#4A2D1E` `#B9853B` | Young Serif (tytuły), Source Sans 3 (treść), Barlow Condensed (tylko tablica) | 20.10.2026: „Podoba mi sie B + C ale A nie”; „A2 - to dla sekcji o aplikacjach a dla sekcji o indeksie espresso B?”; krój szablonowy odrzucony: „osacza”, „wojskowa”. Droga ziarna i bordo owocu należą do strony studia. |
