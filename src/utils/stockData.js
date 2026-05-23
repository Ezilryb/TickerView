/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Stock Data
   src/utils/stockData.js
   Mock data + OHLCV generator for the Stock Analysis page
══════════════════════════════════════════════════════════════ */

export const STOCK = {
  sym:        'AAPL',
  name:       'Apple Inc.',
  sector:     'Technology',
  industry:   'Consumer Electronics',
  exchange:   'NASDAQ',
  isin:       'US0378331005',
  price:      182.52,
  change:     +2.26,
  changePct:  +1.25,
  open:       180.17,
  high:       183.40,
  low:        179.82,
  prevClose:  180.26,
  volume:     '64.2M',
  avgVolume:  '58.1M',
  marketCap:  '2.81T',
  pe:         28.4,
  fwdPe:      26.1,
  eps:        6.42,
  pbRatio:    45.2,
  psRatio:    7.2,
  dividend:   0.92,
  divYield:   '0.50%',
  beta:       1.28,
  week52High: 199.62,
  week52Low:  143.90,
  revenue:    '394.3B',
  netIncome:  '97.0B',
  grossMargin:'45.6%',
  employees:  '161 000',
  description:'Apple Inc. conçoit, fabrique et commercialise des smartphones, ordinateurs personnels, tablettes, wearables et accessoires. Ses services incluent l\'App Store, Apple Music, iCloud, Apple TV+ et Apple Pay. Fondée en 1976, Apple est la première capitalisation boursière mondiale.',
  founded:    1976,
  ceo:        'Tim Cook',
  hq:         'Cupertino, CA — États-Unis',
};

export const FINANCIALS = [
  { label:'Market Cap',     value:'$2.81T',   sub:'Capitalisation boursière',  fire:true  },
  { label:'P/E Ratio',      value:'28.4×',    sub:'Price / Earnings (TTM)',     fire:false },
  { label:'P/E Fwd',        value:'26.1×',    sub:'Forward P/E (FY2025)',       fire:false },
  { label:'EPS',            value:'$6.42',    sub:'Bénéfice par action (TTM)',  fire:true  },
  { label:'Revenue',        value:'$394B',    sub:'Chiffre d\'affaires TTM',    fire:false },
  { label:'Net Income',     value:'$97.0B',   sub:'Résultat net (TTM)',         fire:false },
  { label:'Gross Margin',   value:'45.6%',    sub:'Marge brute',               fire:true  },
  { label:'Dividend Yield', value:'0.50%',    sub:'Rendement dividende',        fire:false },
  { label:'Beta',           value:'1.28',     sub:'Volatilité vs marché',       fire:false },
  { label:'52W High',       value:'$199.62',  sub:'Plus haut sur 52 semaines',  fire:true  },
  { label:'52W Low',        value:'$143.90',  sub:'Plus bas sur 52 semaines',   fire:false },
  { label:'Avg Volume',     value:'58.1M',    sub:'Volume moyen 30 jours',      fire:false },
];

export const NEWS = [
  {
    source: 'Bloomberg',
    time:   'Il y a 12 min',
    sentiment: 'positive',
    title:  'Apple dépasse les attentes au T2 avec des ventes d\'iPhone en hausse de 8%',
    summary:'Les résultats trimestriels d\'Apple ont surpris Wall Street, porté par une demande solide en Asie et l\'adoption des services.',
    tag:    'Résultats',
  },
  {
    source: 'Reuters',
    time:   'Il y a 1h',
    sentiment: 'neutral',
    title:  'Apple Vision Pro — Tim Cook confirme la roadmap produit pour 2025',
    summary:'Le CEO d\'Apple a réaffirmé l\'engagement de la société envers les ordinateurs spatiaux lors de la conférence annuelle.',
    tag:    'Produit',
  },
  {
    source: 'CNBC',
    time:   'Il y a 3h',
    sentiment: 'positive',
    title:  'Goldman Sachs relève son objectif de cours sur AAPL à $215',
    summary:'L\'analyse se base sur l\'accélération prévue des revenus services et la montée en charge de l\'IA générative dans l\'écosystème Apple.',
    tag:    'Analyste',
  },
  {
    source: 'FT',
    time:   'Il y a 5h',
    sentiment: 'negative',
    title:  'Régulateurs UE ouvrent une enquête sur l\'App Store — Apple conteste',
    summary:'La Commission européenne examine les pratiques tarifaires d\'Apple en matière de commission sur les achats in-app.',
    tag:    'Régulation',
  },
];

/* ── OHLCV Generator ─────────────────────────────────────── */
export function generateOHLCV(bars, startPrice, volatility){
  const data = [];
  let close = startPrice;
  const now = Date.now();
  const intervalMs = { '1D':5*60*1000, '5D':30*60*1000, '1M':4*60*60*1000, '3M':24*60*60*1000, '6M':24*60*60*1000, '1Y':7*24*60*60*1000, '5Y':30*24*60*60*1000 };

  for(let i = bars - 1; i >= 0; i--){
    const open  = close * (1 + (Math.random() - 0.5) * volatility * 0.4);
    const dir   = Math.random() > 0.45 ? 1 : -1;
    const move  = Math.random() * volatility;
    close       = open * (1 + dir * move);
    const high  = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
    const low   = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
    const vol   = Math.floor(Math.random() * 8_000_000 + 2_000_000);
    data.push({ t: now - i * (intervalMs['1D'] || 300_000), o: open, h: high, l: low, c: close, v: vol });
  }
  return data;
}

export const TF_CONFIG = {
  '1D':  { bars:78,  vol:0.008,  label:'5m intervals' },
  '5D':  { bars:65,  vol:0.012,  label:'30m intervals' },
  '1M':  { bars:90,  vol:0.018,  label:'4h intervals' },
  '3M':  { bars:90,  vol:0.025,  label:'Daily' },
  '6M':  { bars:126, vol:0.030,  label:'Daily' },
  '1Y':  { bars:52,  vol:0.040,  label:'Weekly' },
  '5Y':  { bars:60,  vol:0.065,  label:'Monthly' },
};
