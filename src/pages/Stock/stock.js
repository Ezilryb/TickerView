/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Stock Page Orchestrator
   src/pages/Stock/stock.js
   v2 — Dynamic symbol loading via URL param ?sym=
══════════════════════════════════════════════════════════════ */

import { initColorMode }       from '../../utils/colorMode.js';
import { StockChart }          from '../../components/StockChart/stockChart.js';
import { renderCompanyInfo }   from '../../components/CompanyInfo/companyInfo.js';
import { renderFinancials }    from '../../components/Financials/financials.js';
import { renderNews }          from '../../components/NewsPanel/newsPanel.js';
import { initAIAssistant }     from '../../components/AIAssistant/aiAssistant.js';
import {
  getSymbolData,
  buildFinancials,
  buildNews,
  TF_CONFIG,
  generateOHLCV,
} from '../../utils/symbolRegistry.js';

/* ── 1. Resolve symbol from URL ───────────────────────────── */
const urlSym  = new URLSearchParams(window.location.search).get('sym') || 'AAPL';
const STOCK   = getSymbolData(urlSym);

/* ── 2. Patch document title & meta for SEO ───────────────── */
document.title = `${STOCK.sym} — ${STOCK.name} | Analyse Orderflow · TickerView`;
document.querySelector('meta[name="description"]')?.setAttribute(
  'content',
  `Analyse complète de ${STOCK.name} (${STOCK.sym}) : graphique candlestick, volume, Delta orderflow, métriques financières et analyse IA.`
);

/* ── 3. Patch static header labels ───────────────────────── */
const navSymEl   = document.getElementById('nav-sym');
const shSymEl    = document.getElementById('sh-sym');
const shNameEl   = document.getElementById('sh-name');
const shExchEl   = document.getElementById('sh-exchange');
const aiSymLabel = document.getElementById('ai-sym-label');
const aiInput    = document.getElementById('ai-input');

if (navSymEl)   navSymEl.textContent   = STOCK.sym;
if (shSymEl)    shSymEl.textContent    = STOCK.sym;
if (shNameEl)   shNameEl.textContent   = STOCK.name;
if (shExchEl)   shExchEl.textContent   = STOCK.exchange;
if (aiSymLabel) aiSymLabel.textContent = STOCK.sym;
if (aiInput)    aiInput.placeholder    = `Posez une question sur ${STOCK.sym} (configuration, niveaux, volume…)`;

/* Update OHLCV in static header */
const ohlcvEl = document.querySelector('.sh-ohlcv');
if (ohlcvEl) {
  const fmt = v => v > 100
    ? `$${v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${v.toFixed(4)}`;
  ohlcvEl.innerHTML = `
    <span>O <b>${fmt(STOCK.open)}</b></span>
    <span>H <b>${fmt(STOCK.high)}</b></span>
    <span>L <b>${fmt(STOCK.low)}</b></span>
    <span>Clôt.préc. <b>${fmt(STOCK.prevClose)}</b></span>
    <span>VOL <b>${STOCK.volume}</b></span>
  `;
}

/* Set initial live price */
const priceEl   = document.getElementById('live-price');
const changeEl  = document.getElementById('live-change');
const changePEl = document.getElementById('live-changepct');

function patchPriceDisplay(price, diff, pct) {
  const isUp = diff >= 0;
  const fmt  = price > 100
    ? `$${price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${price.toFixed(4)}`;
  if (priceEl)   { priceEl.textContent   = fmt;                                      priceEl.className   = isUp ? 'fire' : 'dn'; }
  if (changeEl)  { changeEl.textContent  = (isUp ? '+' : '') + diff.toFixed(2);      changeEl.className  = isUp ? 'fire' : 'dn'; }
  if (changePEl) { changePEl.textContent = `(${isUp ? '+' : ''}${pct.toFixed(2)}%)`; changePEl.className = isUp ? 'fire' : 'dn'; }
}
patchPriceDisplay(STOCK.price, STOCK.change, STOCK.changePct);

/* ── 4. Theme toggle ──────────────────────────────────────── */
initColorMode(document.getElementById('theme-toggle'));

/* ── 5. Render dynamic components with symbol data ───────── */
renderCompanyInfo(STOCK);
renderFinancials(buildFinancials(STOCK));
renderNews(buildNews(STOCK));

/* ── 6. Stock chart ───────────────────────────────────────── */
const chart = new StockChart('chart-container', STOCK.basePrice, STOCK.tfVol);

document.querySelectorAll('[data-tf]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tf]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    chart.setTimeframe(btn.dataset.tf);
  });
});
document.querySelectorAll('[data-type]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-type]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    chart.setType(btn.dataset.type);
  });
});
document.querySelectorAll('[data-ma]').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    chart.toggleMA(parseInt(btn.dataset.ma));
  });
});

/* ── 7. Live price simulation (volatility-aware) ──────────── */
let livePrice  = STOCK.price;
const tickVol  = STOCK.basePrice > 1000 ? 45 : STOCK.basePrice > 100 ? 0.8 : STOCK.basePrice > 1 ? 0.005 : 0.0002;

setInterval(() => {
  const delta = (Math.random() - 0.48) * tickVol;
  livePrice   = Math.max(STOCK.price * 0.85, Math.min(STOCK.price * 1.15, livePrice + delta));
  const diff  = livePrice - STOCK.prevClose;
  const pct   = (diff / STOCK.prevClose) * 100;
  patchPriceDisplay(livePrice, diff, pct);
}, 2400);

/* ── 8. AI Assistant ──────────────────────────────────────── */
initAIAssistant(STOCK);
