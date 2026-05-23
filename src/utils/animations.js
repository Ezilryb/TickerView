/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Scroll Reveal & Animations
   src/utils/animations.js
══════════════════════════════════════════════════════════════ */

export function initScrollReveal(){
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, { threshold:0.08, rootMargin:'-16px 0px' });

  // Hero elements fire on load
  document.querySelectorAll('.hero .reveal').forEach(el => {
    const d = parseInt(el.className.match(/delay-(\d)/)?.[1] || 0, 10);
    setTimeout(() => el.classList.add('in-view'), 80 + d*110);
  });

  els.forEach(el => {
    if(!el.closest('.hero')) obs.observe(el);
  });
}

export function initHeroPriceAnimation(priceEl, changeEl){
  let base = 67842.50;
  const dir = () => Math.random() < 0.52 ? 1 : -1;
  setInterval(() => {
    base += dir() * (Math.random() * 95 + 10);
    base = Math.max(62000, Math.min(78000, base));
    priceEl.textContent = Math.round(base).toLocaleString('fr-FR');
    // Briefly highlight
    priceEl.style.color = 'var(--accent)';
    setTimeout(() => priceEl.style.color = '', 280);
  }, 2600);
}
