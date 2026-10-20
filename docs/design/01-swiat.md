# E1 świat dziedziny: strona apps4brew.com od zera (rola 04 build, 20.10.2026)

Wejście: D-001 (cel: wiarygodność studia → polityki i wsparcie → pobrania), D-002 (zachować: hasło „tańsze niż espresso” i indeks espresso, „Jak robimy aplikacje”, PL/EN pod jednym adresem), D-008 (przepływy P1–P3 jako założenia; ekran kluczowy: główna 390/1440 i polityka prywatności; oba motywy), inwentarz treści `docs/m6/inwentarz.md`.
Szkice kandydatów: `docs/design/01-swiat.png` (źródło: `kierunki/00-metafory.html`, usuwane przed publikacją razem z `kierunki/`, D-006).
Cudzy materiał (zrzuty stron, ikony aplikacji) leży tylko w scratchpadzie sesji, nie w repo. Tutaj są wyłącznie listy, adresy, daty i własne obserwacje.

## 1. Przedmiot dziedziny

Strona nie ma jednej dziedziny jak aplikacja, ma trzy, które się przenikają:
1. **Parzenie i warzenie.** Nazwa „Apps4Brew”, indeks espresso, teksty AS IS („Pierwsza filiżanka już gotowa”, „More apps are brewing”), a portfolio studia to rzemiosła powolnych procesów: zakwas i chleb (Piekarz), w planach napary, piwowarstwo, fermentacja, kiszonki, wędliny (pamięć portfolio).
2. **Warsztat studia aplikacji.** Wersje (Trening 0.20.0, Piekarz 1.0 z polityk), etapy (w przygotowaniu → TestFlight → App Store), testy przy każdej zmianie, 35 języków, karta prywatności każdej aplikacji.
3. **Miejsce.** Studio z Warszawy (stopka, „O studiu”).

Wspólny mianownik, który daje metaforę zamiast przymiotnika: **partia (warka) jako wydanie**. Piwowar warzy warkę, nastawia ją, czeka na fermentację i rozlewa; studio buduje wersję, testuje ją w TestFlight i wydaje. Język strony już tego używa („brewing”, „w przygotowaniu”).

## 2. Inwentarz świata dziedziny

Fakty z liczbami i normami mają przeczytane źródło w tabeli 2.8. Pozycje bez liczby to nazwy przedmiotów, nie twierdzenia.

### 2.1 Przedmioty i narzędzia
- Kawa: ekspres kolbowy, kolba (portafiltr), manometr, młynek z tarczą stopnia mielenia, filiżanka espresso, dzbanek do mleka, waga baristy z minutnikiem, tamper.
- Warzenie: kocioł warzelny, tankofermentor (zbiornik cylindryczno-stożkowy) z kranem do próbek i tabliczką kredową, rurka fermentacyjna, areometr (cukromierz), butelki i kapsle.
- Piekarnia i spiżarnia: słoik z zakwasem i gumką, banneton, lame (żyletka do nacinania), słoiki z etykietami.
- Kawiarnia: tablica z wsuwanymi literami (menu), tablica kredowa, kasa i paragon, szyld, neon.
- Studio: iPhone, TestFlight, numer wersji, lista zmian, raport testów.

### 2.2 Materiały
emaliowany metal i stal nierdzewna (zbiorniki, ekspres), porcelana (filiżanka), filc i plastikowe litery (tablica menu), kreda na czarnej tablicy, papier termiczny (paragon), papier kraft (torebki palarni), szkło (słoiki, rurki neonowe), drewno lady.

### 2.3 Znaki i oznaczenia
kreska poziomu na zbiorniku, gumka na słoiku z zakwasem jako znacznik startu, pieczątka z datą palenia na torebce kawy, numer warki kredą, kapsel z oznaczeniem partii, plomby i etykiety partii, szyld kawiarni z neonem.

### 2.4 Dokumenty i formularze
paragon z kasy (wymagane elementy: tabela 2.8), karta warki / dziennik warzenia, formularz cuppingu (ocena kawy), etykieta torebki kawy (pochodzenie, proces, data palenia), menu kawiarni z cenami, raport z wydania (lista zmian).

### 2.5 Liternictwo
wsuwane plastikowe litery menu (wersaliki o stałej szerokości kreski, prześwit na filcu), kreda na tablicy (pismo ręczne), druk termiczny paragonu (krój o stałej szerokości znaku), pieczątka (litery z niedokładnym odbiciem), warszawskie neony kawiarni i barów (pismo ręczne i proste wersaliki z rurek), szablon natryskowy na zbiornikach.

### 2.6 Dźwięki (do E2 jako moment, na stronie bez dźwięku domyślnie)
syk pary i spieniacza, stuk kolby o pojemnik na fusy, bulgot rurki fermentacyjnej, terkot drukarki paragonów, brzęczenie transformatora neonu, kliknięcie wsuwanej litery w filc.

### 2.7 Kolory nadane przez kody i normy
Skala barwy piwa EBC/SRM z nazwami BJCP (od „Straw” do „Black, opaque”), dyski stopnia palenia SCAA/Agtron (#95–#25), słowny opis cremy („dark golden”). Kolory przeliczane ze skal na sRGB są przybliżeniem z podaną metodą (tabela A w `01-zrodla.md`). Uwaga ze skanu: bursztyn i złoto to kolor ikon aplikacji piwowarskich (6/13), więc skala piwa nadaje się na dane w zbiornikach, a nie na akcent marki.

### 2.8 Źródła faktów
Pełna tabela (46 twierdzeń z cytatami, adresami, szczeblem i datą odczytu 20.10.2026; 14 otwartych pytań): `docs/design/01-zrodla.md`. Najważniejsze dla projektu:

| Fakt | Źródło (szczebel) | Do czego w projekcie |
|---|---|---|
| Espresso wg COMITCAF 2018: 7–9 g kawy, 90–96 °C, ≥ 8 bar, 20–27 s, 13–26 g w filiżance; crema jednolita, trwa ≥ 120 s | COMITCAF, Disciplinare 2018 (3), poz. 1–3 | liczby świata kawy (np. czas ekstrakcji jako tempo ruchu ~1 s jest uproszczeniem, nie przeliczeniem) |
| Historyczna definicja SCAA: 25–35 ml, 7–9 g, 90,5–96,1 °C, 9–10 atm, 20–30 s; crema „thick, dark golden” | SCA, 25 Magazine (3), poz. 4–5 | słowny opis barwy cremy (bez hex ze źródła) |
| Parametry INEI (7 g, 25 ml, 88 °C, 25 s) | **niepotwierdzone** (403) | nie używać |
| EBC = SRM × 25/12,7 ≈ 1,97; SRM mierzy gęstość barwy, nie odcień | BJCP (3), AHA (3), rachunek (1), poz. 9–11, 15 | skala barw dla kierunku A (zbiorniki): barwy z tabeli A w `01-zrodla.md` to przybliżenie obliczone narzędziem (szczebel 4), nazwy barw BJCP (3) |
| Dyski SCAA/Agtron: 8 dysków, #95 „Very Light” … #25 „Very Dark” | HunterLab (4), poz. 17 | **jedno źródło**; pośrednie nazwy niepotwierdzone |
| Cupping: norma SCA 104-2024, skala 9-punktowa, 79/100 pkt | SCA (1), poz. 20–23 | potwierdza, że karta cuppingu (metafora 10) wymagałaby prawdziwych ocen → odrzucona |
| Paragon fiskalny: Dz.U. 2025 poz. 845 § 26 — 18 elementów, w tym oznaczenie „PARAGON FISKALNY”, logo fiskalne i numer unikatowy w ostatniej linii | Rozporządzenie MF (1), poz. 29–31 | metafora 4 (rezerwa): nie odtwarzać oznaczenia „PARAGON FISKALNY” ani logo fiskalnego (zasada studia 14) |
| Rolka 57 mm w kasach dwóch producentów | Novitus, Posnet (1), poz. 32–34 | szerokość paska wydruku; „typowa” niepotwierdzone |
| Muzeum Neonów: ok. 100 neonów, często projektanci Polskiej Szkoły Plakatu; w kolekcji neon kawiarni „Jaś i Małgosia” | Neon Muzeum (3), PAP (3), poz. 35–38 | kierunek C: krój wywodzony z logiki neonów (rurka, „eleganckie litery” albo „kanciaste napisy”, poz. 40, szczebel 4), bez kopiowania konkretnego szyldu; liternictwo „Jaś i Małgosia” nieznane |
| Gumka na słoiku znaczy poziom zakwasu; dojrzały zakwas ok. podwaja objętość | King Arthur (4), poz. 41 | **jedno źródło**; metafora 9 |
| Dziennik warzenia: numer warki, nazwa, wielkość, data; OG przed zadaniem drożdży; OG, FG, ABV | BYO (4), AHA (3), poz. 42–44 | kierunek A: tabliczka zbiornika = numer warki, nazwa, data, etap |
| Spienianie mleka brzmi jak „darcie papieru”, pisk = dysza za głęboko | Breville (4), poz. 46 | **jedno źródło**; dźwięk poza zakresem strony |

## 3. Dane strony, które element firmowy może nieść

Wyłącznie dane już opublikowane na stronie (inwentarz M6), bez zmyślania:
| Dane | Gdzie dziś | Uwagi |
|---|---|---|
| Aplikacje i ich etap: Trening (TestFlight, App Store jesienią 2026), Piekarz (TestFlight), „kolejne w przygotowaniu” | karty aplikacji | etap zmienia się w czasie → element musi się dać przestawić jedną zmianą w HTML |
| Wersja aplikacji: Trening 0.20.0, Piekarz 1.0 | polityki prywatności („Obowiązuje od…”) | prawdziwa, ale z podstron |
| Liczba języków: 35 | karty aplikacji | |
| Indeks espresso: 4 kraje, ceny lokalne i ≈ USD, daty danych | sekcja indeksu (źródła w przypisie) | treść zachowana (D-002); test dopuszcza ceny tylko tu |
| Prywatność każdej aplikacji: bez konta, dane na telefonie, offline | karty aplikacji | |
| Sześć zasad „Jak robimy aplikacje” | sekcja (D-002) | |
| Języki strony: PL/EN pod jednym adresem | przełącznik | D-002 |
| Studio: Warszawa, 2026 | stopka | |
| Cen aplikacji brak (test) | — | żaden element nie może pokazać ceny subskrypcji liczbą |

## 4. Poprzeczka wow (strony wyróżnione 20.04–20.10.2026, obejrzane 20.10.2026 ok. 13:35–13:40 czasu warszawskiego)

To miara jakości, nie wzór stylu. Kolumna „znak” to rzeczy, których kierunki nie mogą powtórzyć (test generyczności E2).

| Nr | Strona | Wyróżnienie (serwis, data) | Co robi wrażenie | Znak (nie powtarzać) |
|---|---|---|---|---|
| 1 | Hold, https://grabhold.now/ | Best Website Gallery, Site of the Day, 07.10.2026 | cała strona to jeden przedmiot (pudełko), gest w bok zmienia kolor, w górę otwiera pudełko | pudełko z wyciąganym urządzeniem, gesty kolor/otwórz |
| 2 | Kizupi, https://kizupi.com/ | One Page Love, 18.10.2026 | produkt pokazany w działaniu: przykładowe zadanie do rozwiązania na stronie | pikselowa scena, podświetlone słowo |
| 3 | Uncle Rudy, https://www.unclerudy.app/ | One Page Love, 01.10.2026 | charakter aplikacji trzymany konsekwentnie, prawdziwe powiadomienia zamiast opisu | maskotka, kolaż naklejek |
| 4 | Flowty, https://flowty.co/ | CSS Design Awards WOTD, 18.07.2026 | strona minutnika zaczyna od odliczania: tempo strony mówi o produkcie | intro-odliczanie, fioletowa smuga |
| 5 | Agrumea Farm, https://www.agrumeafarm.it/en | CSS Design Awards WOTD, 06.10.2026 | słoiki przetworów obracają się nad kształtem z tekstem po łuku, kolejny wjeżdża przy przewijaniu | latające słoiki 3D, tekst na łuku |
| 6 | Union Boulangerie, https://unionboulangerie.com/en/ | minimal.gallery, 29.09.2026 | prawdziwe zdjęcia z piekarni nocą niosą opowieść lepiej niż hasła | odręczny logotyp, intensywny błękit |
| 7 | Benvenusa, https://benvenusa.com/ | Httpster (data niepodana; na liście 20.10.2026) | nazwa na całą szerokość, jedno odważne zestawienie, reszta dyscypliny | pełnoszerokie logo + jaskrawy fiolet |
| 8 | House of Honey, https://www.houseofhoney.com/ | CSS Design Awards WOTD, 21.06.2026 | typografia jest marką: ciężki grotesk z wplecionym kaligraficznym „of” | grotesk + kaligrafia, róż-brąz |
| 9 | DRĄSA Studio, https://drasa.uk/ | minimal.gallery, 13.10.2026 | mocne otwarcie własnym logotypem, potem cisza | rysowany logotyp na różu, menu-pigułka na dole |
| 10 | Studio Namma, https://studionamma.com/ | CSS Design Awards WOTD, 23.05.2026 | hasła w skali plakatu podmieniane przy przewijaniu; zegary dwóch miast mówią „małe studio” | plakatowe wersaliki, zegary miast |
| 11 | 1minus1, https://1minus1.com/ | The FWA, FWA of the Day, 08.10.2026 | konsekwentny świat jednej branży (gry) aż po baner cookies | pikselowy krój, limonka na fiolecie |
| 12 | The Content Architecture, https://www.contentarchitecture.dev/ | The FWA, FWA of the Day, 20.10.2026 | liczba zamiast przymiotników: licznik oszczędzonych godzin przy przewijaniu | spirala tekstu, licznik godzin, mono |

Źródła: cssdesignawards.com, thefwa.com, onepagelove.com, minimal.gallery, bestwebsite.gallery, httpster.net, recent.design: 200 (20.10.2026). **Nie sprawdzono:** awwwards.com (brak odpowiedzi, 20.10.2026), siteinspire.com (429), land-book.com i lapa.ninja (403); webbyawards.com bez listy z datami w oknie 6 miesięcy.

Wnioski dla poprzeczki: (1) jeden pamiętny moment, reszta spokojna; (2) typografia w skali plakatu jako nośnik marki; (3) produkt pokazany w działaniu, nie opisany; (4) świat konsekwentny do stopki; (5) prawdziwy materiał zamiast ilustracji; (6) 2–3 kolory i jeden ostry akcent; (7) moment działa też przy 390 px; (8) krótka strona może wygrać, jeśli jeden pomysł jest dopracowany. Słabości do unikania: długie intro, banery zasłaniające ekran.

## 5. Skan konkurencji: strony niezależnych studiów iOS (odczyt 20.10.2026)

Dobór: `sellerUrl` z iTunes Search API (`country=pl`, frazy: gym log, dziennik treningowy, sourdough, zakwas, bread baking, fermentation, kombucha, homebrew, tea) plus trzy znane studia. Odrzucone po obejrzeniu: platforma kursów i pusta strona.

| Nr | Studio, adres | Skąd (aplikacja w App Store) | Zauważone klisze |
|---|---|---|---|
| 1 | Vadim Drobinin, https://drobinin.com/ | Fermentation Journal: Fermento, https://apps.apple.com/pl/app/id6470132496 | siatka ikon aplikacji, twarz twórcy, biel + systemowy krój |
| 2 | MyQuietSpot, https://www.myquietspot.com/ | Sourdough Starter Tracker, https://apps.apple.com/pl/app/id6755709217 | siatka kart z emoji, „prywatnie/offline” w hero, brąz i miód dla wypieków |
| 3 | Mordsmith, https://www.mordsmith.com/ | Yeasta: Sourdough Tracker, https://apps.apple.com/pl/app/id6748180011 | granatowy gradient, wyśrodkowane hasło o „care”, zrzuty iPhone’a w kartach |
| 4 | Alexander Bergqvist, https://alexanderbergqvist.com/ | Sourdough Starter – Surdeg, https://apps.apple.com/pl/app/id6766092580 | krem + szeryf z kursywą, brewka mono, pasek liczb, **premium porównane do ceny kawy** |
| 5 | Flonsus, https://flonsus.com/ | FermentLog, https://apps.apple.com/pl/app/id6808309840 | **pokój z półkami, aplikacje jako przedmioty**, butelkowa zieleń + krem, ilustracja generowana |
| 6 | axeptDESIGN, https://www.axeptdesign.com/ | SourTime, https://apps.apple.com/pl/app/id6794852624 | czarne tło, hasło „małe aplikacje”, tytuł dwutonowy, brewka |
| 7 | Strive, https://strive-workout.com/ | Gym log - Strive, https://apps.apple.com/pl/app/id6449553638 | dwa przechylone iPhone’y, pasek ocen, pomarańczowy przycisk |
| 8 | PracticallyZen, https://practicallyzen.com/ | Ferment & Sprout, https://apps.apple.com/pl/app/id6780521662 | pływające ikony i karty wokół nazwy, pomarańcz |
| 9 | Steve Rose Software, https://srosesoftware.com/ | Sourdough Buddy, https://apps.apple.com/pl/app/id6752309546 | krem + szeryf z kursywą w kolorze rdzy, karty statystyk |
| 10 | The Iconfactory, https://iconfactory.com/ | znane studio (wybór własny) | pomarańczowy gradient, ikony w kartach |
| 11 | Gentler Stories, https://gentlerstories.com/ | laureat ADA (wybór własny) | iPhone w hero, przycisk App Store, wieńce nagród, pomarańcz |
| 12 | Crouton, https://crouton.app/ | znana aplikacja kulinarna (wybór własny) | tekst lewo / dwa iPhone’y prawo, przycisk App Store |
| 13 | Just Bread, https://justbread.app/ | Just Bread, https://apps.apple.com/pl/app/id1537955145 | zdjęcie bochenka, przyciski sklepów w hero, żółty akcent, baner zgody |

Klisze kategorii (pierwszy ekran 1440, 13 stron): biel i minimalizm 8/13; pomarańcz lub rdza jako akcent 6/13; siatka ikon lub kart aplikacji 6/13; mockup iPhone’a 5/13; twórca z imienia lub twarzy 5/13; wyśrodkowany hero 5/13; gradient 5/13; brewka wersalikami („studio · miasto · rok”) 4/13; prywatność/offline w hero 4/13; pasek liczb lub nagród 4/13; przycisk App Store w hero 3/13.
Zajęte akcenty: pomarańcz–rdza (#FF9C1F, #FD6217, #FE914E, #FF3300, #C94F1E, #A8541B), niebieski linkowy (#0066CC, #4A9EEA, #1A56DB), butelkowa zieleń i teal (#1C6548, #0D9488), żółty i miód (#FFB300, #D9A441). Rzadkie w próbie: śliwka i bordo, oliwka, atramentowy granat z kremem. Kolory z CSS są dokładne, z obrazów przybliżone.
Ikony aplikacji w kategoriach studia (62 z iTunes PL): hantla na czarnym (trening 8/14), bochenek z nacięciem w beżu (chleb 6/14), słoik w zieleni (fermentacja 4/13), kufel z pianą w bursztynie (piwo 6/13), liść lub filiżanka na kremie (herbata 4/8).

Sprawdzenie planowanych akcentów: żaden z trzech wybranych kierunków nie może opierać się na pomarańczu, rdzy, niebieskim linkowym ani butelkowej zieleni bez zapisanej decyzji. AS IS strony (porcelanowy błękit `#36628D` i krema `#F2C9A5`) leży blisko niebieskich akcentów konkurencji.

## 6. Kandydaci na metaforę (12)

| # | Metafora (jedno zdanie) | Dane użytkownika / strony | Moment firmowy | Ryzyko: kicz / czytelność / koszt |
|---|---|---|---|---|
| 1 | **Tablica warek**: każda aplikacja to warka w zbiorniku z kredową tabliczką, poziom w zbiorniku to etap wydania. | etap (przygotowanie → TestFlight → App Store), wersja, 35 języków, „kolejna warka” | przy wejściu w sekcję zbiorniki napełniają się do prawdziwego etapu (raz, krótko; „Ogranicz ruch”: stan końcowy) | kicz: średni (browar rzemieślniczy jako estetyka); skojarzenie z alkoholem obok aplikacji sportowej; czytelność dobra (poziom + podpis tekstem); koszt: SVG + CSS, niski |
| 2 | **Tablica z wsuwanymi literami**: strona jest menu kawiarni, indeks espresso jest cennikiem, aplikacje to pozycje menu. | indeks espresso (4 kraje, ceny, daty), aplikacje, PL/EN | przełączenie PL/EN przestawia litery na tablicy (ruch wynika z prawdziwej zmiany treści); „Ogranicz ruch”: natychmiastowa zmiana | kicz: średni (letter board to motyw hipsterskich kawiarni); czytelność: wersaliki w długim tekście męczą, więc tylko nagłówki i cennik; koszt: średni (litery jako krój albo SVG) |
| 3 | **Spiżarnia: półka słoików**: aplikacja to słoik z etykietą, zawartość to etap. | etap, karta prywatności | etykieta obraca się i pokazuje kartę prywatności | **odrzucony**: półka z aplikacjami jako przedmiotami to znak konkurenta (flonsus.com), latające słoiki to znak Agrumea Farm z poprzeczki; słoik to klisza ikon fermentacji (4/13) |
| 4 | **Paragon**: strona drukuje się jak paragon, indeks espresso to pozycje, przewijanie to wysuw papieru. | indeks espresso, data aktualizacji | papier wysuwa się przy przewijaniu, pozycje dopisują się jak z drukarki | AS IS już ma 4 paragony (powtórzenie wymaga decyzji); imitacja paragonu fiskalnego (zasada 14: wywodzić, nie kopiować); czytelność: krój o stałej szerokości tylko na liczby; koszt niski |
| 5 | **Warszawski neon**: szyld studia z rurek w duchu warszawskich neonów kawiarni; litery aplikacji gotowych świecą, przygotowywanych są zgaszone. | etap aplikacji (świeci/nie), miejsce (Warszawa), motyw (dzień/noc) | motyw jasny = szyld za dnia, rurki zgaszone; ciemny = noc, zapalone; zapalenie trwa ułamek sekundy przy pierwszym wejściu | kicz: wysoki, jeśli z poświatą i „cyberpunkiem” (Kalibracja: rozmyte plamy światła); prawne: nie kopiować konkretnych neonów (wywodzić krój); czytelność: rurka cienka, więc tylko nazwa i krótkie słowa; koszt: SVG z kreską, niski–średni |
| 6 | **Etykieta palarni**: aplikacja jak torebka kawy z etykietą: pochodzenie, proces, „nuty”, pieczątka z wersją i datą. | wersja, data, Warszawa, 3 cechy, „jak robimy” | pieczątka odbija się na etykiecie przy wejściu karty | kicz: średni–wysoki (kraft i pieczątki to klisza palarni); czytelność dobra; koszt niski |
| 7 | **Karta warki (dziennik warzenia)**: dla każdej aplikacji formularz piwowara z datami etapów i pomiarami. | daty etapów, wersja, 35 języków, liczba testów `[DO USTALENIA: liczba z repo aplikacji]` | wpisy pojawiają się „ręcznie” w polach | Kalibracja: układ formularza/gazetowy; dane etapów niepełne (brak dat w inwentarzu); koszt niski |
| 8 | **Ekstrakcja shotu**: filiżanka nalewa się do poziomu cen espresso w 4 krajach, kreska aplikacji zawsze niżej. | indeks espresso | nalewanie w ok. 1 s do poziomu ceny | filiżanka jest w AS IS; kreska „aplikacja” sugeruje cenę liczbą (test zabrania cen aplikacji); kicz: para i filiżanka to klisza kawy |
| 9 | **Zakwas z gumką**: gumka znaczy poziom startu, zakwas rośnie ponad nią jak studio od pierwszej aplikacji. | liczba aplikacji gotowych / w przygotowaniu | zakwas podnosi się ponad gumkę | zbyt blisko tożsamości Piekarza; słoik to klisza; mało danych |
| 10 | **Karta cuppingu**: formularz oceny kawy jako ocena aplikacji. | brak prawdziwych ocen | zaznaczanie skali | **odrzucony**: oceny byłyby zmyślone (zasada „nie zgaduj”) |
| 11 | **Próbnik palenia**: kafelki stopnia palenia od jasnych do ciemnych jako skala etapów. | etap | kafelek ciemnieje z etapem | słabe dane (etap ma 3 wartości); lepsze jako źródło palety niż metafora |
| 12 | **Laboratorium**: szkło miarowe dla researchu i testów. | liczba źródeł, testów `[DO USTALENIA]` | poziom rośnie | sterylne, typowe dla firm technologicznych (Kalibracja); brak własnego świata |

## 7. Wybór do rozwinięcia w E2

| Kierunek | Metafora | Dlaczego (funkcja, nie gust) |
|---|---|---|
| A | 1. Tablica warek | Odpowiada na P1 (wiarygodność): pokazuje, że studio wydaje, i na jakim etapie jest każda aplikacja. To produkt w działaniu, a nie opis (wniosek 3 z poprzeczki). Słowo „warka/brew” jest już w nazwie i w tekstach. Etap zmienia się w czasie, więc element żyje z danymi. |
| B | 2. Tablica z wsuwanymi literami | Niesie dwa elementy z listy „zachować” naraz: indeks espresso staje się cennikiem z menu, a przełącznik PL/EN staje się momentem firmowym, bo przestawia prawdziwe litery. Litery dają własny krój tytułów z dziedziny. |
| C | 5. Warszawski neon | Odpowiada na P1 miejscem (studio z Warszawy, a nie z kreatora stron). Motyw jasny i ciemny dostaje znaczenie (dzień i noc tego samego szyldu, D-008 4a), a świecenie liter niesie etap aplikacji. W skanie konkurencji nikt nie używa miejsca jako tożsamości poza zegarami miast na jednej stronie z poprzeczki. |
| Rezerwa 1 | 4. Paragon | Mocne dane (indeks) i ruch przy przewijaniu, ale powtarza AS IS: wymaga decyzji właściciela. |
| Rezerwa 2 | 6. Etykieta palarni | Niesie wersję i datę, ale grozi kliszą palarni. |

Odrzucone z powodem: 3 (znak konkurenta i poprzeczki), 10 (zmyślone dane), 12 (Kalibracja). 7, 8, 9, 11 zostają na liście jako materiał (np. kafelki palenia jako źródło palety w B).

## 8. Znaleziska dla właściciela

- **Hasło „tańsze niż espresso” ma bliskiego sąsiada.** Strona nr 4 ze skanu (szwedzkie mini-studio z aplikacją do zakwasu) porównuje cenę premium do kawy. Hasło zostaje (D-002), ale przewaga musi wynikać z indeksu espresso (dane z 4 krajów ze źródłami), którego tam nie ma. Realność: realne (osoba z P1 może znać obie strony), skutek niski.
- **Hasło „małe aplikacje” też jest zajęte** (strona nr 6, Berlin). Kierunki go nie używają jako hasła.
- **AS IS używa Bricolage Grotesque** (krój tytułów Organizera). Nowe kierunki go nie powtarzają bez decyzji (pamięć portfolio).

## 9. Otwarte pytania
- `[DO USTALENIA]` Czy strona może pokazać nazwy kolejnych aplikacji w przygotowaniu (np. jako zgaszone litery albo pusty zbiornik z nazwą)? Dziś strona mówi tylko „Kolejne aplikacje w przygotowaniu”. Decyzja produktowa; do tego czasu w makietach bez nazw.
- `[DO USTALENIA]` Liczba testów automatycznych aplikacji jako dana na stronie (z repo aplikacji, generowana) — tylko jeśli właściciel chce ją pokazywać.

## 10. Czego nie sprawdzono
- awwwards.com (brak odpowiedzi 20.10.2026), siteinspire (429), land-book i lapa.ninja (403).
- Na stronach z poprzeczki: płynność animacji, dźwięk, efekty WebGL (Chromium bez GPU); Strive przy 390 px (blokada antybotowa).
