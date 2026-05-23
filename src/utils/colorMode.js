/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Color Mode Toggle
   src/utils/colorMode.js
══════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'tv_theme';
const DARK  = 'dark';
const LIGHT = 'light';

const ICON_DARK  = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.5 8.5A5.5 5.5 0 1 1 5.5 1.5a4 4 0 0 0 7 7z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const ICON_LIGHT = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="7" cy="7" r="2.8" stroke="currentColor" stroke-width="1.2"/>
  <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.9 2.9l1.06 1.06M10.04 10.04l1.06 1.06M2.9 11.1l1.06-1.06M10.04 3.96l1.06-1.06" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
</svg>`;

export function initColorMode(btnEl) {
  if (!btnEl) return;
  const saved      = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
  const initial    = saved || (prefersDark ? DARK : LIGHT);
  applyTheme(initial, btnEl);

  btnEl.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === DARK ? LIGHT : DARK, btnEl);
  });
}

function applyTheme(theme, btnEl) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
  btnEl.innerHTML = theme === DARK ? ICON_LIGHT : ICON_DARK;
  btnEl.title = theme === DARK ? 'Passer en mode clair' : 'Passer en mode sombre';
}
