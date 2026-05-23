/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Financials Component
   src/components/Financials/financials.js
   v2 — accepts financialsData param built by symbolRegistry
══════════════════════════════════════════════════════════════ */

/**
 * @param {Array} financialsData - Built by symbolRegistry.buildFinancials()
 */
export function renderFinancials(financialsData) {
  const el = document.getElementById('financials-grid');
  if (!el || !financialsData) return;

  el.innerHTML = financialsData.map(f => `
    <div class="fin-cell ${f.fire ? 'fire' : ''}">
      <div class="fin-label">${f.label}</div>
      <div class="fin-value">${f.value}</div>
      <div class="fin-sub">${f.sub}</div>
    </div>
  `).join('');
}
