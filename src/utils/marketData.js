/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Market Data
   src/utils/marketData.js
   Expanded: Crypto, Forex, Futures, Indices, Metals
══════════════════════════════════════════════════════════════ */
export const TICKERS = [
  // Crypto Futures
  { sym:'BTC',   name:'Bitcoin',         type:'CRYPTO FUTURES', price:67842.50, change:+2.14, vol:'48.2B', cap:'1.33T',  exchange:'Binance' },
  { sym:'ETH',   name:'Ethereum',        type:'CRYPTO FUTURES', price:3541.20,  change:-0.87, vol:'18.6B', cap:'425B',   exchange:'Binance' },
  { sym:'SOL',   name:'Solana',          type:'CRYPTO FUTURES', price:172.40,   change:+5.32, vol:'4.8B',  cap:'78B',    exchange:'Binance' },
  // Forex
  { sym:'EUR/USD', name:'Euro / Dollar', type:'FOREX',          price:1.0842,   change:+0.18, vol:'6.4T',  cap:'—',      exchange:'FXCM' },
  // Futures / Indices
  { sym:'NQ1!',  name:'Nasdaq-100 Fut.', type:'FUTURES CME',    price:19248.50, change:-0.64, vol:'312B',  cap:'—',      exchange:'CME' },
  // Metals
  { sym:'XAUUSD',name:'Gold Spot',       type:'METALS',         price:2312.40,  change:+0.42, vol:'182B',  cap:'—',      exchange:'LBMA' },
];

// Tape items (richer, shows more asset diversity)
export const TAPE_ITEMS = [
  { sym:'BTC/USDT',  price:67842.50, change:+2.14 },
  { sym:'ETH/USDT',  price:3541.20,  change:-0.87 },
  { sym:'EUR/USD',   price:1.0842,   change:+0.18 },
  { sym:'SOL/USDT',  price:172.40,   change:+5.32 },
  { sym:'NQ1!',      price:19248.50, change:-0.64 },
  { sym:'XAUUSD',    price:2312.40,  change:+0.42 },
  { sym:'BNB/USDT',  price:598.10,   change:+1.05 },
  { sym:'AVAX/USDT', price:38.92,    change:-2.14 },
  { sym:'DXY',       price:104.22,   change:-0.12 },
  { sym:'ES1!',      price:5204.25,  change:+0.38 },
];

export function rndSeries(len, start, vol){
  const arr = [start];
  for(let i=1;i<len;i++){
    arr.push(arr[i-1]*(1+(Math.random()-0.49)*vol));
  }
  return arr;
}

export function buildSparkSVG(data, isUp){
  const W=220, H=60;
  const min=Math.min(...data), max=Math.max(...data);
  const range=max-min||1;
  const pts = data.map((v,i)=>({
    x:(i/(data.length-1))*W,
    y:H-((v-min)/range)*(H*0.8)-H*0.08
  }));
  function smooth(pts){
    let d=`M ${pts[0].x},${pts[0].y}`;
    for(let i=0;i<pts.length-1;i++){
      const mx=(pts[i].x+pts[i+1].x)/2;
      d+=` C ${mx},${pts[i].y} ${mx},${pts[i+1].y} ${pts[i+1].x},${pts[i+1].y}`;
    }
    return d;
  }
  const pathD = smooth(pts);
  const color = isUp ? 'var(--accent)' : 'var(--blue)';
  const colorRaw = isUp ? '#E8440A' : '#5E7EFF';
  const first = pts[0], last = pts[pts.length-1];
  const fillD = `${pathD} L ${last.x},${H} L ${first.x},${H} Z`;
  let layers = '';
  for(let l=4;l>=0;l--){
    const off = l*2.5;
    const op = l===0 ? 1 : 0.05+(4-l)*0.04;
    const lw = l===0 ? 1.4 : 0.5;
    const pp = pts.map(p=>({x:p.x,y:p.y+off}));
    layers += `<path d="${smooth(pp)}" fill="none" stroke="${colorRaw}" stroke-width="${lw}" stroke-opacity="${op}"/>`;
  }
  return `<svg class="ic-spark" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="sg-${isUp?'u':'d'}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${colorRaw}" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="${colorRaw}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${fillD}" fill="url(#sg-${isUp?'u':'d'})"/>
    ${layers}
  </svg>`;
}
