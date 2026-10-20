// Makiety E2: przełącznik języka (data-pl/data-en), motywu i przycisk „Kopiuj”. Zgodne z CSP (plik zewnętrzny, bez inline).
(() => {
  const root = document.documentElement;
  const ustawJezyk = (j) => {
    root.lang = j;
    for (const el of document.querySelectorAll('[data-pl]')) { if (!el.classList.contains('litery')) el.textContent = el.dataset[j]; }
    for (const b of document.querySelectorAll('[data-lang]')) b.setAttribute('aria-pressed', String(b.dataset.lang === j));
    document.dispatchEvent(new CustomEvent('jezyk', { detail: j }));
  };
  for (const b of document.querySelectorAll('[data-lang]')) b.addEventListener('click', () => ustawJezyk(b.dataset.lang));
  for (const b of document.querySelectorAll('[data-motyw]')) b.addEventListener('click', () => {
    const ciemny = root.dataset.theme !== 'dark';
    root.dataset.theme = ciemny ? 'dark' : 'light';
    b.setAttribute('aria-pressed', String(ciemny));
  });
  for (const b of document.querySelectorAll('[data-kopiuj]')) b.addEventListener('click', async () => {
    const stan = b.parentElement.querySelector('.kopiuj-stan');
    try { await navigator.clipboard.writeText(b.dataset.kopiuj); stan.textContent = root.lang === 'en' ? 'Copied' : 'Skopiowano'; } catch { stan.textContent = b.dataset.kopiuj; }
  });
})();
