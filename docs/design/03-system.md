# E3 system: strona apps4brew.com, kierunek A2 „Od ziarna do filiżanki” (rola 04 build, 20.10.2026)

Decyzje: D-011 (A2 + tablica B w indeksie), D-010 („parzenie”), D-014 (Young Serif; zastępuje D-012 po wecie D-013). „Warsztat grafika” (D-040 biblioteki) stosowany.

## Pliki
| Plik | Co to jest |
|---|---|
| `system/site.css` | tokeny (jasny, ciemny, zwiększony kontrast) i komponenty; propozycja `assets/site.css` dla roli 08 |
| `system/site.js` | obecny skrypt strony (język, Kopiuj) + przestawianie liter tablicy przy zmianie języka; propozycja `assets/site.js` |
| `system/podglad/` | cała strona w układzie katalogów strony (index, 4 podstrony, 404, assets, fonts); generator `narzedzia/podglad.mjs`; treść bez zmian z repo |
| `fonty/woff2/` | kroje do `fonts/`: Young Serif, Source Sans 3 (400–700), Barlow Condensed 600; podzbiory latin + Latin Extended-A, licencje OFL; razem 165 kB (obecna strona: ok. 186 kB + 53 kB latin-ext) |
| `ikona/` | `favicon.svg` (jasny/ciemny przez `prefers-color-scheme`), `apple-touch-icon.png` 180 px (bez kanału alfa, `ikona.mjs` kod 0), `ikona-1024.png`, `ikona-ciemna-1024.png`, warstwy `ikona.svg`, `ikona-ciemna.svg`, arkusz `arkusz.png` |
| `kontrast/e3-tokeny.txt` | tabela kontrastu tokenów (skrypt `narzedzia/kontrast.mjs`) |
| `wzorce-zrzuty/` | linia bazowa audytu: strona główna, polityka Treningu, 404 × 320/390/768/1024/1440 × jasny/ciemny (pierwszy ekran) + całe strony główne 390 i 1440 |
| `system/testy-podglad.txt` | wynik `node --test` na kopii repo z podglądem |

## Tokeny (skrót; pełne w `system/site.css`)
- **Barwy** jasny/ciemny: tło `#E9EDE0`/`#1C1410`, tusz `#24170F`/`#F0E8DC`, tusz-2 `#584A3F`/`#C2B4A4`, akcent (owoc kawowca) `#8A1B2D`/`#EC8796`; etapy drogi: `#A3233A` `#7C8D60` `#8A5A36` `#4A2D1E` `#B9853B` (ciemny: jaśniejsze odpowiedniki); tablica: filc `#2A2A2C`/`#0F0F10`, litery `#F4F2EC`, rama dąb. Zwiększony kontrast (`prefers-contrast: more`): tusz-2 = tusz, akcent `#6E1222`/`#F6B3BD`, linie i obwódki mocniejsze.
- **Kroje:** tytuły Young Serif (400, małymi i wielkimi literami), treść Source Sans 3, litery tablicy Barlow Condensed 600 (tylko tablica).
- **Skala tekstu (6):** 15 px (małe), 17–18 px (treść), 22 px (wiodący), 28 px (h3), h2 `clamp(2rem…3.25rem)`, h1 `clamp(2.75rem…6rem)`; interlinia treści 1,4, tytułów 1,05–1,1.
- **Odstępy:** jednostka 4 px (4–80), marginesy `clamp(16px, 5vw, 80px)`, kolumna tekstu 66 znaków. **Punkty przełamania:** 600, 1024, 1280 px.
- **Promienie (hierarchia):** paski i sekcje 0; przyciski 4 px; rama tablicy 6 px; ikony aplikacji 22 %.
- **Ruch:** pasek „pali się” 500 ms, odstęp 140 ms; litery tablicy 320 ms, odstęp 14 ms; `prefers-reduced-motion`: bez ruchu. Strona bez dźwięku i haptyki.

## Komponenty
Systemowe (przeglądarka): odnośniki, przyciski, nagłówki, listy. Własne: nagłówek (logo, menu sekcji od 600 px, przełącznik PL/EN), **droga ziarna** (element firmowy; `figure role="img"` z opisem PL/EN w `aria-label`, np. „Droga aplikacji Trening: etap 4 z 5, parzenie, czyli testy z ludźmi (TestFlight).”), karta aplikacji, tablica indeksu (`aria-hidden`, dane w tekście obok), wiersz indeksu (`.receipt`), stopka z linkami prywatności i wsparcia obu aplikacji oraz „Warunki” (licencja Apple), szablon podstrony (`main.dokument`, droga ziarna aplikacji pod tytułem, sekcje `section[lang][data-lang-section]` jak w eksporcie Treningu), 404 („Tego ziarna tu nie ma.”, pusta droga). Przycisk App Store: niepotrzebny do wydania (TestFlight; test zabrania linku), wzór w E4 według zasad Apple.

## Pomiary (20.10.2026)
- **Kontrast:** wszystkie pary progowe spełnione w obu motywach; zwiększony kontrast ≥ 7:1 dla tekstu (`kontrast/e3-tokeny.txt`).
- **Warsztat** (`warsztat.mjs`, podgląd: główna i polityka, 390 i 1024 px): 0 błędów; ostrzeżenia: 6–8 wielkości (w tym litery tablicy i logo), 5 kolorów tekstu na głównej (w tym litery tablicy i tekst na przycisku) — grafika i komponenty, nie hierarchia treści.
- **Szerokości 320–1440:** bez przewijania w poziomie. **Tekst 200 %** (WCAG 1.4.4, 390 i 1280 px, 3 strony): bez przewijania i ucięć (po poprawce: łamanie długiego adresu e-mail i słów).
- **Testy strony na kopii repo z podglądem:** 21/22. Jedyny błąd: test „czcionki lokalne istnieją, każda rodzina ma licencję OFL” wymaga rodzin Bricolage Grotesque, Instrument Sans, JetBrains Mono. Zmiana testu należy do roli 08 / M6 razem z D-014 (rola 04 nie zmienia testów).

## Dla roli 08 i M6 (znaleziska)
- Eksport Treningu (`scripts/site/export-apps4brew.mjs` w repo Trening) musi wytwarzać nowy nagłówek, `main.dokument` z h1 i drogą ziarna, nową stopkę; struktura sekcji PL/EN bez zmian. Bez tego następny eksport przywróci stary wygląd. **Realny.**
- GitHub Pages opublikuje cały `docs/` (makiety, kroje, narzędzia), nie tylko `kierunki/` — zakres sprzątania przed scaleniem do ustalenia (D-006).
- Wiersze indeksu mają widoczną etykietę „espresso*” w każdym wierszu (wymóg testu); można ją uprościć przy zmianie testu.
