# Raport dowodów: 08 Programista, tryb fix — apps4brew.com (M6) — 2026-10-20

Gałąź `strona/apps4brew-2026-10-20`, start 90ce8f4, 17 commitów lokalnych (bez push, `main` nietknięty). Środowisko: Linux, Node v22.22.0, Playwright 1.56.1 + Chromium z `/opt/node-tools`, serwer `python3 -m http.server 8765` (dowody/00-srodowisko.txt). Stan wyjściowy: `node --test` 38/38, kod 0 (dowody/00-baza-node-test.txt). Stan końcowy: `node --test` 54/54, kod 0 (dowody/koniec-node-test.txt). `tests/tresc-podstron.json` i `tests/zasady.json` bez zmian (git diff pusty).

E0 rozstrzygnięty przez właściciela (D-023, D-024). Klasyfikacja: D = 001, 002, 004, 006, 007, 008, 009, 011, 012, 013, 014, 015; P (rozstrzygnięte D-024) = 003, 005, 010, 016; M = brak. Testy przeglądarkowe leżą w `docs/m6/narzedzia/` (nazwy `fix-NNN-*.mjs`, `cls-lab.mjs`; celowo bez wzorca `test-*`, żeby `node --test` ich nie podejmował), testy treści i kodu w `tests/site.test.mjs`.

## Tabela dowodów

| ID | Test czerwony (dowód) | Poprawka (plik:linia) | Commit | Wynik |
|---|---|---|---|---|
| 001 | `cls-lab.mjs` (390 px, Slow 4G, CPU 4×): trening/support 0,1748, piekarz/support 0,1749 (dowody/001-przed-cls.txt); `node --test`: brak „Source Sans 3 Fallback” (dowody/001-czerwony-node-test.txt) | `assets/site.css:17` (@font-face zastępcze z size-adjust i nadpisaniem metryk), `assets/site.css:29` (stos krojów) | d4d50a5 | CLS 0,0342 / 0,0344, max na 6 stronach 0,0344 (dowody/koniec-cls.txt) |
| 002 | `fix-002-podpisy.mjs`: 15/102 ok; podpis 10,88 px przy 320 px, ×1,00 przy tekście 200 % (dowody/002-czerwony.txt) | `assets/site.css:141` i reguła `max-width:599px` w `assets/site.css:210` (podpisy ukryte, `.d-etap` jako tekst); `trening/support.html:44` (analogicznie w 3 pozostałych podstronach) | 431c09b | 39/39 ok, 15 px → 30 px (dowody/002-zielony.txt) |
| 003 | `node --test`: ok. 6150 pikseli w barwie każdego etapu „zrobione” w obrazie (dowody/003-czerwony-node-test.txt, dowody/003-og-przed.png) | `docs/m6/narzedzia/og-image.mjs` (odcinki bez klasy zrobione), regeneracja `assets/og-image.png` | ac1b1a3 | 0 pikseli w barwach etapów (dowody/003-og-po.png) |
| 004 | `fix-004-tablica.mjs`: pierwszy klik EN bez zapisanego języka wsuwa=0, 8/9 ok (dowody/004-czerwony.txt) | `assets/site.js:58` | 3821a1e | 9/9 ok (dowody/004-zielony.txt) |
| 005 | `node --test`: index.html bez linii praw Apple (dowody/005-czerwony-node-test.txt) | `index.html:140` i ta sama linia w stopkach 4 podstron; `assets/site.css:199` | 2342817 | 54/54 w tym teście; źródło: dowody/005-zrodlo.txt |
| 006 | `node --test`: 404.html, nazwa „Polski” nie zaczyna się od „PL” (dowody/006-czerwony-node-test.txt) | `index.html:42` i nagłówek na 5 pozostałych stronach | df7c37f | nazwy „PL, Polski” i „EN, English” (dowody/006-zielony-node-test.txt) |
| 007 | `fix-007-cele.mjs`: 257/461 ok; stopka 37,0 px, karty 39,8 px (dowody/007-czerwony.txt) | `assets/site.css:124`, `assets/site.css:197`, `assets/site.css:198` | dfb811a | 446/446 ok; stopka 45,0 px (dowody/007-zielony.txt) |
| 008 | `fix-008-faq.mjs`: 12/66 ok; h3 22 px = h2 22 px (dowody/008-czerwony.txt) | `assets/site.css:205` | 97455e1 | 66/66 ok (dowody/008-zielony.txt) |
| 009 | `fix-009-indeks.mjs`: 28/48 ok; wiersze o różnym układzie przy 320 i 390 px (dowody/009-czerwony.txt) | `assets/site.css:186` | 36f028b | 48/48 ok (dowody/009-zielony.txt) |
| 010 | `node --test`: „Trening path: stage 4 of 5…” w tekście EN (dowody/010-czerwony-node-test.txt) | `index.html:61`, `index.html:64`, `index.html:76`, `index.html:79` (data-en, alt, aria-label); `trening/support.html:8`, `trening/support.html:42` (tytuł i h1 EN; analogicznie 3 pozostałe podstrony) | 88dc429 | 54/54; ograniczenie w sekcji niżej |
| 011 | `fix-011-forced-colors.mjs` (forcedColors active): 8/16 ok; „zrobione” = niezrobione, punktor = tło (dowody/011-czerwony.txt, dowody/011-przed-forced-colors.png) | `assets/site.css:216` | 679b62d | 16/16 ok (dowody/011-zielony.txt, dowody/011-po-forced-colors.png) |
| 012 | `fix-012-spojnik.mjs`: 16/20 ok; „w” samo w wierszu przy 320 px (dowody/012-czerwony.txt) | `index.html:88`, `assets/site.css:126` | d9468ae | 19/19 ok (dowody/012-zielony.txt) |
| 013 | `node --test`: trening/privacy.html bez apple-touch-icon (dowody/013-czerwony-node-test.txt) | `trening/support.html:12`, `trening/support.html:27` (i 3 pozostałe podstrony) | 74567f5 | 50/50 w momencie commitu |
| 014 | `fix-014-kopiuj.mjs`: odmowa schowka i brak API, status pusty (dowody/014-czerwony.txt) | `assets/site.js:66`, `assets/site.js:78` | 195001c | 48/48 ok (dowody/014-zielony.txt) |
| 015 | `node --test`: index.html z atrybutem style= (dowody/015-czerwony-node-test.txt) | `assets/site.css:178`, `index.html` bez style= | 92573a7 | computed margin-top 24 px, bez zmiany wyglądu (dowody/015-po-margin.txt) |
| 016 | `node --test`: „iPhone · 35 języków · TestFlight…” (dowody/016-czerwony-node-test.txt) | `index.html:67`, `index.html:82` | c9fe480 | 53/53 w momencie commitu |
| D-026 | `node --test`: komentarz „[UWAGA 14.10.2026]…” w piekarz/privacy.html (dowody/D-026-czerwony-node-test.txt) | usunięta 1 linia z każdej z 4 podstron | 370dc86 | 54/54 |

Po każdym commicie pełne `node --test` było zielone (zapisy w katalogu dowodów, pliki o nazwach kończących się na „-zielony-node-test.txt”). Uwaga: przy 011 pierwszy commit miał błędny regex w nowym teście (test czerwony na własnym kodzie); poprawiono przez `--amend` przed dalszą pracą (lokalnie, bez push), czerwony przebieg powtórzony na CSS z commitu poprzedniego (dowody/011-czerwony-node-test.txt).

## Szczegóły decyzji wykonawczych

- 001: krój zastępczy Arial (potem „Liberation Sans” jako źródło `local()` na Linuksie) i Times New Roman; liczby z tablic metryk fontTools: średnia szerokość znaku na tekstach stron 0,4205 (Source Sans 3) wobec 0,4525 (Arial) daje size-adjust 92,93 %; Young Serif 0,5128 wobec 0,4121 (Times) daje 124,4 %; ascent/descent = metryka docelowa / size-adjust. To rachunek z przybliżeniem (jedna waga). Na iPhonie (SF Pro, Arial) `[DO USTALENIA]`.
- 002: wariant (c) z raportu: poniżej 600 px na podstronach małe podpisy zniknęły, pod paskiem stoi jeden podpis „Etap 4 z 5: parzenie (TestFlight)” / „Stage 4 of 5: brewing (TestFlight)” w `--r-mala`. 404 nie ma podpisu (żaden etap nie jest bieżący; opis zostaje w `aria-label`).
- 003: pasek w obrazie OG to teraz obwódka + kreskowanie dla wszystkich pięciu odcinków, podpisy bez zmian.
- 005: źródło odczytane 20.10.2026 15:21 UTC, `curl` + tekst surowego HTML (dowody/005-apple-guidelines-tekst.txt, dowody/005-apple-trademark-list-tekst.txt, cytaty w dowody/005-zrodlo.txt). Adres: developer.apple.com/app-store/marketing/guidelines/. Cytat: „Include Apple credit lines wherever legal information is provided.”; wzór poza USA „______ and______ are trademarks of Apple Inc.”; „A translation of the legal notice and credit lines (but not the trademarks) can be used in materials distributed outside the U.S.” Adres, data i cytat stoją też w komentarzu HTML przy linii, od linii 137 w `index.html`. Wybrano drugi wzór międzynarodowy (bez „registered in the U.S. and other countries”), bo Apple Health jest na liście jako ™, nie ®. Lista znaków (iPhone, App Store, Apple Watch, Apple Health, TestFlight) z Apple Trademark List; „iOS” w liście Apple występuje tylko jako znak Cisco, więc nie ujęty `[DO USTALENIA]` (prawnik). Napięcie: Apple pisze też „Include the credit lines only once in your communication or website”, a D-024 każe linię w stopce każdej strony; wykonano D-024 (stopka jest wspólnym szablonem). Strona 404 nie ma stopki, więc linii nie ma. Ocena prawna `[DO USTALENIA]`.
- 007: cele 45,0 px (stopka) i 47,8 px (karty); dodatkowo `min-width:44px` w stopce, bo „Terms” w EN miało 38 px szerokości.
- 009: etykieta „espresso*” nad kwotą poniżej 600 px (stały układ siatki; wariant z samym zawijaniem zostawiał „€” w osobnym wierszu przy 320 px).
- 010: patrz ograniczenie niżej.
- 016: Piekarz: „Na iPhone’a, w 35 językach przed wydaniem. Dziś w TestFlight.” (te same fakty co wcześniej, bez dopisania daty App Store, której dla Piekarza nie ma w źródle). Istniejący test „karty aplikacji” wymagał prefiksu „iPhone · ” (format odrzucony w D-024): prefiks zmieniony na „Na iPhone’a, w 35 językach”, format pilnuje nowy test.
- D-026: dwa istniejące testy wymagały obecności komentarza; ich asercje zastąpiono komentarzem z odwołaniem do D-026, a odwrotność pilnuje nowy test (zmiana zakresu wynikająca z decyzji właściciela, nie osłabienie reguł).

## Do przeniesienia do eksportu Treningu (D-022)

Zmiany szablonu `trening/privacy.html` i `trening/support.html` (nagłówek, stopka, head; sekcje `data-lang-section` nietknięte). To samo dotyczy `piekarz/*.html` (tam szablon jest w repo strony, ale źródło ma wyjść z eksportu):
1. 001: brak zmian w HTML podstron (tylko CSS).
2. 002: `<span class="d-etap" data-pl="Etap 4 z 5: parzenie (TestFlight)" data-en="Stage 4 of 5: brewing (TestFlight)">` jako ostatnie dziecko `figure.droga`, po `.droga-pasek`.
3. 005: w `<footer class="stopka">` po `</nav>`: komentarz ze źródłem i `<p class="prawa" data-pl="…" data-en="…">` (treść jak w `trening/support.html:97`).
4. 006: `aria-label="PL, Polski"` i `aria-label="EN, English"` na przyciskach języka.
5. 010: `data-en` tytułu i h1 („Training — Privacy Policy”, „Training — Support”), `data-label-en` figury („Training path: …”).
6. 013: w head `apple-touch-icon` (`../assets/apple-touch-icon.png`), dwa `theme-color`, `twitter:card`.
7. D-026: usunąć komentarz „[UWAGA 14.10.2026] Skrzynka … działa dopiero po weryfikacji DSA…” w źródle eksportu.

## Ograniczenia

- 010 (częściowo): sekcje `data-lang-section` to treść z repo aplikacji i test `tests/tresc-podstron.json` musi zostać zielony bez zmian pliku, więc w EN zostają "The Trening app" (trening/privacy.html, linie 119 i 140), "Trening → Backup" (trening/support.html, linia 71; w PL linia 53, to nazwa folderu w Plikach, nie nazwa sklepowa), "The Crust (Piekarz) app" (piekarz/privacy.html, linia 99). Do zmiany w eksporcie / źródle treści (dowody/010-ograniczenie-sekcje-EN.txt). W szablonie stron EN jest spójne.
- 001: pomiar laboratoryjny na Linuksie (Chromium, Liberation Sans jako Arial). Efekt na iPhonie nie sprawdzony.

## Nowe znaleziska (nie naprawiane, poza zakresem)

- N-1 (P3, D): przy tekście 200 % (CDP `Page.setFontSizes`) i szerokości 320 px strona przewija się w poziomie (340 > 320) przez adres `support@apps4brew.com` w stopce na czterech podstronach (`.stopka a` bez `overflow-wrap:anywhere`). Propozycja: `.stopka a{overflow-wrap:anywhere}`. Widoczne w zapisie sprawdzenia w komentarzu `docs/m6/narzedzia/fix-002-podpisy.mjs` (skrypt mierzy figurę, nie całą stronę). Przy 100 % tekstu scrollWidth = 320 na wszystkich 6 stronach, PL i EN (dowody/koniec-scrollwidth-320.txt).

## CLS laboratoryjny (390 px, Slow 4G RTT 150 ms 1,6 Mb/s, CPU 4×, zimna pamięć podręczna, 3 przebiegi)

| Strona | Przed (dowody/001-przed-cls.txt) | Po (dowody/koniec-cls.txt) |
|---|---|---|
| trening/support | 0,1748 / 0,1748 / 0,1752 | 0,0342 ×3 |
| piekarz/support | 0,1746 / 0,1749 / 0,1749 | 0,0344 ×3 |
| index | max 0,0400 | max 0,0013 |
| trening/privacy | max 0,0163 | max 0,0069 |
| piekarz/privacy | max 0,0297 | max 0,0083 |
| 404 | max 0,0054 | 0,0000 |

## Zrzuty po naprawie

`audit/M6-2026-10-20/zrzuty/po-fix/`: index, trening-support, piekarz-privacy, 404 w 390 i 1440 px (jasny, reduced motion, cała strona), plus index-1440-jasny-en.png. Zrzuty wzorcowe roli 04 (`docs/design/wzorce-zrzuty/`) nie były aktualizowane (zadanie roli 04); stopka z linią praw, cele 44 px, układ FAQ i indeks zmieniły wygląd względem nich.

## Czego nie sprawdzono

- Safari i iOS (CLS na iPhonie, powiększenie tekstu „aA”, krój SF Pro, VoiceOver, Voice Control dla 006): brak macOS/iOS.
- Forced-colors tylko w emulacji Chromium (nie Windows High Contrast).
- Strona opublikowana (GitHub Pages) i eksport Treningu.
- Weryfikacja nadaje dopiero tryb `reaudit`; statusu „zweryfikowane” nie nadaję.

## Kontrola dowodów i sekretów

Wynik `node sprawdz-raport.mjs raport.md /home/user/apps4brew-www .` (bez `--rola`: szablon sekcji dotyczy raportów audit, nie raportu dowodów fix): patrz `dowody/sprawdz-raport.txt`.
