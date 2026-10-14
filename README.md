# apps4brew.com

Strona studia Apps4Brew. Statyczny HTML publikowany przez GitHub Pages z gałęzi `main` (katalog główny) pod domeną
`apps4brew.com`. Bez kroku budowania, bez zależności.

## Co jest w repo

| Ścieżka | Co to jest |
| --- | --- |
| `index.html` | Strona główna (PL domyślnie, EN po przełączeniu; wybór języka zapamiętany w `localStorage` pod kluczem `a4b-lang`). |
| `404.html` | Strona „nie ma takiej strony” w tym samym stylu. |
| `assets/site.css`, `assets/site.js` | Style (z `@font-face`) i skrypt przełącznika języka oraz przycisku „Kopiuj”. |
| `assets/*.png`, `assets/favicon.svg` | Ikona aplikacji Trening, obraz Open Graph (1200×630), ikony strony. |
| `fonts/` | Czcionki Bricolage Grotesque, Instrument Sans, JetBrains Mono (woff2, podzbiory latin i latin-ext) z licencjami SIL OFL 1.1. |
| `CNAME` | Domena dla GitHub Pages: `apps4brew.com`. |
| `.nojekyll` | Wyłącza Jekyll — pliki są serwowane bez przetwarzania. |
| `tests/site.test.mjs` | Testy `node --test` (bez zależności). |
| `.github/workflows/test.yml` | Uruchamia testy przy każdym pushu (ubuntu, bez sekretów). |

## Zasady

- **Prywatność:** żadnych zasobów zewnętrznych (czcionki lokalnie), bez analityki, bez ciasteczek. Polityka CSP w `<meta>`
  pozwala ładować tylko pliki z tej samej domeny. Jedyny zapis w przeglądarce to wybrany język.
- **Ceny:** na stronie są tylko ceny espresso (lokalnie i „≈ $” USD) w indeksie espresso, oznaczonym komentarzami
  `indeks-espresso:start/end`. Cen aplikacji na stronie nie ma.
- **Teksty:** każdy przetłumaczalny element ma `data-pl` i `data-en` (alt obrazków: `data-alt-pl/en`).
- **Linki zewnętrzne:** tylko apple.com (licencja) i lkarwowski494.github.io (wsparcie, prywatność); adresy e-mail tylko
  hello@ i support@apps4brew.com.

Testy pilnują tych zasad. Uruchomienie lokalnie (Node 20+):

```sh
node --test
```

Podgląd lokalnie: `python3 -m http.server` w katalogu repo i adres `http://localhost:8000/`.

## Publikacja

Settings → Pages → Source: „Deploy from a branch”, gałąź `main`, katalog `/ (root)`. Custom domain: `apps4brew.com`,
potem „Enforce HTTPS”. Każdy push do `main` publikuje stronę w ciągu kilku minut.
