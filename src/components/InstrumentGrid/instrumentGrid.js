/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Instrument Grid Component
   src/components/InstrumentGrid/instrumentGrid.js
══════════════════════════════════════════════════════════════ */

import { TICKERS, rndSeries, buildSparkSVG } from '../../utils/marketData.js';

export function renderInstruments(){
  const grid = document.getElementById('instruments-grid');
  if(!grid) return;

  const SERIES = TICKERS.map(t => rndSeries(32, t.price, 0.022));

  TICKERS.forEach((t, i) => {
    const isUp = t.change >= 0;
    const series = SERIES[i];
    const card = document.createElement('div');
    card.className = 'inst-card reveal';
    card.style.transitionDelay = (i * 0.065) + 's';

    // Format price based on magnitude
    const fmt = t.price > 100
      ? t.price.toLocaleString('fr-FR', { minimumFractionDigits:2, maximumFractionDigits:2 })
      : t.price.toLocaleString('fr-FR', { minimumFractionDigits:4, maximumFractionDigits:4 });

    card.innerHTML = `
      <div class="ic-header">
        <div>
          <div class="ic-sym">${t.sym}</div>
          <div class="ic-name">${t.name}</div>
          <div class="ic-type">${t.type} · ${t.exchange}</div>
        </div>
        <div class="ic-badge ${isUp?'up':'dn'}">${isUp?'+':''}${t.change.toFixed(2)}%</div>
      </div>
      <div class="ic-price">${t.price > 100 ? '$' : ''}${fmt}</div>
      <div class="ic-price-label">${t.exchange} · Temps réel</div>
      ${buildSparkSVG(series, isUp)}
      <div class="ic-meta">
        <span>VOL ${t.vol}</span>
        <span>${t.cap !== '—' ? 'MCap ' + t.cap : t.type}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}
