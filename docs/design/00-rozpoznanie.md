# E0 rozpoznanie — strona apps4brew.com od zera (rola 04 build, 20.10.2026)

Prompt: `04-studio-projektowe --tryb build --moduly strona-www,render-i-krytyka,pamiec-portfolio` (repo `prompts` @ 624d3e8, 741 linii, ~18,9 tys. tokenów).

## Środowisko (sprawdzone 20.10.2026)
| Sprawdź | Wynik |
|---|---|
| System, Node, git | Linux x86_64, Node v22.22.0, gałąź `strona/apps4brew-2026-10-20` czysta, zgodna z origin |
| Testy | `node --test` 22/22, kod 0 |
| GitHub | push na gałąź roboczą przez proxy; gałęzie zdalne: `main`, `strona/apps4brew-2026-10-20` (innego interfejsu brak) |
| Przeglądarka | Playwright 1.56.1 w scratchpadzie, Chromium 141 uruchamia się; zrzuty AS IS 390/1440 zrobione (scratchpad) |
| Sieć (curl, 20.10.2026) | cssdesignawards.com 200 · onepagelove.com 200 · developer.apple.com 200 · godly.website 301 → recent.design · awwwards.com **000 (nie sprawdzono)** · thefwa.com 000 (nie sprawdzono) · siteinspire.com 429 · land-book.com 403 |
| Repo | publiczne; bez sekretów w zmianach |

## Przepływy (z D-001; kontraktu zakresu brak → założenia `[ZAŁ]`)
| # | Kto | Cel | Kroki | Częstość |
|---|---|---|---|---|
| P1 | klient / inwestor z linku (e-mail, LinkedIn, rozmowa) | ocenić wiarygodność studia | `/` → kto, co zrobił, jak pracuje → kontakt hello@ | rzadko, decydujące 30–60 s `[ZAŁ]` |
| P2 | użytkownik aplikacji albo recenzent Apple z App Store | przeczytać politykę / znaleźć pomoc | adres z App Store Connect → podstrona → (support@) | najczęstsze wejście po wydaniu `[ZAŁ]` |
| P3 | osoba zainteresowana aplikacją | pobrać / zapisać się | `/` → karta aplikacji → (dziś TestFlight, brak App Store) | rzadko do wydania |

## Konteksty użycia
- P1: laptop przy biurku albo telefon w drodze; światło dowolne; ręce wolne; pierwsze spojrzenie kilka sekund, sesja 1–3 min; bez hałasu. Oczy wolne → moduł `kontekst-oczy-zajete` pominięty.
- P2: iPhone (wejście z App Store), krótka sesja, czytanie długiego tekstu → czytelność, skalowanie tekstu, ciemny motyw.
- P3: telefon; do wydania brak przycisku App Store (test wymusza).

## Ograniczenia z projektu
- D-002 zachować: hasło „tańsze niż espresso”, indeks espresso, „Jak robimy aplikacje”, PL/EN pod jednym adresem.
- D-003 adresy bez zmian (4 podstrony + `/`), `CNAME`.
- Statyczny HTML/CSS + minimalny JS, CSP bez zmian, fonty lokalne, brak śledzenia, bez nowych zależności.
- Testy (nie zmieniam): m.in. `canonical` musi być `https://apps4brew.com/` na każdej stronie, komplet OG, `data-pl`/`data-en`, brak cen aplikacji, ceny tylko w indeksie espresso. Uwaga dla wdrożenia (rola 08 / M6): test kanoniczny wyklucza własny `canonical` podstron — znalezisko, nie zmiana projektu.
- Podstrony Treningu generowane z repo Trening (`scripts/site/export-apps4brew.mjs`) → szablon podstrony: jeden plik CSS, bez JS poza przełącznikiem języka, struktura sekcji PL/EN jak dziś.

## AS IS (wygląd, nie wzorzec) — ślady z „Kalibracji domyślnych wyborów”
kremowe tło + ciemny tusz; mono WERSALIKAMI z rozstrzeleniem nad każdym nagłówkiem; wyróżnienie słowa kolorem („espresso.”); jednakowe zaokrąglone karty; ciągi „A · B · C”; Bricolage Grotesque (już w Organizerze).

## Pamięć portfolio — czego nie powtarzać bez decyzji
IBM Plex, papier #F4F3EF, niebieski #1F5FD1 (Trening); Bricolage Grotesque, piasek + terakota (Organizer); Jost, brąz + biel (NaviStories).

## Ekran kluczowy
Strona główna 390 i 1440 px + podstrona polityki prywatności (szablon dla 4 podstron i eksportu Treningu).

## Plan i czas (agent / czekanie / właściciel)
| Etap | Agent | Czekanie | Właściciel |
|---|---|---|---|
| E1 świat, poprzeczka wow (10–12 stron), skan konkurencji, ≥8 metafor | 1–1,5 h | sieć | STOP ~15 min |
| E2 trzy kierunki (główna 390/1440 + polityka), test generyczności, porównanie.png | 2,5–3,5 h | zrzuty | STOP ~20 min (+ opcjonalnie test 5 s, ~1 h) |
| E3 tokeny CSS, kontrast, komponenty, zrzuty 320–1440 × 2 motywy, favicon/ikona | 2–3 h | zrzuty | STOP ~20 min |
| E4 design-spec AS IS → TO BE | 0,5 h | — | ~10 min |
