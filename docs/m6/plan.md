# Plan M6 apps4brew.com (STOP 1, 20.10.2026)

## Cel strony i „zachować” (STOP 1, 20.10.2026, docs/decyzje.md D-001–D-003)
- Cel, od najważniejszego: „a) Wizytowka i warygodnosc studia dla klientow/inwestorow b) informacja: polityki i wsparcie c) pobrania”.
- Zachować: „hasło „tańsze niż espresso” i indeks espresso; sekcja „Jak robimy aplikacje”; PL/EN pod jednym adresem”.
- Adresy App Store Connect: „Jeszcze nie wpisalismy ale chce zeby odosily sie do tej strony” → 4 adresy apps4brew.com + `/` jako marketing.

## Strony do zbudowania (adresy bez zmian)
1. `/` strona główna (nowy projekt od zera; treść z inwentarza).
2. Szablon dokumentu → `/trening/privacy.html`, `/trening/support.html`, `/piekarz/privacy.html`, `/piekarz/support.html` (treść bez zmian; Trening generowany z repo aplikacji — szablon trzeba przenieść też do `export-apps4brew.mjs` w repo Trening, krok osobny).
3. `/404.html`.
Opcjonalnie (decyzja w E1/STOP 2): `robots.txt`, `sitemap.xml`, OG i canonical na podstronach. Osobne adresy EN odpadają (D-002).

## Role i sesje
| Etap | Rola, tryb, moduły | Sesja |
|---|---|---|
| E1 projekt | 04 build: strona-www, render-i-krytyka, pamiec-portfolio (`prompty/04-build.md`, ~18,9 tys. tokenów) | rekomendacja: nowa sesja właściciela (trzy STOP-y okiem); alternatywa: subagent tej sesji |
| E2 wdrożenie | 08 build (`prompty/08-strona.md`, ~13,6 tys.; uwaga: składacz dołącza domyślny moduł `sqlite-expo`, zbędny dla strony) | subagent, partiami: główna → punkt kontrolny → podstrony + 404 |
| E3 weryfikacja | 04 audit: strona-www, render-i-krytyka (`prompty/04-po.md`) | świeży subagent bez inwentarza |
| E4 raport | M6 | ta sesja |

## Koszt [OCENA, hipoteza do kalibracji]
- Tokeny: 04 build 0,75–1 mln; 08: (47,5 tys. zn. promptu + ~76 tys. zn. stron)/3 ≈ 41 tys. × 2–4 na partię × 3 partie ≈ 0,25–0,5 mln; weryfikacja 0,25–0,35 mln; M6 0,15–0,3 mln. **Razem ≈ 1,4–2,2 mln tokenów.**
- Czas agenta: E1 3–5 h, E2 2–4 h, E3 ~1 h, E4 ~0,5 h.
- Czekanie: zrzuty Playwright, CI GitHub (~1 min na push).
- Twój czas: STOP 1 (~15 min), trzy STOP-y roli 04 (~20 min każdy, w tym wybór kierunku okiem), STOP 2 + punkt kontrolny (~20 min), STOP końcowy (~20 min) ≈ 2 h; plus App Store Connect, jeśli adresy trzeba zmienić (nie trzeba, gdy zostają).
- Pieniądze: 0 zł (GitHub Pages, bez nowych usług).

## Decyzja
(a) pełny przebieg, rola 04 w nowej sesji właściciela (D-004, 20.10.2026).
