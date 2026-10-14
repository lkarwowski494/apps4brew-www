// Apps4Brew — przełącznik języka PL/EN i kopiowanie adresu e-mail.
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
    if (meta && meta.getAttribute('data-content-' + l)) {
      meta.setAttribute('content', meta.getAttribute('data-content-' + l));
    }
    var pl = document.getElementById('lang-pl');
    var en = document.getElementById('lang-en');
    if (pl) pl.setAttribute('aria-pressed', String(l === 'pl'));
    if (en) en.setAttribute('aria-pressed', String(l === 'en'));
    try { localStorage.setItem('a4b-lang', l); } catch (e) {}
  }

  var plBtn = document.getElementById('lang-pl');
  var enBtn = document.getElementById('lang-en');
  if (plBtn) plBtn.addEventListener('click', function () { setLang('pl'); });
  if (enBtn) enBtn.addEventListener('click', function () { setLang('en'); });

  var saved = null;
  try { saved = localStorage.getItem('a4b-lang'); } catch (e) {}
  if (saved === 'en') setLang('en');

  var btn = document.getElementById('copy');
  var addr = document.getElementById('addr');
  var status = document.getElementById('copy-status');
  if (btn && addr) {
    btn.addEventListener('click', function () {
      var t = addr.textContent;
      var done = function () {
        var msg = cur === 'pl' ? 'Skopiowano' : 'Copied';
        btn.textContent = msg;
        if (status) status.textContent = msg;
      };
      var sel = function () {
        var r = document.createRange();
        r.selectNodeContents(addr);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(done, sel);
      } else {
        sel();
      }
    });
  }
})();
