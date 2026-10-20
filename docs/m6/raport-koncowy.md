# M6 Strona WWW apps4brew.com: raport końcowy (20.10.2026)

## Podsumowanie
- Strona zbudowana od nowa na gałęzi `strona/apps4brew-2026-10-20` (HEAD 5a371ac), statyczny HTML/CSS, te same adresy; `main` bez zmian (efa7ff0), nic nie opublikowane.
- Kierunek wybrany przez właściciela: A2 „Od ziarna do filiżanki” + tablica B w indeksie espresso (D-011: „A2 - to dla sekcji o aplikacjach a dla sekcji o indeksie espresso B?”), krój Young Serif (D-014), system i ikona (D-015).
- Weryfikacja w świeżym kontekście (rola 04 audit): P0 = 0, P1 = 0, P2 = 10, P3 = 6. Raport: `audit/M6-2026-10-20/role/04-po/04-studio-projektowe-2026-10-20.md`.
- Decyzje właściciela: `docs/decyzje.md` D-001–D-022.

## Strony przed i po
| Ścieżka | Zrzut przed | Zrzut po | Uwagi |
|---|---|---|---|
| `/` | `zrzuty/przed/index-1440-light.png` | `zrzuty/po/index-1440-jasny.png` | teksty zmienione decyzją D-016; zasady „Jak robimy aplikacje” w PL i EN (EN: `zrzuty/po/index-1440-jasny-en.png`) |
| `/trening/privacy.html` | `zrzuty/przed/trening-privacy-1440-light.png` | `zrzuty/po/trening-privacy-1440-jasny.png` | treść sekcji PL/EN identyczna z main (test sha256 + skrypt M6) |
| `/trening/support.html` | `zrzuty/przed/trening-support-1440-light.png` | `zrzuty/po/trening-support-1440-jasny.png` | treść sekcji PL/EN identyczna z main (test sha256 + skrypt M6) |
| `/piekarz/privacy.html` | `zrzuty/przed/piekarz-privacy-1440-light.png` | `zrzuty/po/piekarz-privacy-1440-jasny.png` | treść sekcji PL/EN identyczna z main (test sha256 + skrypt M6) |
| `/piekarz/support.html` | `zrzuty/przed/piekarz-support-1440-light.png` | `zrzuty/po/piekarz-support-1440-jasny.png` | treść sekcji PL/EN identyczna z main (test sha256 + skrypt M6) |
| `/404.html` | `zrzuty/przed/404-1440-light.png` | `zrzuty/po/404-1440-jasny.png` | „Tego ziarna tu nie ma.” |

## Adresy
- `tests/adresy.txt` (z inwentarza E0): każdy plik istnieje, kotwice `#apps #piekarz #how #index #about #top #main` są w index.html — test w `node --test`, zielony.
- Adresy dla App Store Connect (D-003): `/trening/privacy.html`, `/trening/support.html`, `/piekarz/privacy.html`, `/piekarz/support.html`, `/` — bez zmian ścieżek; canonical każdej strony = jej własny adres.
- Sprawdzenie na żywo po publikacji: krok po scaleniu (curl, kody 200).

## Weryfikacja
- SP-13: 34/34 zrzuty wzorcowe, różnica 0,00–0,09 % pikseli.
- SP-22: reflow 320 px (6 stron × 5 szerokości × 2 motywy), pełne przejście klawiaturą, fokus widoczny, cele ≥ 24 px, lang, tytuły, opisy, canonical, OG, CSP i adresy w porządku; znaleziska 001, 005, 013.
- LCP i CLS (laboratorium Playwright, uproszczenie bez danych z pola): LCP 56–92 ms (komputer), 516–908 ms (profil telefonu); CLS ≤ 0,038 (komputer), 0,175 na stronach wsparcia w profilu telefonu (znalezisko 001, P2). Waga 122–202 kB. Konsola: 0 błędów.
- Nie sprawdzono: Safari i iPhone (CLS, „aA”, VoiceOver), INP, wersja opublikowana.

## Komendy końcowe
- `node --test`: 38 testów, 38 pass, 0 fail, 0 todo, kod 0.
- `git status --porcelain`: pusty; `audit/` w `.git/info/exclude`.
- Commity M6/04/08 na gałęzi: od e01e5a7 do 5a371ac.

## Kroki właściciela
- Decyzja o naprawach P2/P3 przed publikacją i 4 decyzje z raportu weryfikacji (nazwy EN, pasek na obrazie OG, linia praw Apple, cele 44 px, ciąg „·”).
- Podgląd gałęzi, potem zgoda na publikację (scalenie z `main`), przed scaleniem sprzątanie `docs/design/` (D-018).
- Wpisanie adresów z D-003 w App Store Connect.
- Zmiana eksportu Treningu na gałęzi `f020-sklep` (D-022), osobna sesja.
- Sprawdzenie, czy skrzynka support@apps4brew.com odbiera pocztę (komentarz w HTML podstron z 14.10.2026: działa „dopiero po weryfikacji DSA”).
- iPhone: CLS i „aA” w Safari przy pierwszej wizycie, VoiceOver na polityce (ok. 20 min).

## Kontrola dowodów i sekretów
- Diff gałęzi bez sekretów (grep `secret|token|api_key` po każdej partii: brak trafień).
- Wynik `sprawdz-raport.mjs`: wpisany niżej.

## Linia bazowa i założenia
Linia bazowa: `docs/design/design-spec.md` i `docs/design/wzorce-zrzuty/` (rola 04 build, D-015); stan przed: `inwentarz.md` (E0). Założenia: `docs/decyzje.md` D-001–D-022.

## Pokrycie
Wymiary pokrycia M6: strony i języki, adresy, 320–1440 i motywy, klawiatura i czytnik, wyszukiwarki i OG, wydajność i prywatność, przyciski App Store (sprawdzone, brak: aplikacje w TestFlight, test zabrania linku). Szczegóły i czego nie sprawdzono: raport weryfikacji, sekcja „Pokrycie”.

## Stosowalność listy kontrolnej
Lista kontrolna roli 04 (SP-01–SP-22) w raporcie weryfikacji, sekcja „Stosowalność listy kontrolnej”.

## Znaleziska
P0 0, P1 0, P2 10 (04-studio-projektowe-001–010), P3 6 (011–016); tabela i szczegóły w raporcie weryfikacji. E1-01 (brak EN zasad, P1 z kroku E1.3) naprawione w partii 1 (27ad3a1).

## Do sprawdzenia
Skrzynka support@ (DSA), CLS i „aA” na iPhonie, VoiceOver, moment animacji paska („przy pierwszym pokazaniu”).

## Co działa dobrze
Adresy i treść polityk bez zmian, reflow 320 px, klawiatura, kontrast w obu motywach, LCP z zapasem, brak śledzenia i zasobów zewnętrznych.

## Decyzje dla właściciela
Naprawy P2/P3 przed publikacją; nazwy EN (010), pasek OG (003), linia praw Apple (005), cele 44 px (007), ciąg „·” (016); publikacja.

## Proponowane polecenie naprawy
`node <prompts>/tools/assemble.mjs 08-programista --tryb fix --data 2026-10-20 --galaz strona/apps4brew-2026-10-20 --zadania <ID z raportu weryfikacji> --plik K/prompty/08-fix.md`
- `node audit/M6-2026-10-20/narzedzia/sprawdz-raport.mjs audit/M6-strona-www-2026-10-20.md . audit/M6-2026-10-20`: „OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone; format raportu M6-strona-www”, kod 0.
