/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Symbol Registry
   src/utils/symbolRegistry.js
   Single source of truth for all instrument metadata.
   Components consume this via getSymbolData(sym).
══════════════════════════════════════════════════════════════ */

/* ── OHLCV Generator (kept here, shared with StockChart) ────── */
export function generateOHLCV(bars, startPrice, volatility) {
  const data = [];
  let close = startPrice;
  const now = Date.now();
  for (let i = bars - 1; i >= 0; i--) {
    const open = close * (1 + (Math.random() - 0.5) * volatility * 0.4);
    const dir  = Math.random() > 0.45 ? 1 : -1;
    close      = open * (1 + dir * Math.random() * volatility);
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
    const low  = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
    const vol  = Math.floor(Math.random() * 8_000_000 + 2_000_000);
    data.push({ t: now - i * 86_400_000, o: open, h: high, l: low, c: close, v: vol });
  }
  return data;
}

export const TF_CONFIG = {
  '1D': { bars: 78,  vol: 0.008  },
  '5D': { bars: 65,  vol: 0.012  },
  '1M': { bars: 90,  vol: 0.018  },
  '3M': { bars: 90,  vol: 0.025  },
  '6M': { bars: 126, vol: 0.030  },
  '1Y': { bars: 52,  vol: 0.040  },
  '5Y': { bars: 60,  vol: 0.065  },
};

/* ── Raw symbol definitions ─────────────────────────────────── */
const REGISTRY = {
  AAPL: {
    sym: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', isin: 'US0378331005',
    sector: 'Technology', industry: 'Consumer Electronics',
    price: 182.52, change: +2.26, changePct: +1.25,
    open: 180.17, high: 183.40, low: 179.82, prevClose: 180.26,
    volume: '64.2M', avgVolume: '58.1M', marketCap: '2.81T',
    pe: 28.4, fwdPe: 26.1, eps: 6.42, pbRatio: 45.2, psRatio: 7.2,
    dividend: 0.92, divYield: '0.50%', beta: 1.28,
    week52High: 199.62, week52Low: 143.90,
    revenue: '394.3B', netIncome: '97.0B', grossMargin: '45.6%',
    employees: '161 000', founded: 1976, ceo: 'Tim Cook', hq: 'Cupertino, CA — États-Unis',
    description: 'Apple Inc. conçoit, fabrique et commercialise des smartphones, ordinateurs personnels, tablettes, wearables et accessoires. Ses services incluent l\'App Store, Apple Music, iCloud, Apple TV+ et Apple Pay. Fondée en 1976, Apple est la première capitalisation boursière mondiale.',
    basePrice: 182, tfVol: 0.025,
  },
  MSFT: {
    sym: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', isin: 'US5949181045',
    sector: 'Technology', industry: 'Software Infrastructure',
    price: 415.30, change: +3.80, changePct: +0.92,
    open: 411.50, high: 417.80, low: 410.20, prevClose: 411.50,
    volume: '22.4M', avgVolume: '20.1M', marketCap: '3.09T',
    pe: 35.2, fwdPe: 31.0, eps: 11.80, pbRatio: 14.2, psRatio: 12.8,
    dividend: 3.00, divYield: '0.72%', beta: 0.90,
    week52High: 430.82, week52Low: 309.45,
    revenue: '245.1B', netIncome: '88.1B', grossMargin: '69.4%',
    employees: '228 000', founded: 1975, ceo: 'Satya Nadella', hq: 'Redmond, WA — États-Unis',
    description: 'Microsoft Corporation développe, fabrique et commercialise des logiciels, services cloud (Azure), appareils et solutions pour entreprises. Copilot AI, Office 365, Teams et Xbox figurent parmi ses franchises mondiales. Deuxième capitalisation mondiale.',
    basePrice: 415, tfVol: 0.022,
  },
  GOOGL: {
    sym: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', isin: 'US02079K3059',
    sector: 'Communication Services', industry: 'Internet & Media',
    price: 172.20, change: +1.45, changePct: +0.85,
    open: 170.75, high: 173.60, low: 170.10, prevClose: 170.75,
    volume: '18.6M', avgVolume: '17.2M', marketCap: '2.13T',
    pe: 24.1, fwdPe: 21.5, eps: 7.14, pbRatio: 6.8, psRatio: 5.9,
    dividend: 0, divYield: '—', beta: 1.06,
    week52High: 191.75, week52Low: 120.21,
    revenue: '350.0B', netIncome: '73.8B', grossMargin: '56.5%',
    employees: '182 000', founded: 1998, ceo: 'Sundar Pichai', hq: 'Mountain View, CA — États-Unis',
    description: 'Alphabet Inc. est la holding de Google, leader mondial de la recherche en ligne, de la publicité numérique, du cloud computing et de l\'IA (Gemini). YouTube, Android, Google Cloud et Waymo font partie de son écosystème.',
    basePrice: 172, tfVol: 0.026,
  },
  AMZN: {
    sym: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', isin: 'US0231351067',
    sector: 'Consumer Cyclical', industry: 'E-Commerce & Cloud',
    price: 188.40, change: +2.10, changePct: +1.13,
    open: 186.30, high: 189.90, low: 185.80, prevClose: 186.30,
    volume: '32.1M', avgVolume: '29.4M', marketCap: '1.98T',
    pe: 44.2, fwdPe: 38.0, eps: 4.26, pbRatio: 9.1, psRatio: 3.2,
    dividend: 0, divYield: '—', beta: 1.15,
    week52High: 201.20, week52Low: 118.35,
    revenue: '638.0B', netIncome: '30.4B', grossMargin: '48.2%',
    employees: '1 525 000', founded: 1994, ceo: 'Andy Jassy', hq: 'Seattle, WA — États-Unis',
    description: 'Amazon.com est le leader mondial du commerce électronique et du cloud computing (AWS, 32% de part de marché). Prime, Alexa, Kindle et Amazon Ads complètent un écosystème consumer et B2B sans équivalent.',
    basePrice: 188, tfVol: 0.030,
  },
  NVDA: {
    sym: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', isin: 'US67066G1040',
    sector: 'Technology', industry: 'Semiconductors',
    price: 875.40, change: +18.60, changePct: +2.17,
    open: 856.80, high: 882.10, low: 853.20, prevClose: 856.80,
    volume: '42.8M', avgVolume: '38.5M', marketCap: '2.16T',
    pe: 68.4, fwdPe: 38.2, eps: 12.80, pbRatio: 44.2, psRatio: 24.6,
    dividend: 0.16, divYield: '0.02%', beta: 1.68,
    week52High: 974.00, week52Low: 373.86,
    revenue: '79.8B', netIncome: '29.8B', grossMargin: '72.7%',
    employees: '32 000', founded: 1993, ceo: 'Jensen Huang', hq: 'Santa Clara, CA — États-Unis',
    description: 'NVIDIA conçoit des GPU et des systèmes d\'IA (H100, Blackwell) qui alimentent les data centers, le gaming, la robotique et les véhicules autonomes. Leader incontesté de l\'infrastructure IA, la société est au cœur de la révolution du deep learning.',
    basePrice: 875, tfVol: 0.042,
  },
  META: {
    sym: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', isin: 'US30303M1027',
    sector: 'Communication Services', industry: 'Social Media & VR',
    price: 512.30, change: +6.40, changePct: +1.27,
    open: 505.90, high: 515.60, low: 504.20, prevClose: 505.90,
    volume: '15.2M', avgVolume: '13.8M', marketCap: '1.31T',
    pe: 26.8, fwdPe: 22.4, eps: 19.11, pbRatio: 8.4, psRatio: 9.2,
    dividend: 0, divYield: '—', beta: 1.24,
    week52High: 531.49, week52Low: 279.40,
    revenue: '160.9B', netIncome: '46.2B', grossMargin: '81.8%',
    employees: '71 000', founded: 2004, ceo: 'Mark Zuckerberg', hq: 'Menlo Park, CA — États-Unis',
    description: 'Meta Platforms exploite Facebook, Instagram, WhatsApp et Threads — touchant plus de 3,2 milliards d\'utilisateurs quotidiens. L\'entreprise investit massivement dans la réalité augmentée (Ray-Ban, Quest) et l\'IA générative (Llama).',
    basePrice: 512, tfVol: 0.028,
  },
  TSLA: {
    sym: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', isin: 'US88160R1014',
    sector: 'Consumer Cyclical', industry: 'Electric Vehicles',
    price: 248.60, change: -4.20, changePct: -1.66,
    open: 252.80, high: 254.10, low: 246.40, prevClose: 252.80,
    volume: '88.4M', avgVolume: '92.1M', marketCap: '792.1B',
    pe: 55.2, fwdPe: 42.0, eps: 4.50, pbRatio: 12.8, psRatio: 8.2,
    dividend: 0, divYield: '—', beta: 2.06,
    week52High: 299.29, week52Low: 138.80,
    revenue: '97.7B', netIncome: '7.9B', grossMargin: '17.9%',
    employees: '140 000', founded: 2003, ceo: 'Elon Musk', hq: 'Austin, TX — États-Unis',
    description: 'Tesla conçoit et produit des véhicules électriques (Model S/3/X/Y/Cybertruck), des solutions de stockage d\'énergie (Powerwall, Megapack) et développe le logiciel Full Self-Driving. Réseau Supercharger : 55 000+ stations mondiales.',
    basePrice: 248, tfVol: 0.048,
  },
  JPM: {
    sym: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE', isin: 'US46625H1005',
    sector: 'Financial Services', industry: 'Banking',
    price: 204.80, change: +1.20, changePct: +0.59,
    open: 203.60, high: 206.10, low: 203.10, prevClose: 203.60,
    volume: '8.4M', avgVolume: '7.9M', marketCap: '592.4B',
    pe: 12.4, fwdPe: 11.8, eps: 16.52, pbRatio: 1.98, psRatio: 3.8,
    dividend: 4.60, divYield: '2.25%', beta: 1.08,
    week52High: 220.82, week52Low: 135.19,
    revenue: '162.4B', netIncome: '49.6B', grossMargin: '—',
    employees: '313 000', founded: 1799, ceo: 'Jamie Dimon', hq: 'New York, NY — États-Unis',
    description: 'JPMorgan Chase est la plus grande banque américaine par actifs totaux (3 900 milliards $). Banque d\'investissement, gestion de patrimoine, retail banking et marchés de capitaux — un acteur systémique mondial.',
    basePrice: 204, tfVol: 0.018,
  },
  'BRK.B': {
    sym: 'BRK.B', name: 'Berkshire Hathaway B', exchange: 'NYSE', isin: 'US0846707026',
    sector: 'Financial Services', industry: 'Conglomerate',
    price: 408.40, change: +0.80, changePct: +0.20,
    open: 407.60, high: 410.20, low: 406.80, prevClose: 407.60,
    volume: '3.2M', avgVolume: '3.0M', marketCap: '892.1B',
    pe: 9.8, fwdPe: 10.2, eps: 41.67, pbRatio: 1.52, psRatio: 2.4,
    dividend: 0, divYield: '—', beta: 0.88,
    week52High: 421.04, week52Low: 312.78,
    revenue: '364.5B', netIncome: '96.2B', grossMargin: '—',
    employees: '396 500', founded: 1839, ceo: 'Warren Buffett', hq: 'Omaha, NE — États-Unis',
    description: 'Berkshire Hathaway est le conglomérat de Warren Buffett. Ses participations incluent BNSF Railway, Geico, See\'s Candies, et des positions significatives dans Apple, Bank of America, Coca-Cola et American Express.',
    basePrice: 408, tfVol: 0.014,
  },
  V: {
    sym: 'V', name: 'Visa Inc.', exchange: 'NYSE', isin: 'US92826C8394',
    sector: 'Financial Services', industry: 'Payment Processing',
    price: 274.60, change: +2.40, changePct: +0.88,
    open: 272.20, high: 275.80, low: 271.60, prevClose: 272.20,
    volume: '6.1M', avgVolume: '5.8M', marketCap: '562.8B',
    pe: 30.4, fwdPe: 26.8, eps: 9.03, pbRatio: 14.2, psRatio: 15.8,
    dividend: 2.08, divYield: '0.76%', beta: 0.96,
    week52High: 290.96, week52Low: 227.10,
    revenue: '35.9B', netIncome: '17.3B', grossMargin: '79.8%',
    employees: '31 000', founded: 1958, ceo: 'Ryan McInerney', hq: 'Foster City, CA — États-Unis',
    description: 'Visa exploite le plus grand réseau mondial de paiements électroniques, traitant plus de 230 milliards de transactions par an dans plus de 200 pays. Asset-light et hautement profitables, ses revenus croissent avec le volume de consommation mondiale.',
    basePrice: 274, tfVol: 0.016,
  },
  BTC: {
    sym: 'BTC', name: 'Bitcoin', exchange: 'BINANCE', isin: '—',
    sector: 'Crypto Assets', industry: 'Proof of Work',
    price: 67842.50, change: +1442.20, changePct: +2.17,
    open: 66400.30, high: 68920.00, low: 65800.10, prevClose: 66400.30,
    volume: '48.2B', avgVolume: '42.6B', marketCap: '1.33T',
    pe: '—', fwdPe: '—', eps: '—', pbRatio: '—', psRatio: '—',
    dividend: 0, divYield: '—', beta: 1.82,
    week52High: 73_750.00, week52Low: 38_505.00,
    revenue: '—', netIncome: '—', grossMargin: '—',
    employees: '—', founded: 2009, ceo: 'Satoshi Nakamoto', hq: 'Décentralisé',
    description: 'Bitcoin (BTC) est la première cryptomonnaie décentralisée, créée en 2009. Réseau Proof-of-Work sécurisé par 600+ EH/s de hashrate. Halving d\'avril 2024 réduit l\'émission à 3,125 BTC/bloc. Adoption institutionnelle via les ETF spot aux États-Unis.',
    basePrice: 67842, tfVol: 0.048,
  },
  ETH: {
    sym: 'ETH', name: 'Ethereum', exchange: 'BINANCE', isin: '—',
    sector: 'Crypto Assets', industry: 'Proof of Stake / Smart Contracts',
    price: 3541.20, change: -31.20, changePct: -0.87,
    open: 3572.40, high: 3620.00, low: 3490.50, prevClose: 3572.40,
    volume: '18.6B', avgVolume: '16.2B', marketCap: '425B',
    pe: '—', fwdPe: '—', eps: '—', pbRatio: '—', psRatio: '—',
    dividend: 0, divYield: '~4.2% staking', beta: 1.54,
    week52High: 4_093.00, week52Low: 1_811.00,
    revenue: '—', netIncome: '—', grossMargin: '—',
    employees: '—', founded: 2015, ceo: 'Vitalik Buterin', hq: 'Décentralisé',
    description: 'Ethereum est la plateforme de smart contracts la plus utilisée au monde. Layer 2 (Arbitrum, Base, Optimism) absorbent la majorité du volume DeFi. Passage au Proof-of-Stake (The Merge, 2022) a réduit la consommation énergétique de 99,95%.',
    basePrice: 3541, tfVol: 0.040,
  },
  SOL: {
    sym: 'SOL', name: 'Solana', exchange: 'BINANCE', isin: '—',
    sector: 'Crypto Assets', industry: 'Proof of History / High-TPS',
    price: 172.40, change: +8.72, changePct: +5.32,
    open: 163.68, high: 175.90, low: 162.40, prevClose: 163.68,
    volume: '4.8B', avgVolume: '4.1B', marketCap: '78B',
    pe: '—', fwdPe: '—', eps: '—', pbRatio: '—', psRatio: '—',
    dividend: 0, divYield: '~7.1% staking', beta: 2.14,
    week52High: 210.00, week52Low: 56.00,
    revenue: '—', netIncome: '—', grossMargin: '—',
    employees: '—', founded: 2020, ceo: 'Anatoly Yakovenko', hq: 'Décentralisé',
    description: 'Solana est une blockchain haute performance (65 000+ TPS théoriques, <400ms de finalité) utilisant le consensus Proof-of-History. Dominant sur le segment des memecoins, NFT et DePIN. Candidat ETF spot aux États-Unis en 2025.',
    basePrice: 172, tfVol: 0.060,
  },
  'NQ1!': {
    sym: 'NQ1!', name: 'Nasdaq-100 Futures', exchange: 'CME', isin: '—',
    sector: 'Equity Index Futures', industry: 'CME Group',
    price: 19248.50, change: -124.50, changePct: -0.64,
    open: 19373.00, high: 19420.00, low: 19180.00, prevClose: 19373.00,
    volume: '312B', avgVolume: '298B', marketCap: '—',
    pe: '—', fwdPe: '—', eps: '—', pbRatio: '—', psRatio: '—',
    dividend: 0, divYield: '—', beta: '—',
    week52High: 21_665.00, week52Low: 14_058.00,
    revenue: '—', netIncome: '—', grossMargin: '—',
    employees: '—', founded: 1996, ceo: '—', hq: 'CME — Chicago, IL',
    description: 'Le contrat à terme Nasdaq-100 (NQ) suit les 100 plus grandes capitalisations non-financières du Nasdaq. Chaque point vaut 20$ par contrat (100$ pour le micro MNQ). Instrument de référence pour les scalpers sur indices US.',
    basePrice: 19248, tfVol: 0.020,
  },
  'ES1!': {
    sym: 'ES1!', name: 'S&P 500 Futures', exchange: 'CME', isin: '—',
    sector: 'Equity Index Futures', industry: 'CME Group',
    price: 5204.25, change: +19.75, changePct: +0.38,
    open: 5184.50, high: 5218.00, low: 5178.00, prevClose: 5184.50,
    volume: '280B', avgVolume: '265B', marketCap: '—',
    pe: '—', fwdPe: '—', eps: '—', pbRatio: '—', psRatio: '—',
    dividend: 0, divYield: '—', beta: '—',
    week52High: 5_878.00, week52Low: 4_103.00,
    revenue: '—', netIncome: '—', grossMargin: '—',
    employees: '—', founded: 1982, ceo: '—', hq: 'CME — Chicago, IL',
    description: 'Le contrat à terme S&P 500 (ES) est le futures sur indice le plus liquide au monde, représentant les 500 plus grandes capitalisations américaines. Valeur du point : 50$ par contrat (5$ pour le micro MES).',
    basePrice: 5204, tfVol: 0.016,
  },
  XAUUSD: {
    sym: 'XAUUSD', name: 'Gold Spot', exchange: 'LBMA', isin: '—',
    sector: 'Precious Metals', industry: 'Commodities',
    price: 2312.40, change: +9.80, changePct: +0.42,
    open: 2302.60, high: 2325.80, low: 2298.40, prevClose: 2302.60,
    volume: '182B', avgVolume: '168B', marketCap: '—',
    pe: '—', fwdPe: '—', eps: '—', pbRatio: '—', psRatio: '—',
    dividend: 0, divYield: '—', beta: '-0.12',
    week52High: 2_449.00, week52Low: 1_810.00,
    revenue: '—', netIncome: '—', grossMargin: '—',
    employees: '—', founded: '—', ceo: '—', hq: 'Londres — LBMA',
    description: 'L\'or spot (XAU/USD) est la référence internationale pour le métal précieux, coté en dollars par once troy (31,1g). Actif refuge par excellence, il évolue en corrélation inverse avec le dollar et les taux réels US. Volume journalier LBMA : ~180 milliards $.',
    basePrice: 2312, tfVol: 0.012,
  },
  'EUR/USD': {
    sym: 'EUR/USD', name: 'Euro / Dollar', exchange: 'FOREX', isin: '—',
    sector: 'Foreign Exchange', industry: 'Major Pair',
    price: 1.0842, change: +0.0019, changePct: +0.18,
    open: 1.0823, high: 1.0868, low: 1.0818, prevClose: 1.0823,
    volume: '6.4T', avgVolume: '6.1T', marketCap: '—',
    pe: '—', fwdPe: '—', eps: '—', pbRatio: '—', psRatio: '—',
    dividend: 0, divYield: '—', beta: '—',
    week52High: 1.1140, week52Low: 1.0448,
    revenue: '—', netIncome: '—', grossMargin: '—',
    employees: '—', founded: '—', ceo: '—', hq: 'Zone Euro — BCE',
    description: 'EUR/USD est la paire de devises la plus tradée au monde, représentant ~28% du volume quotidien du marché Forex (~6 400 milliards $). Elle reflète le rapport de force entre la politique monétaire de la BCE et de la Fed américaine.',
    basePrice: 1.0842, tfVol: 0.006,
  },
};

/* ── Public API ─────────────────────────────────────────────── */

/**
 * Returns enriched stock data for a given symbol.
 * Falls back to AAPL if the symbol is not found.
 */
export function getSymbolData(sym = 'AAPL') {
  return REGISTRY[sym] || REGISTRY['AAPL'];
}

/**
 * Returns key financial metrics formatted for the Financials component.
 */
export function buildFinancials(data) {
  const isCrypto  = data.sector === 'Crypto Assets';
  const isFutures = ['Equity Index Futures', 'Foreign Exchange', 'Precious Metals'].includes(data.sector);

  if (isCrypto || isFutures) {
    return [
      { label: 'Prix actuel',    value: data.price > 100 ? `$${Math.round(data.price).toLocaleString('fr-FR')}` : `$${data.price.toFixed(4)}`, sub: `${data.exchange} · Spot`,       fire: true  },
      { label: 'Variation 24h', value: `${data.changePct > 0 ? '+' : ''}${data.changePct.toFixed(2)}%`,                                       sub: 'Variation journalière',           fire: data.changePct >= 0 },
      { label: 'Volume 24h',    value: data.volume,                                                                                             sub: 'Volume de marché',               fire: false },
      { label: 'Market Cap',    value: data.marketCap !== '—' ? data.marketCap : '—',                                                          sub: 'Capitalisation',                  fire: true  },
      { label: '52W High',      value: data.week52High > 100 ? `$${Math.round(data.week52High).toLocaleString('fr-FR')}` : `$${data.week52High.toFixed(4)}`, sub: 'Plus haut 52 semaines', fire: true  },
      { label: '52W Low',       value: data.week52Low  > 100 ? `$${Math.round(data.week52Low).toLocaleString('fr-FR')}`  : `$${data.week52Low.toFixed(4)}`,  sub: 'Plus bas 52 semaines',  fire: false },
      { label: 'Beta',          value: String(data.beta),                                                                                       sub: 'Volatilité relative',            fire: false },
      { label: 'Ouverture',     value: data.open > 100 ? `$${data.open.toLocaleString('fr-FR')}` : `$${data.open.toFixed(4)}`,                 sub: 'Prix d\'ouverture',              fire: false },
      { label: 'Haut du jour',  value: data.high > 100 ? `$${data.high.toLocaleString('fr-FR')}` : `$${data.high.toFixed(4)}`,                 sub: 'High journalier',                fire: true  },
      { label: 'Bas du jour',   value: data.low  > 100 ? `$${data.low.toLocaleString('fr-FR')}`  : `$${data.low.toFixed(4)}`,                  sub: 'Low journalier',                 fire: false },
      { label: 'Div. Yield',    value: data.divYield,                                                                                           sub: 'Rendement ou staking',           fire: false },
      { label: 'Exchange',      value: data.exchange,                                                                                           sub: 'Marché de cotation',             fire: false },
    ];
  }

  // Equity (actions)
  return [
    { label: 'Market Cap',     value: `$${data.marketCap}`,                                                               sub: 'Capitalisation boursière',       fire: true  },
    { label: 'P/E Ratio',      value: `${data.pe}×`,                                                                      sub: 'Price / Earnings (TTM)',         fire: false },
    { label: 'P/E Fwd',        value: `${data.fwdPe}×`,                                                                   sub: `Forward P/E`,                    fire: false },
    { label: 'EPS',            value: `$${data.eps}`,                                                                     sub: 'Bénéfice par action (TTM)',       fire: true  },
    { label: 'Revenue',        value: `$${data.revenue}`,                                                                 sub: 'Chiffre d\'affaires TTM',        fire: false },
    { label: 'Net Income',     value: `$${data.netIncome}`,                                                               sub: 'Résultat net (TTM)',             fire: false },
    { label: 'Gross Margin',   value: data.grossMargin,                                                                   sub: 'Marge brute',                    fire: true  },
    { label: 'Dividend Yield', value: data.divYield,                                                                      sub: 'Rendement dividende',            fire: false },
    { label: 'Beta',           value: String(data.beta),                                                                  sub: 'Volatilité vs marché',           fire: false },
    { label: '52W High',       value: `$${data.week52High.toFixed(2)}`,                                                   sub: 'Plus haut sur 52 semaines',      fire: true  },
    { label: '52W Low',        value: `$${data.week52Low.toFixed(2)}`,                                                    sub: 'Plus bas sur 52 semaines',       fire: false },
    { label: 'Avg Volume',     value: data.avgVolume,                                                                     sub: 'Volume moyen 30 jours',          fire: false },
  ];
}

/**
 * Returns contextual news items for a given symbol.
 * In production: replace with a real news API feed.
 */
export function buildNews(data) {
  const sym  = data.sym;
  const name = data.name;
  const isCrypto = data.sector === 'Crypto Assets';

  if (isCrypto) {
    return [
      { source: 'CoinDesk', time: 'Il y a 8 min',  sentiment: 'positive', tag: 'Marché',   title: `${sym} dépasse un niveau clé — les bulls reprennent le contrôle`, summary: `Le momentum orderflow s\'inverse avec un delta cumulatif positif et des imbalances acheteuses marquées aux niveaux de support.` },
      { source: 'Bloomberg', time: 'Il y a 45 min', sentiment: 'positive', tag: 'Institutionnel', title: `Flux entrants massifs sur les ETF ${sym === 'BTC' ? 'Bitcoin' : sym} cette semaine`, summary: `Les ETF spot enregistrent des entrées nettes records, signalant un appétit institutionnel soutenu.` },
      { source: 'The Block', time: 'Il y a 2h',     sentiment: 'neutral',  tag: 'Analyse',  title: `${sym} : le Volume Profile VRVP identifie une Value Area entre ${(data.low * 0.98).toFixed(0)} et ${(data.high * 1.01).toFixed(0)}`, summary: `La distribution du volume sur la session révèle un POC central et peu de Low Volume Nodes en dessous du support immédiat.` },
      { source: 'Reuters',  time: 'Il y a 4h',      sentiment: 'negative', tag: 'Régulation', title: `SEC examine les pratiques de listing de ${name} sur les exchanges centralisés`, summary: `Une nouvelle enquête réglementaire maintient une pression de court terme sur le sentiment du marché.` },
    ];
  }

  const isFutures = ['Equity Index Futures', 'Foreign Exchange', 'Precious Metals'].includes(data.sector);
  if (isFutures) {
    return [
      { source: 'Reuters',   time: 'Il y a 15 min', sentiment: data.changePct >= 0 ? 'positive' : 'negative', tag: 'Flux',     title: `${sym} : le delta orderflow favorise les ${data.changePct >= 0 ? 'bulls' : 'bears'} en début de session`, summary: `Le CVD cumulatif diverge du prix, signalant une absorption institutionnelle aux niveaux extrêmes.` },
      { source: 'Bloomberg', time: 'Il y a 1h',      sentiment: 'neutral',  tag: 'Macro',    title: `Données macro US influencent ${name} — volatilité attendue à 14h30 CET`, summary: `Les chiffres d\'emploi et d\'inflation seront les catalyseurs clés de la session. Positionnement défensif des teneurs de marché.` },
      { source: 'FT',        time: 'Il y a 3h',      sentiment: 'positive', tag: 'Analyse',  title: `${sym} : POC journalier à ${data.open.toLocaleString('fr-FR')} — niveau institutionnel à surveiller`, summary: `La Value Area de la session précédente agit comme zone d\'équilibre. Rupture décisive nécessaire pour confirmer la direction.` },
      { source: 'CNBC',      time: 'Il y a 6h',      sentiment: 'neutral',  tag: 'Positionnement', title: `Rapport COT : repositionnement des non-commerciaux sur ${sym}`, summary: `Le dernier rapport de positions révèle une réduction des longs spéculatifs, potentiel signal de retournement à moyen terme.` },
    ];
  }

  // Equity
  return [
    { source: 'Bloomberg', time: 'Il y a 12 min', sentiment: 'positive', tag: 'Résultats', title: `${name} publie des résultats supérieurs aux attentes — EPS à $${data.eps}`, summary: `La croissance des revenus de ${name} surprend les analystes, portée par la demande internationale et l\'expansion des marges.` },
    { source: 'Reuters',   time: 'Il y a 1h',     sentiment: 'neutral',  tag: 'Stratégie', title: `${name} — nouvelle roadmap produit dévoilée pour ${new Date().getFullYear() + 1}`, summary: `Le management confirme ses priorités d\'investissement dans l\'IA et les nouvelles lignes de revenus services.` },
    { source: 'CNBC',      time: 'Il y a 3h',     sentiment: 'positive', tag: 'Analyste',  title: `Goldman Sachs relève son objectif de cours sur ${sym} — upside potentiel de 12%`, summary: `L\'analyse se base sur l\'accélération prévue des revenus récurrents et la montée en charge du segment IA.` },
    { source: 'FT',        time: 'Il y a 5h',     sentiment: 'negative', tag: 'Régulation', title: `Enquête réglementaire sur les pratiques de ${name} — impact limité attendu`, summary: `Les régulateurs examinent les pratiques tarifaires. Les analystes estiment l\'impact financier négligeable à court terme.` },
  ];
}

/** Sorted list for the search dropdown */
export const SYMBOL_LIST = Object.values(REGISTRY).map(s => ({
  sym:      s.sym,
  name:     s.name,
  exchange: s.exchange,
  sector:   s.sector,
}));
