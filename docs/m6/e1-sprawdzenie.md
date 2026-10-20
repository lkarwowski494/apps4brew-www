# M6 E1.3: sprawdzenie wyników roli 04 (20.10.2026, HEAD b6a8b63)

| Wymóg (M6 E1.3) | Wynik | Dowód |
|---|---|---|
| `design-spec.md` z tabelą AS IS → TO BE, adresy bez zmian | jest; 6 adresów + 7 kotwic bez zmian | `docs/design/design-spec.md`; kotwice `#apps #piekarz #how #index #about #top #main` w `system/podglad/index.html` (grep, 7/7) |
| tokeny jako zmienne CSS z tabelą kontrastu | jest | `system/site.css`, `kontrast/e3-tokeny.txt` |
| zrzuty wzorcowe 320–1440 | 34 pliki: główna, polityka Treningu, 404 × 5 szerokości × 2 motywy + całe główne | `wzorce-zrzuty/`; brak wzorców wsparcia i Piekarza (ten sam szablon co polityka Treningu) |
| favicon i ikona dotykowa | są | `ikona/favicon.svg`, `ikona/apple-touch-icon.png` |
| testy na podglądzie | 21/22 (powtórzone przez M6 na kopii repo z podglądem w miejscu strony): błąd tylko testu krojów (D-014) | `node --test`, kopia w scratchpadzie |
| treść podstron przeniesiona | sekcje PL i EN wszystkich 4 podstron identyczne z obecnymi | porównanie tekstu sekcji `data-lang-section` (skrypt M6) |

## Znaleziska
- **E1-01 (P1, realny): sześć zasad „Jak robimy aplikacje” w podglądzie nie ma wersji EN** (`<li><h3>…</h3><p>…</p>` bez `data-pl/data-en`); po przełączeniu na EN zostają po polsku. Sekcja jest na liście „zachować” (D-002), a PL/EN pod jednym adresem też. Test „każdy data-pl ma data-en” tego nie łapie (brak atrybutów to nie para). Naprawa w E2 (rola 08): teksty EN z obecnej strony + test „każdy tekst data-en z obecnej strony jest na nowej” albo „sekcje mają teksty w obu językach”.
- **E1-02 (decyzja właściciela): zmiany treści strony głównej względem obecnej.** Znikają: „Pierwsza filiżanka już gotowa.” (zastąpione „Od ziarna do filiżanki”), etykiety „Wkrótce”, „O studiu”, „Studio aplikacji · Warszawa” (→ „Studio aplikacji z Warszawy”), metka „miesiąc subskrypcji / < 1 espresso” (treść przeniesiona na tablicę: „Aplikacja < 1 espresso”). Meta aplikacji przeredagowana. Zasada M6 2: usunięcie lub zmiana treści to decyzja właściciela.
- **E1-03 (brzegowy): podstrony i 404 bez `canonical` i Open Graph** — jak dziś; moduł `strona-www` wymaga canonical i 4 tagów OG na stronę. Do zrobienia w E2.
- **E1-04 (realny): eksport Treningu** nadpisze nowy szablon `trening/*.html` przy następnym eksporcie (zgodne z raportem roli 04).
- **E1-05 (realny): sprzątanie przed publikacją.** `docs/` ma 17 plików HTML i ok. 4,9 MB HTML/CSS/JS/krojów (kierunki 3,7 MB, fonty 4,4 MB z TTF); GitHub Pages opublikowałby je pod apps4brew.com/docs/…
- Rozbieżność kanału: raport roli 04 przyszedł z sesji `session_01DQnTDKhuJ85JV9AmgTMxDg`, a M6 otworzył `session_01A9d3G7Ty7Xn3HtdgJLeX3e`; treść raportu zgadza się z gałęzią (commity 3fd2a94…b6a8b63), więc przyjęta.
