Jesteś nową sesją przebiegu M6 (strona WWW od zera), rola 04 Studio Projektowe w trybie build. Plan zatwierdził właściciel 20.10.2026 (docs/decyzje.md D-001–D-005 na gałęzi strona/apps4brew-2026-10-20).

Start:
1. Biblioteka jest w prywatnym repo lkarwowski494/prompts: dołącz je narzędziem add_repo (owner lkarwowski494, repo prompts, access read) i sklonuj zgodnie z wynikiem.
2. Złóż prompt: node <prompts>/tools/assemble.mjs 04-studio-projektowe --tryb build --data 2026-10-20 --moduly strona-www,render-i-krytyka,pamiec-portfolio --galaz strona/apps4brew-2026-10-20 --plik <scratchpad>/04-build.md --statystyki
3. Przeczytaj go w częściach do ostatniej linii; podaj jej ostatni nagłówek. Zalecana sesja: opus, wysiłek high.

Wejście:
- repo strony https://github.com/lkarwowski494/apps4brew-www (publiczne), gałąź strona/apps4brew-2026-10-20; opublikowana strona https://apps4brew.com (GitHub Pages z main — niczego nie scalaj do main);
- cel strony (D-001, słowa właściciela 20.10.2026): „a) Wizytowka i warygodnosc studia dla klientow/inwestorow b) informacja: polityki i wsparcie c) pobrania”;
- „zachować” (D-002, 20.10.2026): „hasło „tańsze niż espresso” i indeks espresso; sekcja „Jak robimy aplikacje”; PL/EN pod jednym adresem”;
- inwentarz (treść, nie wzorzec): docs/m6/inwentarz.md; adresy, które muszą działać: docs/m6/adresy.txt (oznaczone „sklep” = App Store Connect, D-003);
- tryb build z modułem strona-www, sekcja „Strona od zera”; STOP-y E1–E3 przekazujesz właścicielowi bez skracania, ze zrzutami (porownanie.png na gałęzi);
- sieć z chmury 20.10.2026: awwwards.com nie odpowiadał (przekroczony czas) — sprawdź sam, niedostępne źródła zapisz jako „nie sprawdzono”; cssdesignawards.com i developer.apple.com odpowiadały;
- ograniczenia: statyczny HTML/CSS z minimalnym JS, bez nowych zależności i usług; CSP, brak śledzenia i fonty lokalne zostają; testy strony (tests/site.test.mjs) skanują każdy plik .html/.css/.js/.svg w repo poza tests/ — nie zmieniaj testów; jak traktować pliki w docs/design/ rozstrzyga D-006 w docs/decyzje.md (przeczytaj przed pierwszym commitem);
- polityka i wsparcie Treningu są generowane z repo aplikacji Trening (scripts/site/export-apps4brew.mjs) — szablon podstrony projektuj tak, żeby dało się go przenieść do eksportu (wdrożenie to osobny krok);
- commity „[M6/04] <co>” na gałęzi strona/apps4brew-2026-10-20, push tylko na nią; na każdym STOP zaktualizuj docs/m6/postep.md.

Po E4 roli 04: odpowiedź do 15 linii: ścieżki wyników (docs/design/…), wybrany kierunek ze słowami właściciela i datą, liczby, czego nie sprawdzono, kroki właściciela. Właściciel wraca z nią do koordynatora M6 (E1.3 sprawdzenie, potem STOP 2).
