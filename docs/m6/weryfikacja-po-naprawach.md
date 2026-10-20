# Reaudit 04 Studio Projektowe: apps4brew.com, M6, 2026-10-20

Przedmiot: `/home/user/apps4brew-www`, gałąź `strona/apps4brew-2026-10-20`, HEAD `370dc86`. Wzorzec: `docs/m6/weryfikacja-04.md` (ID 001–016), decyzje D-023 do D-026, `docs/design/design-spec.md`, tokeny w `assets/site.css`.
Tryb: reaudit, zakres wąski. Nie czytałem `audit/M6-2026-10-20/role/08-fix/` ani `docs/m6/postep.md`. Pliki śledzone są bez zmian, `git status --porcelain` jest pusty.
Środowisko: Node v22.22.0, Playwright z `/opt/node-tools`, Chromium. Serwer `python3 -m http.server` uruchomiony dwa razy: na porcie 8790 dla HEAD i na 8791 dla kopii `90ce8f4` z `git archive` w katalogu tymczasowym. Druga kopia służy do porównania przed i po.
Dowody są w tym katalogu: skrypty `*.mjs`, wyniki `*.txt`, zrzuty w `zrzuty/`.

**Wynik:** zamkniętych 14, częściowo 2 (010, 012), otwartych 0. Nie ma nowych P0–P2. `node --test` daje 54/54. Laboratoryjny CLS stron wsparcia w profilu telefonu spadł z 0,174 do 0,034. Po poprawce 012 słowo „przygotowaniu.” łamie się w środku przy 320 px. To regres poziomu P3.

## Tabela ID

| ID | Status | Dowód (HEAD) |
|---|---|---|
| 001 CLS stron wsparcia | zamknięte | `assets/site.css:17-18`: kroje zastępcze z `size-adjust`, `ascent-override`, `descent-override` i `line-gap-override`. Stosy krojów w `site.css:28-29`. `cls.txt`, profil A (RTT 150 ms, 1,6 Mb/s, CPU 4×, 390×844, DPR 3, 3 przebiegi): trening/support **0,0342**, piekarz/support **0,0344**. Dla `90ce8f4` w tych samych warunkach: 0,1743 i 0,1742. Profil B (RTT 400 ms, 0,4 Mb/s): 0,0342 i 0,0344, wobec 0,1748 i 0,1746 przed poprawką. Pozostałe strony: 0,0000–0,0083. Przy zablokowanych krojach CLS wynosi 0,0000, a tekst renderuje się krojem Liberation Sans/Serif, czyli odpowiednikiem Arial/Times z poprawki. Zostaje przesunięcie 0,033 przy t ≈ 1,05 s (źródła: `FIGURE.droga`, `SECTION`). Mieści się w progu. Zgodne z opcją (a) poprzedniego raportu. Wygląd się nie zmienia, bo dopiero po wczytaniu działają te same kroje. |
| 002 podpisy etapów 10,9 px | zamknięte | `site.css:141` i `site.css:210`: poniżej 600 px na podstronach `.d-nazwa` jest ukryte, a widoczny jest jeden podpis `.d-etap` w `--r-mala`. HTML w `trening/privacy.html:46`, „Etap 4 z 5: parzenie (TestFlight)”, w PL i EN. Pomiar `id-pomiary.txt`: przy 320, 390 i 599 px podpis ma **15 px przy tekście 100 % i 30 px przy 200 %**. Od 600 px zostaje pięć podpisów po 15/30 px. Zrzut `zrzuty/id/002-trening-privacy-320.png`. To opcja (c) poprzedniego raportu. Zastrzeżenie P3: na 404 poniżej 600 px pasek nie ma żadnego podpisu (`zrzuty/id/002-404-320.png`). Design-spec przewidywał tam pasek „bez podpisów etapów studia”, czyli z nazwami etapów. Informacja jest w `aria-label`. |
| 003 OG, 5 etapów „zrobione” | zamknięte | Na `assets/og-image.png` (`zrzuty/id/003-og-image-HEAD.png`) wszystkie pięć odcinków ma obwódkę i kreskowanie, bez barw stanu „zrobione” i bez znacznika. To neutralna legenda drogi zgodna z D-024. Skrypt: `docs/m6/narzedzia/og-image.mjs:16`. Test 003 liczy piksele w barwach etapów. |
| 004 pierwsze przełączenie tablicy | zamknięte | `assets/site.js:58` ustawia `pierwszy = false` po starcie. `id-pomiary.txt`: u nowego gościa pierwszy klik EN daje wsuwa=85, a klik PL wsuwa=82. Przy „Ogranicz ruch” oba dają 0. Przy zapisanym EN wczytanie daje 0, czyli bez ruchu przy starcie, a pierwszy klik 82. |
| 005 linia praw Apple | zamknięte | Stopki: `index.html:140`, `trening/privacy.html:199`, `piekarz/support.html:95` oraz pozostałe podstrony. Strona 404 nie ma stopki. Linia jest widoczna w PL i EN, w obu motywach, 15 px w `--tusz-2` na `--tlo` (`id-pomiary.txt`, `zrzuty/id/005-stopka-index-390-*.png`). Wzór międzynarodowy „… are trademarks of Apple Inc.” jest zgodny z D-024. |
| 006 nazwa „PL” | zamknięte | `index.html:42`: `aria-label="PL, Polski"` i `"EN, English"` na 6 stronach. Drzewo dostępności: `button "PL, Polski" [pressed]`. `getByRole('button',{name:'PL'})` zwraca 1 (`id-pomiary.txt`). |
| 007 cele 44 px | zamknięte | `site.css:124`, `site.css:197-198`. Przy 320 i 390 px linki stopki mają 45 px wysokości, linki kart 48 px. Odstęp poziomy w wierszu stopki to 19 px. Przejście Tab nie znalazło celu poniżej 24 px (`klawiatura.txt`, `zrzuty/id/007-stopka-390.png`). Zgodne z D-024. Odstępy pochodzą z tokenów `--o-3` i `--o-4`. |
| 008 FAQ h3 = h2 | zamknięte | `site.css:205`. Na obu stronach wsparcia h2 ma 22 px i grubość 700, h3 ma 17/18 px i grubość 650, z odstępem 24 px nad pytaniem. Przy tekście 200 % h2 ma 44 px, a h3 34 px (`id-pomiary.txt`, `zrzuty/id/008-faq-piekarz-390.png`). |
| 009 wiersze indeksu | zamknięte | `site.css:186`: poniżej 600 px siatka. Przy 320, 360, 390 i 599 px, w PL i EN, przy tekście 100 % i 200 %, lewa krawędź ceny i prawa krawędź przeliczenia są równe we wszystkich 4 wierszach, a układ wierszy jest jednolity (`id-pomiary.txt`, `zrzuty/id/009-indeks-320-pl.png`). Od 600 px działa dawny flex. Przy 768 px i tekście 200 % układ wierszy nadal się różni, tak samo jak przed poprawką. Ta szerokość jest poza zakresem 009. |
| 010 nazwy EN | **częściowo** | Szablon jest poprawiony: tytuły, h1, `aria-label` pasków, karty i stopka używają nazw „Training” i „Crust”. Na index EN nie ma żadnej nazwy polskiej. W treści sekcji EN nazwy polskie zostały: `trening/privacy.html:122` „The Trening app does not collect…”, `trening/privacy.html:143` „…with the Trening app…”, `piekarz/privacy.html:102` „The Crust (Piekarz) app…”. Na tej samej stronie h1 brzmi więc „Training — Privacy Policy”, a akapit zaczyna się od „The Trening app”. D-024 mówi „nazwy ze sklepu w EN wszędzie”. Treść pochodzi z repo aplikacji (D-002, D-022), więc zmianę trzeba zrobić u źródła. Test 010 wprost pomija sekcje `data-lang-section`. Do rozważenia jest też `trening/support.html:74` „On My iPhone → Trening → Backup”: może to być prawdziwa nazwa folderu w Plikach, więc nie liczę jej jako błędu. |
| 011 forced-colors | zamknięte | `site.css:216-219`. W `forced-colors: active` odcinek „zrobione” ma tło CanvasText (czarne w jasnym, białe w ciemnym), a niezrobiony jest pusty z obwódką. Punktory są widoczne (`zrzuty/id/011-forced-*.png`). Kryterium akceptacji jest spełnione. Reszta P3: znacznik bieżącego etapu (`::after`) nadal zamienia się w prostokąt, bo nie zrobiono części „forced-color-adjust: none dla znacznika”. Bieżący etap odróżnia wysokość odcinka i podpis. |
| 012 samotne „w” | **częściowo** | `index.html:88` ma `w&nbsp;przygotowaniu.`, a `site.css:126` ma `text-wrap:balance`. Pomiar po znakach (`spojnik-znaki.txt`): od 340 do 768 px przy tekście 100 % wiersze to [Kolejne aplikacje] [w przygotowaniu.], czyli dobrze. Przy 320 px i tekście 100 % jest **regres**: [Kolejne aplikacje] [w przygotowani] [u.]. Słowo łamie się w środku przez `overflow-wrap:break-word` z `site.css:64`, bo „w przygotowaniu.” jest szersze niż 236 px (`zrzuty/id/012-kolejne-320-HEAD.png`, dla porównania `012-kolejne-320-90ce8f4.png`). Przy tekście 200 % słowo łamało się w środku już przed poprawką. Po poprawce dzieje się tak też przy 599 px, gdzie kropka spada do osobnego wiersza. |
| 013 `<head>` podstron | zamknięte | `trening/privacy.html:12-14` i `:27`, `piekarz/support.html:12-14` i `:27` oraz pozostałe podstrony. `../assets/apple-touch-icon.png` odpowiada 200. Strona 404 jest pominięta zgodnie z kryterium akceptacji. |
| 014 „Kopiuj” bez schowka | zamknięte | `site.js:70-78`. Bez uprawnienia przycisk i `role=status` pokazują „Adres zaznaczony — skopiuj go (Ctrl+C / ⌘C)”, a w EN „Address selected — copy it…”. Adres jest zaznaczony. Z uprawnieniem pokazują „Skopiowano” lub „Copied”. Przy 320 px przycisk zawija się do 2 wierszy (66 px), bez przewijania w poziomie (`zrzuty/id/014-kopiuj-320.png`). |
| 015 `style=` w HTML | zamknięte | `site.css:178`: `.indeks-lista .przypis{margin-top:var(--o-6)}`, obliczone 24 px. W DOM po działaniu JS nie ma elementów z atrybutem `style` (`id-pomiary.txt`). |
| 016 ciąg „A · B · C” | zamknięte | `index.html:67` i `:82` zawierają zwykłe zdania w PL i EN, bez „·”. Zgodne z D-024 (opcja b). `zrzuty/id/016-karta-trening-390-en.png`. |

## Regresje ogólne

- **`node --test`**: 54/54, 0 nieudanych (`node-test.txt`).
- **Reflow 320 px** na 6 stronach, w PL i EN, w motywie jasnym i ciemnym: 24/24 bez przewijania w poziomie i bez elementów wystających poza ekran. `lang` jest zgodny z wyborem. Najmniejszy widoczny tekst ma 15 px (`reflow.txt`, zrzuty całych stron w `zrzuty/reflow/`).
- **Konsola i żądania**: 0 błędów i ostrzeżeń, 0 nieudanych żądań w 24 kombinacjach reflow i w 8 przejściach klawiaturą.
- **Klawiatura** na index i trening/support, przy 390 i 1440 px, w obu motywach: 18–22 przystanki na index i 13 na podstronie. Kolejność odpowiada czytaniu. Fokus ma 3 px, jest widoczny, w widoku i niczym niezasłonięty. „Przejdź do treści” prowadzi do `#main`. Enter i Spacja działają na PL/EN, `aria-pressed` i sekcja EN przełączają się poprawnie (`klawiatura.txt`).
- **CLS**: wyniki w wierszu 001. Próg 0,1 jest spełniony na 6 stronach w 3/3 przebiegach.
- **Tekst 200 % (porównanie z `90ce8f4`, `tekst200-porownanie.txt`)**: wyniki HEAD i `90ce8f4` są takie same. Poprawki nie dodały przewijania w poziomie.

## Testy (`git diff 90ce8f4 HEAD -- tests/`)

Usunięto 3 asercje i każda ma zastępstwo:
1–2. `assert.match(src, /\[UWAGA 14\.10\.2026\] Skrzynka …/)` w testach `trening/` i `piekarz/`. Zastępuje je odwrotna asercja w teście „D-026” (brak komentarza na wszystkich stronach). Odwrócenie wynika z decyzji D-026 właściciela, a nie z dopasowania do kodu. Siła jest ta sama.
3. Wzorzec `/<div class="meta" data-pl="iPhone · /` zastąpiono wzorcem `/<div class="meta" data-pl="Na iPhone’a, w 35 językach/`. Siła jest ta sama, a nowy test 016 dokładnie porównuje obie linie w PL i EN.

Dopisano 15 testów (001–016 bez 004 oraz D-026). Żadnej asercji nie osłabiono. Wyjątek do odnotowania: nowy test 010 pomija sekcje `data-lang-section`, więc utrwala zakres węższy niż D-024 („wszędzie”). Gdy zmieni się treść źródłowa, trzeba ten test rozszerzyć. Testy 007, 008, 009 i 011 sprawdzają dosłowny tekst CSS, a nie zachowanie. To nie jest osłabienie, ale testy są kruche. Pomiary w przeglądarce są w tym katalogu.

## Nowe znaleziska

**Brak nowych P0–P2.** Poniżej P2 tylko do wiadomości, bez szczegółów:
- P3, regres: łamanie „przygotowani|u.” przy 320 px (opisane w wierszu 012).
- P3: 404 poniżej 600 px ma pasek bez nazw etapów (opisane w wierszu 002).
- P3, sprzed poprawek: przy 600 px i tekście 200 % podpis „Podanie / App Store” wystaje o 16 px na podstronach i 404, a o 104 px na index. Przy 320 px i tekście 200 % adres `support@apps4brew.com` w stopce wystaje o 20 px. W `90ce8f4` było tak samo (`tekst200-porownanie.txt`).

## Czego nie sprawdzono

- Safari/iOS: CLS przy pierwszej wizycie z prawdziwymi krojami zastępczymi Arial i Times New Roman, powiększenie „aA”, VoiceOver. Brak macOS/iOS. Wynik lab opiera się na krojach Liberation, które mają te same metryki co Arial/Times.
- Android: nie ma tam krojów Arial ani Times. `local()` wtedy zawodzi i działa `system-ui` bez dopasowanych metryk, więc CLS na Androidzie może pozostać wyższy. Nie mierzyłem tego, a przepływ P2 dotyczy głównie iOS.
- Porównanie SP-13 ze zrzutami wzorcowymi `docs/design/wzorce-zrzuty/`. Poprawki 002, 007 i 009 celowo zmieniają układ. Oglądałem zrzuty, ale ich nie porównywałem.
- Ponowny pomiar kontrastu na zrzutach i `prefers-contrast: more`. Nowa linia praw używa pary tokenów `--tusz-2` na `--tlo`, zmierzonej wcześniej: 7,16:1 i 7,32:1.
- Strona opublikowana (GitHub Pages), INP, czytnik ekranu na żywo.
