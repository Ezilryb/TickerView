/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Company Info Component
   src/components/CompanyInfo/companyInfo.js
   v2 — accepts stockData param (no longer hardcoded to AAPL)
══════════════════════════════════════════════════════════════ */

/**
 * @param {object} STOCK - Symbol data from symbolRegistry.getSymbolData()
 */
export function renderCompanyInfo(STOCK) {
  const el = document.getElementById('company-info');
  if (!el || !STOCK) return;

  const isCrypto  = STOCK.sector === 'Crypto Assets';
  const isFutures = ['Equity Index Futures', 'Foreign Exchange', 'Precious Metals'].includes(STOCK.sector);

  const fmtPrice = v => v > 100
    ? `$${v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${v.toFixed(4)}`;

  el.innerHTML = `
    <div class="ci-logo-row">
      <div class="ci-logo" aria-hidden="true">
        ${_buildLogo(STOCK)}
      </div>
      <div>
        <div class="ci-sym">${STOCK.sym}</div>
        <div class="ci-exchange">${STOCK.exchange}${STOCK.isin !== '—' ? ' · ' + STOCK.isin : ''}</div>
      </div>
    </div>

    <div class="ci-name">${STOCK.name}</div>

    <div class="ci-tags">
      <span class="ci-tag">${STOCK.sector}</span>
      <span class="ci-tag">${STOCK.industry}</span>
    </div>

    <p class="ci-desc">${STOCK.description}</p>

    <div class="ci-facts">
      ${STOCK.ceo && STOCK.ceo !== '—' ? `
      <div class="ci-fact">
        <span class="ci-fact-label">${isCrypto ? 'Créateur' : 'CEO'}</span>
        <span class="ci-fact-val">${STOCK.ceo}</span>
      </div>` : ''}
      ${STOCK.founded && STOCK.founded !== '—' ? `
      <div class="ci-fact">
        <span class="ci-fact-label">Fondé en</span>
        <span class="ci-fact-val">${STOCK.founded}</span>
      </div>` : ''}
      <div class="ci-fact">
        <span class="ci-fact-label">Siège / Zone</span>
        <span class="ci-fact-val">${STOCK.hq}</span>
      </div>
      ${STOCK.employees && STOCK.employees !== '—' ? `
      <div class="ci-fact">
        <span class="ci-fact-label">Effectif</span>
        <span class="ci-fact-val">${STOCK.employees}</span>
      </div>` : ''}
    </div>

    <div class="ci-ohlcv">
      <div class="ci-ohlcv-row">
        <span>Ouverture</span><span>${fmtPrice(STOCK.open)}</span>
      </div>
      <div class="ci-ohlcv-row">
        <span>Haut</span><span class="fire">${fmtPrice(STOCK.high)}</span>
      </div>
      <div class="ci-ohlcv-row">
        <span>Bas</span><span class="dn">${fmtPrice(STOCK.low)}</span>
      </div>
      <div class="ci-ohlcv-row">
        <span>Clôture préc.</span><span>${fmtPrice(STOCK.prevClose)}</span>
      </div>
      <div class="ci-ohlcv-row">
        <span>Volume</span><span>${STOCK.volume}</span>
      </div>
      <div class="ci-ohlcv-row">
        <span>Vol. moyen</span><span>${STOCK.avgVolume}</span>
      </div>
    </div>
  `;
}

/* ── Minimal SVG icon per asset class ───────────────────────── */
function _buildLogo(STOCK) {
  const isCrypto  = STOCK.sector === 'Crypto Assets';
  const isFutures = ['Equity Index Futures'].includes(STOCK.sector);
  const isForex   = STOCK.sector === 'Foreign Exchange';
  const isMetal   = STOCK.sector === 'Precious Metals';

  if (isCrypto) {
    // Generic crypto hexagon
    return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.8"/>
      <text x="16" y="21" text-anchor="middle" font-size="9" font-family="monospace" fill="currentColor" font-weight="700">${STOCK.sym.slice(0,3)}</text>
    </svg>`;
  }
  if (isFutures) {
    return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <rect x="3" y="3" width="26" height="26" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.6"/>
      <polyline points="6,22 12,14 18,18 26,8" stroke="currentColor" stroke-width="1.5" fill="none"/>
    </svg>`;
  }
  if (isForex) {
    return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <circle cx="16" cy="16" r="13" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.6"/>
      <text x="16" y="21" text-anchor="middle" font-size="13" font-family="monospace" fill="currentColor" font-weight="700">€$</text>
    </svg>`;
  }
  if (isMetal) {
    return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.7"/>
      <circle cx="16" cy="16" r="7" stroke="currentColor" stroke-width="1" fill="none" opacity="0.4"/>
      <text x="16" y="20" text-anchor="middle" font-size="8" font-family="monospace" fill="currentColor" font-weight="700">Au</text>
    </svg>`;
  }
  // Generic equity
  return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
    <rect x="4" y="4" width="24" height="24" rx="2" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.7"/>
    <text x="16" y="21" text-anchor="middle" font-size="9" font-family="monospace" fill="currentColor" font-weight="700">${STOCK.sym.slice(0,4)}</text>
  </svg>`;
}
