# E2 kierunki: strona apps4brew.com (rola 04 build, 20.10.2026)

Wejście: D-009 (A2 „Od ziarna do filiżanki”, B tablica z wsuwanymi literami, C warszawski neon; bez nazw kolejnych aplikacji; bez testu 5 s), `01-swiat.md`, „Warsztat grafika” (D-040 biblioteki, stosowany od E2 na polecenie właściciela 20.10.2026).
Makiety (usuwane przed publikacją, D-006): `kierunki/<k>-glowna.html`, `kierunki/<k>-polityka.html`, style `kierunki/<k>.css`, `kierunki/wspolne.css`, skrypty `kierunki/wspolne.js`, `kierunki/<k>.js`; generator `narzedzia/kierunki.mjs`.
Zostaje po sprzątaniu: ten plik, `porownanie.png`, `kontrast/e2-kierunki.txt`, kroje `fonty/` (OFL, licencje obok).
Treść makiet: z inwentarza (index.html i trening/privacy.html bez zmian treści); nowe teksty kierunków oznaczone w generatorze `[PROPOZYCJA]`. Krój treści oceniany na zrzucie z Linuksa (na stronie WWW krój treści jest z pliku, więc zrzut jest miarodajny; Butterick, „Warsztat grafika”).

## Karty stylu

### A2 „Od ziarna do filiżanki”
- **Idea:** każda aplikacja studia przechodzi drogę kawy, od zbioru do podania; strona pokazuje, gdzie na tej drodze jest dziś każda z nich.
- **Element firmowy i dane:** pasek drogi ziarna (5 odcinków: zbiór, obróbka, palenie, parzenie, podanie = research, projekt, budowa z testami, testy z ludźmi (TestFlight), App Store; uproszczenie: droga pomija suszenie, mielenie i eksport, a „parzenie” zastąpiło „degustację”, bo według NCA degustacja (cupping) jest przed paleniem, `02-zrodla.md` K27, K30). Zabarwione odcinki = etapy przebyte, znacznik = etap obecny, kreskowany = przed aplikacją. Dane: etap każdej aplikacji (dziś obie: parzenie/TestFlight). VoiceOver: „Trening: etap 4 z 5, parzenie (testy z ludźmi (TestFlight))”. Na podstronie dokumentu pasek pokazuje aplikację, której dokument dotyczy.
- **Paleta** (jasny / ciemny):
  - tło „zielone ziarno” `#E9EDE0` / „palone ziarno” `#1C1410` — przybliżenie wzrokowe (zielona kawa rozjaśniona; ciemne palenie), nie z normy;
  - tusz `#24170F` / `#F0E8DC`; tusz drugorzędny `#584A3F` / `#C2B4A4`;
  - akcent „dojrzały owoc kawowca” `#8A1B2D` / `#EC8796` (owoc dojrzały „deep red/purplish”, NCA, i „red-purple”, Britannica: `02-zrodla.md` K2, K3; hex to przybliżenie wzrokowe);
  - barwy etapów: owoc `#A3233A`, zielone ziarno `#7C8D60` (nazwy barw z formularza SCA CVA Physical, `01-zrodla.md` poz. 24), palenie `#8A5A36` i ciemne palenie `#4A2D1E` (dyski SCAA/Agtron, poz. 17, jedno źródło szczebla 4), crema `#B9853B` („dark golden”, poz. 5) — wszystkie przeliczone wzrokowo z nazw, przybliżenie.
- **Kroje:** tytuły Big Shoulders Stencil (szablon natryskowy jak napisy na workach z zieloną kawą; worki jutowe 60 kg: `02-zrodla.md` K16–K19; to, że napisy na workach są robione szablonem, jest niepotwierdzone `[DO USTALENIA]`, więc pochodzenie kroju jest uproszczeniem); treść Source Sans 3. Oba OFL, pliki lokalne.
- **Kształty i gęstość:** prostokąty bez zaokrągleń (worek, szablon), grube linie 2 px oddzielające sekcje, duża skala tytułów, treść w jednej kolumnie do 66 znaków.
- **Moment ruchu:** przy pierwszym pokazaniu paska odcinki „palą się” kolejno od lewej (5 × 140 ms, razem ok. 1 s) i zatrzymują na etapie aplikacji; „Ogranicz ruch”: od razu stan końcowy. Haptyka i dźwięk: brak (strona WWW; decyzja studia: bez dźwięku na stronie).
- **Głos (próbne teksty):** pusty: „Tu jeszcze nic się nie pali. Kolejne aplikacje w przygotowaniu.”; błąd (404): „Tego ziarna tu nie ma. Wróć na stronę główną.”; sukces (Kopiuj): „Skopiowano.”
- **Ikona:** cyfra 4 z szablonu nad pięcioodcinkowym paskiem etapów (`kierunki/ikony/ziarno-*.png`).

### B „Tablica z wsuwanymi literami”
- **Idea:** strona to tablica menu kawiarni studia: hasło i cennik espresso są złożone z wsuwanych liter.
- **Element firmowy i dane:** tablica z filcem i literami. Dane: język strony (zmiana PL/EN przestawia litery), indeks espresso (4 kraje, ceny lokalne) jako cennik, na podstronie: aplikacja i etap („TRENING / TESTFLIGHT”). Tablica jest `aria-hidden`, a ta sama treść jest w tekście strony (nagłówek `h1`, tabela indeksu).
- **Paleta** (jasny / ciemny): tło ściany `#F2F2F0` / `#1A1A1C`; tusz `#1D1D1F` / `#EDEDEA`; tusz drugorzędny `#4F4F55` / `#B4B4B8`; filc `#2A2A2C` / `#0F0F10`; litery `#F4F2EC`; rama dąb `#A9794D` / `#7A5536`. Bez koloru akcentu (zmiana z testu generyczności, niżej): wyróżnienie przez pustą linię i pozycję na tablicy.
- **Kroje:** litery i tytuły Barlow Condensed (wąskie wersaliki o równej kresce jak plastikowe litery tablic), treść Barlow. OFL.
- **Kształty i gęstość:** rama z zaokrągleniem 6 px, linie wpustów co pół wiersza, sekcje bez kart, kropkowane separatory pozycji menu.
- **Moment ruchu:** kliknięcie EN/PL: litery wysuwają się i wsuwają w nowym języku jedna po drugiej (14 ms odstępu, 0,32 s na literę); „Ogranicz ruch”: zmiana od razu. Brak dźwięku i haptyki.
- **Głos:** pusty: „Ta pozycja wkrótce w menu.”; błąd (404, na tablicy): „BRAK W MENU” + „Tej strony nie ma. Wróć do strony głównej.”; sukces: „Skopiowano.”
- **Ikona:** litery „A4B” na filcu w dębowej ramie (`kierunki/ikony/tablica-*.png`).

### C „Warszawski neon”
- **Idea:** szyld studia na warszawskiej fasadzie: za dnia (motyw jasny) rurki są zgaszone, nocą (motyw ciemny) świecą; świecą nazwy aplikacji, które są już w testach.
- **Element firmowy i dane:** szyld z rurek (SVG, krój Bungee Hairline z obrysem). Dane: aplikacje gotowe do testów świecą (Trening, Piekarz), kolejna jest zgaszona (sam kontur, nie tylko inny kolor). VoiceOver: „Szyld Apps4Brew z rurek neonowych. Świecą nazwy aplikacji gotowych do testów: Trening i Piekarz. Trzecia rurka, kolejna aplikacja, jest zgaszona.” Na wąskim ekranie szyld układa się w pionie.
- **Paleta** (dzień / noc): fasada `#E6E7E3` / `#1B1522`; ściana szyldu `#D7D9D4` / `#231B2C`; tusz `#1E2126` / `#EEEAF0`; tusz drugorzędny `#4A4F57` / `#BDB4C4`; czerwień neonu `#C8372B` (rurka za dnia) / `#FF6D5C` (świeci nocą), akcent tekstu `#A61E1E` / `#FF7A6B`. Barwa: gaz neonowy pod niskim ciśnieniem świeci „bright orange-red” (Britannica, `02-zrodla.md` N1; linie Ne I 640,2 i 692,9 nm, NIST, N11–N12); warszawskie przykłady czerwonych neonów: „Kogut” Cepelii (N14–N15). Hex to przybliżenie wzrokowe, nie przeliczenie widma.
- **Kroje:** szyld Bungee Hairline (krój inspirowany szyldami miejskimi, jedna grubość kreski jak rurka), tytuły i treść Rubik (lekko zaokrąglone narożniki jak gięta rurka). OFL.
- **Kształty i gęstość:** zaokrąglenia przycisków jak rurki (24 px), cienkie linie sekcji, szeroki pas fasady u góry.
- **Moment ruchu:** przełączenie na „Noc” zapala rurki krótkim migotaniem zapłonu (0,7 s, kolejno logo i nazwy); „Ogranicz ruch”: świecą od razu. Poświata ograniczona do 1,5–5 px (bez rozmytych plam). Brak dźwięku (brzęczenie transformatora tylko jako pomysł, odrzucony: strona bez dźwięku).
- **Głos:** pusty: „Wkrótce zapalimy kolejny szyld.”; błąd (404): „Ten szyld jeszcze nie świeci. Wróć na stronę główną.”; sukces: „Skopiowano.”
- **Ikona:** cyfra 4 z rurki na fasadzie, dzień i noc (`kierunki/ikony/neon-*.png`).

## Test generyczności

Karty kontrolne napisane przed porównaniem (w `01-swiat.md`, sekcja 11), tu porównanie pole po polu. „Kalibracja” = tabela „Kalibracja domyślnych wyborów” we wzorcach roli; „poprzeczka” = znaki rozpoznawcze stron z `01-swiat.md` sekcja 4; „konkurencja” = klisze z sekcji 5.

| Pole | A2 Ziarno | B Tablica | C Neon |
|---|---|---|---|
| Paleta | Pokrycie: jasne tło `#F1F2EB` blisko kremowego tła z Kalibracji (`#F4F1EA`). **Zmiana:** tło przesunięte w zieleń ziarna `#E9EDE0`; akcent bordo owocu nie jest w kartach kontrolnych ani wśród zajętych akcentów konkurencji (śliwka/bordo rzadkie). | Pokrycie: złoty akcent liter (`#E2B456`) = złoto z karty kontrolnej (b). **Zmiana:** akcent usunięty, tablica jednobarwna, wyróżnienie przez układ. Uwaga: dwie strony konkurencji też nie mają akcentu, ale tożsamość B niesie tablica, nie paleta. | Pokrycie: granatowa noc `#12152A` = granat z karty (b) i z hero jednej strony konkurencji. **Zmiana:** noc śliwkowo-czarna `#1B1522`. Pozostaje pokrycie z Kalibracją „prawie czarne tło z jednym cynobrowym akcentem”: uzasadnienie z dziedziny: barwa gazu neonowego (`02-zrodla.md` N1, N11), zapisane jako wyjątek od Kalibracji (D-010). |
| Krój tytułów | Szablon (stencil): brak w kartach, brak u konkurencji (szeryfy, geometryczne, systemowe). | Wąskie wersaliki: blisko plakatowych wersalików jednej strony z poprzeczki (Studio Namma). Różnica: tam ciężki krój plakatu, tu lekkie litery z rozstrzeleniem na filcu; bez zmian, zapisane. | Rubik: brak w kartach i u konkurencji; Bungee Hairline tylko w szyldzie. |
| Element firmowy | Pasek etapów z danymi: brak w kartach (karta (a): mockup iPhone’a z siatką ikon). Ryzyko kliszy „kroki 1-2-3”: bez numeracji i ikon w kółkach, jeden pasek na aplikację. | Tablica menu: brak w kartach i u konkurencji. | Szyld neonowy: brak w kartach; poprzeczka: 1minus1 (świat gier) — inna dziedzina i forma. |
| Układ | Wielki tytuł + pasek pod każdą aplikacją; karta (a): tekst lewo / telefon prawo — różne. | Wyśrodkowana tablica: wyśrodkowany hero to klisza konkurencji (5/13). Uzasadnienie: tablica wisi na środku ściany jak w kawiarni; tekst pod nią do lewej na telefonie (zmiana po krytyce). | Pas fasady z szyldem nad tekstem; reszta standardowa, zgodnie z zasadą „odwaga w jednym miejscu”. |
| Ruch | Jeden moment na stronie (pasek), nie „fade + slide up” sekcji. | Jeden moment, wywołany przez użytkownika (język). | Jeden moment, wywołany przez użytkownika (noc). |
| Inne z Kalibracji | Wyróżnienie słowa w nagłówku: brak. Etykiety wersalikami nad nagłówkami: brak (wersaliki tylko w tytułach). | Wyróżnienie słowa „ESPRESSO.” kolorem w haśle: było w pierwszym zrzucie, **usunięte**. | Ciągi „A · B · C” w meta aplikacji: zamienione na listę we wszystkich kierunkach. |

## Pomiary (20.10.2026)
- **Kontrast:** `kontrast/e2-kierunki.txt` — 29/29 par spełnia próg (tekst 4,5:1, grafika 3:1), oba motywy; kod wyjścia 0. Przy pierwszym pomiarze zgaszona rurka za dnia miała 2,39:1 → poprawiona do progu i dodatkowo odróżniona kształtem (kontur).
- **Warsztat** (`narzedzia/warsztat.mjs`, 390 i 1024 px, 6 stron): 0 błędów. Ostrzeżenia uzasadnione: wiersze 22–44 znaków w kolumnach siatki zasad i w cechach aplikacji (to listy w kolumnach, nie akapity; trzy kolumny dopiero od 1280 px po pierwszym pomiarze); odstępy poza jednostką 4 px pochodzą z płynnych marginesów `clamp()`; 6–8 wielkości tekstu po porządkach (było 10–11), z czego 1–2 to litery tablicy i rurki szyldu (grafika); B: 5 kolorów tekstu, w tym litery tablicy (grafika).
- **Szerokości:** 320, 390, 1440 px bez przewijania w poziomie (zrzuty, `scrollWidth`).
- **Test mrużenia** (`warsztat.mjs --rozmycie`, 390 i 1440, motyw jasny): B — jeden punkt skupienia, tablica; A2 — tytuł, potem paski etapów (przy 390 pionowe paski słabną: do wzmocnienia w E3 grubszą obwódką); C — za dnia szyld ginie po rozmyciu, punktem skupienia zostaje tytuł i czerwony przycisk (znalezisko: „zgaszony dzień” osłabia element firmowy; nocą działa; do decyzji, czy jasny motyw dostaje grubsze rurki, czy szyld świeci także za dnia).

## Krytyka zrzutów (przed → po)
| Kierunek | Usterka (zrzut) | Poprawka |
|---|---|---|
| A2 | pasek drogi dopiero pod pierwszym ekranem 1440; podwójna numeracja etapów („1.” z listy) | mniejszy tytuł (2 wiersze), pasek w pierwszym ekranie; lista bez numerów |
| A2 | wąska kolumna tekstu obok ikony przy 390 (etapy ściśnięte) | na telefonie ikona nad treścią |
| B | słowo „ESPRESSO.” wyróżnione kolorem (Kalibracja) | jedna barwa liter |
| B | wyśrodkowany 5-wierszowy akapit przy 390 | akapit do lewej na telefonie |
| C | nazwy aplikacji na szyldzie nachodziły na siebie; szyny przekreślały litery | szerszy szyld, bez szyn; na telefonie szyld w pionie |
| C | zgaszona rurka różniła się od świecącej tylko kolorem i miała 2,39:1 | kontur zamiast wypełnienia, kontrast 3:1 |
| wszystkie | menu sekcji w dwóch wierszach zajmowało ok. 180 px nagłówka przy 390 | menu sekcji ukryte poniżej 600 px (strona jednoekranowa, treść osiągalna przewijaniem) |
| podstrony | podwójne wcięcie i linia sekcji w treści dokumentu | wyzerowane dla sekcji dokumentu; element firmowy w nagłówku podstrony |

## Rekomendacja
Rekomenduję **A2 „Od ziarna do filiżanki”**, z powodu funkcji, nie gustu: cel nr 1 strony to wiarygodność studia dla klientów i inwestorów (D-001), a A2 jako jedyny pokazuje w jednym elemencie metodę pracy i prawdziwy etap każdej aplikacji; ten sam element działa na podstronach (dokument wie, której aplikacji dotyczy) i rośnie z portfolio (kolejna aplikacja = kolejny pasek). **B** jest najmocniejszy wizualnie i najlepiej niesie indeks espresso i PL/EN, ale jego dane to cena i język, a nie to, czy studio dowozi. **C** daje miejsce i najbardziej rozpoznawalny szyld, ale za dnia element firmowy słabnie (test mrużenia), a para „ciemne tło + czerwony akcent” stoi blisko wyboru domyślnego (uzasadniona barwą neonu, ale to wciąż ryzyko szablonu). Łączenie (np. A2 z tablicą B w sekcji indeksu) jest możliwe, ale osłabia zasadę jednego mocnego miejsca.

## Po wyborze (D-011, 20.10.2026)
- **Kierunek:** A2 jako system strony; tablica z B tylko w sekcji „Indeks espresso” (przy ≥ 1024 px tablica obok tabeli ze źródłami, przy 390 jedna pod drugą). Zrzuty: `kierunki/zrzuty/ziarno-glowna-*-ekran1.png`, cała strona: `kierunki/zrzuty/ziarno-glowna-1440-light-calosc-d011.png`. Warsztat: 0 błędów (390, 1024).
- **Poprawka z krytyki:** interlinia tytułu 0,86 → 0,95, bo znaki diakrytyczne wersalików (Ń, Ż) dotykały wiersza wyżej.
- **Porównanie krojów tytułowych** (`kroje-a2.png`, źródło `kierunki/kroje-a2.html`), kryterium mierzalne: szerokość „TAŃSZE NIŻ” przy 100 px i wynikający z niej rozmiar tytułu w tej samej kolumnie; wszystkie mają pełne polskie znaki:

| Krój | Skąd w świecie dziedziny | „TAŃSZE NIŻ” / 100 px | Tytuł w kolumnie |
|---|---|---|---|
| 1. Big Shoulders Stencil (obecny) | szablon natryskowy jak na workach i skrzyniach z towarem (uproszczenie, źródło `[DO USTALENIA]`) | 395 px | 70 px |
| 2. Saira Stencil One | techniczne oznaczenia na skrzyniach i maszynach | 571 px | 49 px |
| 3. Stardos Stencil | stempel z szeryfami na worku | 570 px | 49 px |
| 4. Allerta Stencil | humanistyczny szablon oznakowania | 576 px | 53 px |
| 5. Big Shoulders Display (kontrola) | ten sam rysunek bez szablonu | 394 px | 71 px |

Rekomendacja: **1. Big Shoulders Stencil**: najwęższy szablon, więc największy tytuł na telefonie, a szablon odróżnia go od kontroli nr 5, która wygląda jak zwykły wąski grotesk.
