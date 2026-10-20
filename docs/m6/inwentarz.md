# Inwentarz apps4brew.com (E0 M6, 20.10.2026)

Stan: gałąź `strona/apps4brew-2026-10-20` = `origin/main` = efa7ff0; pliki na żywo identyczne bajt w bajt z repo (index, 4 podstrony, 404, site.css, site.js; `cmp`, 20.10.2026). Testy: `node --test` 22/22, kod 0 (`dowody/testy-przed.txt`). CI: `.github/workflows/test.yml` (node 22, `node --test`, bez sekretów).

## Strony
| Ścieżka | Języki | Tytuł (PL) | Opis | Główne treści | Zrzuty (390 / 1440, jasny i ciemny) |
|---|---|---|---|---|---|
| `/` index.html (21 kB) | PL domyślnie, EN przełącznikiem JS (`data-pl/data-en`, `localStorage a4b-lang`), jeden adres | Apps4Brew — aplikacje tańsze niż espresso | „studio z Warszawy… subskrypcja kosztuje mniej niż jedno espresso…” | hero „Aplikacje tańsze niż espresso.” z animowaną filiżanką SVG i metką „< 1 espresso”; karty Trening i Piekarz (ikona, meta „TestFlight”, 3 cechy, prywatność, linki polityka/wsparcie); karta „Wkrótce”; „Jak robimy aplikacje” (6 zasad, AI na każdym etapie); „Indeks espresso” (4 paragony: Włochy, Polska, Brazylia, RPA + przypis ze źródłami i datami); „O studiu”; „Partnerzy i inwestorzy” (hello@ + przycisk Kopiuj); stopka (Wsparcie, Prywatność → Trening, Warunki → EULA Apple, support@) | `zrzuty/przed/index-*.png` |
| `/trening/privacy.html` (15 kB) | PL i EN sekcjami, JS pokazuje jedną | Trening — polityka prywatności | dane na iPhonie | 12 sekcji × 2 języki; „Obowiązuje od 14.10.2026 (wersja 0.20.0)”; **plik generowany z repo aplikacji Trening** (`scripts/site/export-apps4brew.mjs`, „nie edytować ręcznie”) | `trening-privacy-*` |
| `/trening/support.html` (6 kB) | PL/EN | Trening — wsparcie | kontakt + FAQ | kontakt support@, 4 pytania FAQ; generowany jak wyżej | `trening-support-*` |
| `/piekarz/privacy.html` (11 kB) | PL/EN | Piekarz — polityka prywatności | bez konta i analityki | 10 sekcji × 2 języki (aparat, zakup dożywotni) | `piekarz-privacy-*` |
| `/piekarz/support.html` (6 kB) | PL/EN | Piekarz — wsparcie | kontakt + FAQ | 5 pytań FAQ (jednostki °C/°F, g/oz) | `piekarz-support-*` |
| `/404.html` | PL/EN | Nie ma takiej strony — Apps4Brew | — | „Ta filiżanka jest pusta.”, `noindex`, ścieżki bezwzględne `/assets/` | `404-*` (z apps4brew.com, kod 404) |

## Linki
| Z | Do | Rodzaj |
|---|---|---|
| index | `#apps`, `#index`, `#top`, `#main` | wewnętrzne kotwice |
| index (karty, stopka) | `trening/privacy.html`, `trening/support.html`, `piekarz/privacy.html`, `piekarz/support.html` | wewnętrzne |
| wszystkie | `https://www.apple.com/legal/internet-services/itunes/dev/stdeula/` | inny (Apple EULA) |
| wszystkie | `mailto:support@apps4brew.com`; index: `mailto:hello@apps4brew.com` | e-mail |
| podstrony | `../`, `privacy.html`, `support.html` | wewnętrzne |
| — | **brak linków do App Store** (aplikacje w TestFlight; test to wymusza) | — |

## Adresy ze sklepu
Właściciel 20.10.2026 (D-003): adresy jeszcze niewpisane w App Store Connect; mają prowadzić do apps4brew.com.
| Aplikacja | Pole w App Store Connect | Adres docelowy | Działa (20.10.2026) |
|---|---|---|---|
| Trening | Privacy Policy URL | https://apps4brew.com/trening/privacy.html | 200 |
| Trening | Support URL | https://apps4brew.com/trening/support.html | 200 |
| Piekarz | Privacy Policy URL | https://apps4brew.com/piekarz/privacy.html | 200 |
| Piekarz | Support URL | https://apps4brew.com/piekarz/support.html | 200 |
| obie | Marketing URL | https://apps4brew.com/ | 200 |

## Zasoby
- Fonty lokalne (woff2, latin + latin-ext): Bricolage Grotesque, Instrument Sans, JetBrains Mono — licencje SIL OFL 1.1 w `fonts/`.
- Obrazy: `trening-icon.png` (64 px, 6,6 kB), `piekarz-icon.svg`, `og-image.png` 1200×630 (198 kB), `favicon.svg`, `apple-touch-icon.png`.
- Grafika hero: inline SVG filiżanki z animacją pary (wyłączana przy `prefers-reduced-motion`).
- Waga strony głównej (HTML+CSS+JS+ikony+3 fonty latin): ok. 186 kB bez latin-ext (rachunek `du`), polskie znaki dociągają latin-ext (+~53 kB).

## Bezpieczeństwo i prywatność
- CSP w `<meta>` na każdej stronie: `default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'`; `referrer: no-referrer`.
- GitHub Pages nie pozwala ustawić nagłówków HTTP (nagłówki na żywo: `server: GitHub.com`, `cache-control: max-age=600`, brak CSP w nagłówku).
- Brak analityki, ciasteczek i zasobów zewnętrznych (testy pilnują); jedyny zapis: `localStorage a4b-lang`.
- `style="..."` inline: 2 miejsca w index (powód `'unsafe-inline'`).

## Hosting
- `CNAME` = apps4brew.com, `.nojekyll`, GitHub Pages z `main` / root; www i http → 301 na https://apps4brew.com/.
- Brak `robots.txt` i `sitemap.xml` (404).

## Obserwacje (wymiary pokrycia; do projektu, nie do naprawy teraz)
| Wymiar | Wynik |
|---|---|
| Strony i języki | 6 stron; EN tylko przez JS na tym samym adresie — wyszukiwarka i podgląd udostępnienia widzą PL (og:locale pl_PL, og tylko PL). Realny dla „osoby z wyszukiwarki” spoza Polski. |
| Adresy | wszystkie z repo działają; stare github.io też (inne repo). |
| 320–1440, motywy | 390 i 1440 bez przewijania w poziomie (scrollWidth = szerokość), jasny i ciemny działają; 320 i powiększenie 200% — sprawdzone, brak (zrobi E3). |
| Klawiatura, czytnik | skip link, `aria-pressed` na języku, `role=status` przy kopiowaniu, test fokusu i reduced motion istnieje; pełne przejście klawiaturą — nie sprawdzono w E0. |
| Wyszukiwarki i udostępnianie | index: komplet OG + twitter; **podstrony i 404: brak OG i canonical**; brak hreflang, robots.txt, sitemap. |
| Wydajność i prywatność | lekka strona, fonty lokalne z preload; LCP/CLS nie mierzone w E0. |
| App Store | brak przycisków App Store (świadomie: TestFlight); stopka „Wsparcie/Prywatność” prowadzi tylko do Treningu (niejednoznaczne przy dwóch aplikacjach) — brzegowy. |
| README | nieaktualny: mówi o linkach do lkarwowski494.github.io, a testy ich zabraniają. |
| Podstrony Treningu | generowane z repo aplikacji — przebudowa szablonu musi trafić też do `export-apps4brew.mjs` w repo Trening, inaczej następny eksport nadpisze nowy wygląd. **Realny.** |

## Źródła sieciowe (E0, 20.10.2026)
apps4brew.com 200 · cssdesignawards.com 200 · developer.apple.com/design/awards 200 · awwwards.com: przekroczony czas (kod 000) — **nie sprawdzono**.
