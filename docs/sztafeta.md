# Stan sztafety
Ścieżka: strona WWW od zera (M6) · Aktualizacja: 20.10.2026

| Rola | Tryb | Stan | Commit | Artefakty | Otwarte decyzje |
|---|---|---|---|---|---|
| 04 Studio Projektowe | build (strona-www, render-i-krytyka, pamiec-portfolio) | zakończona 20.10.2026 | zob. `git log` gałęzi `strona/apps4brew-2026-10-20` | `docs/design/` (design-spec.md, 01–03, system/, ikona/, wzorce-zrzuty/) | rozstrzygnięte: D-016–D-022 |
| 08 Programista | build (subagent M6, 2 partie) | zakończona 20.10.2026 | 9b48a41…9e5a014 | strona w katalogu głównym, testy `tests/` (38) | — |
| 04 Studio Projektowe | audit (weryfikacja M6 E3, świeży kontekst) | zakończona 20.10.2026 | 5a371ac | `docs/m6/weryfikacja-04.md` (P0 0, P1 0, P2 10, P3 6) | 5 decyzji w raporcie |
| M6 Strona WWW | build | zakończona, opublikowana 20.10.2026 | 91f3779 (main) | `docs/m6/raport-koncowy.md`, `docs/m6/postep.md` | eksport Treningu (D-022), App Store Connect (D-003), generator a/b |

## Następny krok
Eksport Treningu: nowy szablon podstron w `scripts/site/export-apps4brew.mjs` na gałęzi `f020-sklep` repo `lkarwowski494/trening` (D-022; lista zmian szablonu: `docs/m6/naprawy-08.md`, sekcja „Do przeniesienia do eksportu Treningu”). Przyszłe zmiany aplikacji na stronie: decyzja właściciela a (lista kroków) / b (generator z apps.json).
