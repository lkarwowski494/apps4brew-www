// Apps4Brew — przełącznik języka PL/EN (z przestawieniem liter na tablicy indeksu espresso) i kopiowanie adresu e-mail.
// Jedyny zapis w przeglądarce: wybrany język (localStorage, klucz "a4b-lang"). Bez ciasteczek i analityki.
(function () {
  var cur = 'pl';
  var meta = document.querySelector('meta[name="description"]');

  function setLang(l) {
    cur = l;
    document.documentElement.lang = l;
    document.querySelectorAll('[data-' + l + ']').forEach(function (el) {
      el.innerHTML = el.getAttribute('data-' + l);
    });
    document.querySelectorAll('[data-alt-' + l + ']').forEach(function (el) {
      el.setAttribute('alt', el.getAttribute('data-alt-' + l));
    });
    document.querySelectorAll('[data-label-' + l + ']').forEach(function (el) {
      el.setAttribute('aria-label', el.getAttribute('data-label-' + l));
    });
    // Strony dokumentów (trening/privacy.html, trening/support.html): widoczna tylko sekcja wybranego języka; bez JS widać obie.
    document.querySelectorAll('[data-lang-section]').forEach(function (el) {
      el.hidden = el.getAttribute('data-lang-section') !== l;
    });
    if (meta && meta.getAttribute('data-content-' + l)) {
      meta.setAttribute('content', meta.getAttribute('data-content-' + l));
    }
    var pl = document.getElementById('lang-pl');
    var en = document.getElementById('lang-en');
    if (pl) pl.setAttribute('aria-pressed', String(l === 'pl'));
    if (en) en.setAttribute('aria-pressed', String(l === 'en'));
    try { localStorage.setItem('a4b-lang', l); } catch (e) {}
    tablica(l);
  }

  // Tablica z wsuwanymi literami: litery w <i>, tekst w data-tab-pl/en; przy zmianie języka wsuwają się kolejno (bez ruchu przy „Ogranicz ruch”).
  var spokoj = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pierwszy = true;
  function tablica(l) {
    document.querySelectorAll('[data-tab-' + l + ']').forEach(function (el) {
      var txt = el.getAttribute('data-tab-' + l);
      var html = '';
      for (var n = 0; n < txt.length; n++) {
        var c = txt[n] === ' ' ? '&nbsp;' : txt[n].replace('<', '&lt;');
        html += (spokoj || pierwszy) ? '<i>' + c + '</i>' : '<i class="wsuwa" style="--n:' + n + '">' + c + '</i>';
      }
      el.innerHTML = html;
    });
    pierwszy = false;
  }

  var plBtn = document.getElementById('lang-pl');
  var enBtn = document.getElementById('lang-en');
  if (plBtn) plBtn.addEventListener('click', function () { setLang('pl'); });
  if (enBtn) enBtn.addEventListener('click', function () { setLang('en'); });

  var saved = null;
  try { saved = localStorage.getItem('a4b-lang'); } catch (e) {}
  if (saved === 'en' || document.querySelector('[data-lang-section]')) setLang(saved === 'en' ? 'en' : 'pl');
  pierwszy = false; // także gdy przy wczytaniu nie było setLang (nowy gość): litery tablicy mają ruch już przy pierwszej zmianie języka (D-011)

  var btn = document.getElementById('copy');
  var addr = document.getElementById('addr');
  var status = document.getElementById('copy-status');
  if (btn && addr) {
    btn.addEventListener('click', function () {
      var t = addr.textContent;
      var say = function (msg) {
        btn.textContent = msg;
        if (status) status.textContent = msg;
      };
      var done = function () { say(cur === 'pl' ? 'Skopiowano' : 'Copied'); };
      // Schowek niedostępny albo odmówił: adres zostaje zaznaczony i mówimy, co zrobić (macierz stanów: błąd = co się stało i co zrobić).
      var sel = function () {
        var r = document.createRange();
        r.selectNodeContents(addr);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
        say(cur === 'pl' ? 'Adres zaznaczony — skopiuj go (Ctrl+C / ⌘C)' : 'Address selected — copy it (Ctrl+C / ⌘C)');
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(done, sel);
      } else {
        sel();
      }
    });
  }
})();
