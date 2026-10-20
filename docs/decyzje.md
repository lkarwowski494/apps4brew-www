# Decyzje strony apps4brew.com

Rejestr decyzji repo strony. Decyzje sprzed 20.10.2026 są w historii commitów (np. 14.10.2026, D-2 A z repo Trening: polityka i wsparcie pod apps4brew.com/trening/).

| ID | Decyzja (data, słowa właściciela) | Odrzucone | Powód / zależy od |
|---|---|---|---|
| D-001 | **Cel strony, od najważniejszego** (20.10.2026, STOP 1 M6): „a) Wizytowka i warygodnosc studia dla klientow/inwestorow b) informacja: polityki i wsparcie c) pobrania”. | pobrania jako cel główny | Strona studia przed wydaniem aplikacji (obie w TestFlight); hierarchia treści i CTA w projekcie roli 04 wynikają z tej kolejności. |
| D-002 | **Zachować z obecnej strony** (20.10.2026, STOP 1 M6): „hasło „tańsze niż espresso” i indeks espresso; sekcja „Jak robimy aplikacje”; PL/EN pod jednym adresem”. Lista wiążąca dla roli 04; reszta wyglądu (filiżanka, kroje, układ kart) nie jest na liście i może zniknąć. Treść podstron (polityki, wsparcie) przenoszona bez zmian (zasada M6: treść to decyzja właściciela). | osobne adresy `/en/` z hreflang (wykluczone słowami „PL/EN pod jednym adresem”) | Słowa właściciela. |
| D-003 | **Adresy dla App Store Connect** (20.10.2026, STOP 1 M6): „Jeszcze nie wpisalismy ale chce zeby odosily sie do tej strony”. Adresy docelowe: `https://apps4brew.com/trening/privacy.html`, `/trening/support.html`, `/piekarz/privacy.html`, `/piekarz/support.html`; marketing: `https://apps4brew.com/`. Muszą działać przed i po przebudowie. Krok właściciela: wpisać je w App Store Connect. | stare `lkarwowski494.github.io/trening/*` (inne repo; nadal 200 na 20.10.2026) | Jedna domena studia; adresy już istnieją i są testowane. |
| D-004 | **Przebieg M6: pełny (a)**; projekt (rola 04 build) w nowej sesji otwartej przez właściciela (20.10.2026, STOP 1). | (b) rola 04 jako subagent; (c) tylko projekt | Wybór kierunku okiem w pełnym kontekście roli 04. |
| D-005 | **Stan przebiegu M6 w `docs/m6/` na gałęzi roboczej** od E1 (20.10.2026, STOP 1, odpowiedź „5b”). Zrzuty zostają poza gitem (`audit/`). | stan tylko w katalogu przebiegu poza gitem | Kontener chmury może zniknąć; plik stanu musi przetrwać sesję (zasada wspólna 19). |
