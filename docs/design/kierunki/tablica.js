// B: zmiana języka przestawia litery na tablicach (moment firmowy). „Ogranicz ruch”: litery zmieniają się od razu.
(() => {
  const spokoj = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('jezyk', (e) => {
    for (const s of document.querySelectorAll('.litery')) {
      const txt = s.dataset[e.detail];
      s.innerHTML = [...txt].map((c, n) => `<i${spokoj ? '' : ` class="wsuwa" style="--n:${n}"`}>${c === ' ' ? '&nbsp;' : c}</i>`).join('');
    }
  });
})();
