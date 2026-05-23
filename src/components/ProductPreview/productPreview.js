/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Product Preview Canvas Mockups
   src/components/ProductPreview/productPreview.js
   Draws realistic-looking Footprint, Volume Profile, Delta charts
══════════════════════════════════════════════════════════════ */

let currentTab = 0;
let animFrame = null;

export function initProductPreview(){
  const tabs = document.querySelectorAll('.ptab');
  const canvas = document.getElementById('preview-canvas');
  if(!canvas) return;

  const DPR = window.devicePixelRatio || 1;
  function resize(){
    const w = canvas.parentElement.clientWidth;
    const h = Math.min(420, Math.round(w * 0.52));
    canvas.width  = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    drawTab(currentTab);
  }

  tabs.forEach((t,i) => {
    t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      currentTab = i;
      if(animFrame){ cancelAnimationFrame(animFrame); animFrame=null; }
      drawTab(i);
    });
  });

  window.addEventListener('resize', resize);

  // Observe theme changes
  const observer = new MutationObserver(() => drawTab(currentTab));
  observer.observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });

  resize();
}

function isLight(){ return document.documentElement.getAttribute('data-theme')==='light'; }
function accent(){ return isLight() ? '#D63B06' : '#E8440A'; }
function blue(){ return isLight() ? '#3D5CE8' : '#5E7EFF'; }
function bgBase(){ return isLight() ? '#FFFFFF' : '#0C0C10'; }
function bgCard(){ return isLight() ? '#F7F4EF' : '#131318'; }
function textPrimary(){ return isLight() ? '#1A1A1E' : '#E8E6E0'; }
function textSecondary(){ return isLight() ? '#7A756C' : '#5A5750'; }
function border(){ return isLight() ? '#E4E0D8' : '#1E1E24'; }

function drawTab(i){
  const canvas = document.getElementById('preview-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio||1;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  const W = parseInt(canvas.style.width);
  const H = parseInt(canvas.style.height);
  ctx.clearRect(0,0,W,H);

  if(i===0) drawFootprint(ctx,W,H);
  else if(i===1) drawVolumeProfile(ctx,W,H);
  else if(i===2) drawMultiChart(ctx,W,H);
}

/* ── 1. FOOTPRINT CHART ────────────────────────────────────── */
function drawFootprint(ctx, W, H){
  const bg=bgBase(), brd=border(), acc=accent(), bl=blue();
  const tp=textPrimary(), ts=textSecondary();
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

  const CANDLES=8, LEVELS=8;
  const cellW=(W-80)/(CANDLES);
  const cellH=(H-40)/LEVELS;
  const startX=60, startY=20;

  // Price axis
  const basePrice=67800;
  for(let l=0;l<LEVELS+1;l++){
    const y=startY+l*cellH;
    ctx.fillStyle=ts; ctx.font=`9px 'IBM Plex Mono',monospace`;
    ctx.textAlign='right';
    ctx.fillText((basePrice-l*25).toLocaleString('fr-FR'), startX-8, y+cellH*0.5+3);
    ctx.strokeStyle=brd; ctx.lineWidth=0.5;
    ctx.beginPath(); ctx.moveTo(startX,y); ctx.lineTo(W,y); ctx.stroke();
  }

  // Candles
  for(let c=0;c<CANDLES;c++){
    const x=startX+c*cellW;
    // Wick
    const wickH=cellH*LEVELS*0.6;
    const wickY=startY+cellH*1.2+Math.random()*cellH;
    ctx.strokeStyle=brd; ctx.lineWidth=0.8;
    ctx.beginPath(); ctx.moveTo(x+cellW/2,wickY); ctx.lineTo(x+cellW/2,wickY+wickH); ctx.stroke();

    for(let l=0;l<LEVELS;l++){
      const y=startY+l*cellH;
      const bid=Math.floor(Math.random()*900+100);
      const ask=Math.floor(Math.random()*900+100);
      const ratio=bid/(bid+ask);
      const imbalance=Math.abs(ratio-0.5)>0.3;

      // Cell background
      let cellFill;
      if(imbalance && ratio>0.5){
        cellFill=`rgba(232,68,10,${0.1+ratio*0.15})`;
      } else if(imbalance){
        cellFill=`rgba(94,126,255,${0.1+(1-ratio)*0.15})`;
      } else {
        cellFill=isLight()?'rgba(0,0,0,0.02)':'rgba(255,255,255,0.02)';
      }
      ctx.fillStyle=cellFill;
      ctx.fillRect(x+1,y+1,cellW-2,cellH-2);

      // Volume numbers
      const fw=cellW/2-2;
      ctx.font=`8px 'IBM Plex Mono',monospace`;
      ctx.textAlign='center';
      // Ask (left)
      ctx.fillStyle=bl; ctx.globalAlpha=0.85;
      ctx.fillText(ask, x+fw/2+2, y+cellH*0.58);
      // Bid (right)
      ctx.fillStyle=acc; ctx.globalAlpha=0.85;
      ctx.fillText(bid, x+fw+fw/2+2, y+cellH*0.58);
      ctx.globalAlpha=1;

      // Imbalance marker
      if(imbalance){
        ctx.fillStyle=ratio>0.5?acc:bl;
        ctx.font=`bold 8px 'IBM Plex Mono',monospace`;
        ctx.fillText('▸', x+cellW-10, y+cellH*0.58);
      }
    }

    // Delta at bottom
    const delta=Math.floor((Math.random()-0.42)*800);
    ctx.font=`bold 9px 'IBM Plex Mono',monospace`;
    ctx.textAlign='center';
    ctx.fillStyle=delta>=0?acc:bl;
    ctx.fillText((delta>=0?'+':'')+delta, x+cellW/2, H-6);

    // Separator
    ctx.strokeStyle=brd; ctx.lineWidth=0.5;
    ctx.beginPath(); ctx.moveTo(x+cellW,startY); ctx.lineTo(x+cellW,H-14); ctx.stroke();
  }

  // Labels
  ctx.font=`8px 'IBM Plex Mono',monospace`; ctx.textAlign='left';
  ctx.fillStyle=isLight()?'rgba(214,59,6,0.7)':'rgba(232,68,10,0.6)';
  ctx.fillText('ASK', startX+4, H-6);
  ctx.fillStyle=isLight()?'rgba(61,92,232,0.7)':'rgba(94,126,255,0.6)';
  ctx.fillText('BID', startX+44, H-6);

  // Top label
  ctx.font=`bold 10px 'IBM Plex Mono',monospace`; ctx.textAlign='left';
  ctx.fillStyle=acc;
  ctx.fillText('FOOTPRINT CHART · BTC/USDT · 5m', 4, 14);
}

/* ── 2. VOLUME PROFILE (VRVP) ─────────────────────────────── */
function drawVolumeProfile(ctx, W, H){
  const bg=bgBase(), brd=border(), acc=accent(), bl=blue();
  const tp=textPrimary(), ts=textSecondary();
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

  const CHART_W=W*0.68, VP_W=W*0.28;
  const LEVELS=18, PADDING=30;
  const lvH=(H-PADDING*2)/LEVELS;

  // Generate price series (candlestick lite)
  const prices=[];
  let p=67800;
  for(let i=0;i<50;i++){p+=(Math.random()-0.48)*80;prices.push(p);}
  const pMin=Math.min(...prices)-50, pMax=Math.max(...prices)+50;
  const pRange=pMax-pMin;

  // Line chart
  ctx.strokeStyle=acc; ctx.lineWidth=1.5;
  ctx.beginPath();
  prices.forEach((v,i)=>{
    const x=PADDING+(i/49)*(CHART_W-PADDING*2);
    const y=PADDING+((pMax-v)/pRange)*(H-PADDING*2);
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.stroke();

  // Fill under
  ctx.fillStyle=isLight()?'rgba(214,59,6,0.05)':'rgba(232,68,10,0.05)';
  ctx.lineTo(CHART_W-PADDING, H-PADDING);
  ctx.lineTo(PADDING, H-PADDING);
  ctx.closePath(); ctx.fill();

  // Volume profile bars
  const volumes=[]; let pocIdx=0, maxV=0;
  for(let l=0;l<LEVELS;l++){
    const v=Math.floor(Math.random()*1000+100)*(Math.random()>0.7?2.5:1);
    volumes.push(v); if(v>maxV){maxV=v;pocIdx=l;}
  }
  const vaStart=Math.max(0,pocIdx-Math.floor(LEVELS*0.35));
  const vaEnd=Math.min(LEVELS-1,pocIdx+Math.floor(LEVELS*0.35));

  const vpX=CHART_W+4;
  volumes.forEach((v,l)=>{
    const barW=(v/maxV)*(VP_W-8);
    const y=PADDING+l*lvH;
    const isPoc=l===pocIdx;
    const isVA=l>=vaStart&&l<=vaEnd;

    ctx.fillStyle=isPoc?acc:(isVA?(isLight()?'rgba(214,59,6,0.25)':'rgba(232,68,10,0.18)'):(isLight()?'rgba(0,0,0,0.06)':'rgba(255,255,255,0.06)'));
    ctx.fillRect(vpX,y+1,barW,lvH-2);

    // Price label
    const lvPrice=Math.round(pMax-(l/LEVELS)*pRange);
    ctx.font=`8px 'IBM Plex Mono',monospace`; ctx.textAlign='right';
    ctx.fillStyle=isPoc?acc:ts;
    ctx.fillText(lvPrice.toLocaleString(), vpX-4, y+lvH*0.65);
  });

  // POC line across chart
  const pocY=PADDING+pocIdx*lvH+lvH*0.5;
  ctx.strokeStyle=acc; ctx.lineWidth=0.8;
  ctx.setLineDash([4,4]);
  ctx.beginPath(); ctx.moveTo(PADDING,pocY); ctx.lineTo(CHART_W-4,pocY); ctx.stroke();
  ctx.setLineDash([]);
  ctx.font=`bold 8px 'IBM Plex Mono',monospace`; ctx.textAlign='left'; ctx.fillStyle=acc;
  ctx.fillText('POC', PADDING+4, pocY-3);

  // VA label
  ctx.font=`8px 'IBM Plex Mono',monospace`; ctx.textAlign='left';
  ctx.fillStyle=isLight()?'rgba(214,59,6,0.6)':'rgba(232,68,10,0.5)';
  ctx.fillText('VA 70%', vpX+4, PADDING+vaStart*lvH+8);

  // Grid lines
  ctx.strokeStyle=brd; ctx.lineWidth=0.5;
  for(let i=0;i<=4;i++){
    const x=PADDING+i*(CHART_W-PADDING*2)/4;
    ctx.beginPath(); ctx.moveTo(x,PADDING); ctx.lineTo(x,H-PADDING); ctx.stroke();
  }

  // Top label
  ctx.font=`bold 10px 'IBM Plex Mono',monospace`; ctx.textAlign='left'; ctx.fillStyle=acc;
  ctx.fillText('VOLUME PROFILE (VRVP) · BTC/USDT · 1H', 4, 14);
  ctx.font=`8px 'IBM Plex Mono',monospace`; ctx.fillStyle=ts;
  ctx.fillText('Value Area ← →', vpX+4, 14);
}

/* ── 3. MULTI-CHART LAYOUT ─────────────────────────────────── */
function drawMultiChart(ctx, W, H){
  const bg=bgBase(), brd=border(), acc=accent(), bl=blue();
  const tp=textPrimary(), ts=textSecondary();
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

  const tfs=[['1m','BTC/USDT',true],['5m','ETH/USDT',false],['15m','BTC/USDT',true],['1h','NQ1!',false]];
  const pad=2;
  const PW=(W-pad*3)/2, PH=(H-pad)/2;

  tfs.forEach(([tf,sym,isUp],i)=>{
    const col=i%2, row=Math.floor(i/2);
    const ox=col*(PW+pad), oy=row*(PH+pad);

    // Panel bg
    ctx.fillStyle=bgCard(); ctx.fillRect(ox,oy,PW,PH);
    ctx.strokeStyle=brd; ctx.lineWidth=0.8;
    ctx.strokeRect(ox,oy,PW,PH);

    // Panel header
    ctx.fillStyle=isLight()?'rgba(0,0,0,0.04)':'rgba(255,255,255,0.03)';
    ctx.fillRect(ox,oy,PW,18);
    ctx.font=`bold 8px 'IBM Plex Mono',monospace`; ctx.textAlign='left';
    ctx.fillStyle=tp; ctx.fillText(sym, ox+8, oy+12);
    ctx.fillStyle=ts; ctx.textAlign='right'; ctx.fillText(tf, ox+PW-8, oy+12);

    // Mini candlestick chart
    const BARS=20; const BAR_W=(PW-16)/BARS; const CHART_H=PH-28;
    let cp=100+Math.random()*20;
    for(let b=0;b<BARS;b++){
      const o=cp;
      const c=o+(Math.random()-0.48)*4;
      const h=Math.max(o,c)+Math.random()*2;
      const l=Math.min(o,c)-Math.random()*2;
      const allH=CHART_H-4;
      const minP=80, maxP=130, pRange=50;
      const bX=ox+8+b*BAR_W;
      const oY=oy+22+allH-((o-minP)/pRange)*allH;
      const cY=oy+22+allH-((c-minP)/pRange)*allH;
      const hY=oy+22+allH-((h-minP)/pRange)*allH;
      const lY=oy+22+allH-((l-minP)/pRange)*allH;
      const candleIsUp=c>=o;
      const col=candleIsUp?acc:bl;
      // Wick
      ctx.strokeStyle=col; ctx.lineWidth=0.6;
      ctx.beginPath(); ctx.moveTo(bX+BAR_W/2,hY); ctx.lineTo(bX+BAR_W/2,lY); ctx.stroke();
      // Body
      const bodyH=Math.max(1,Math.abs(cY-oY));
      ctx.fillStyle=col; ctx.globalAlpha=candleIsUp?0.85:0.6;
      ctx.fillRect(bX+1,Math.min(oY,cY),BAR_W-2,bodyH);
      ctx.globalAlpha=1;
      cp=c;
    }

    // Delta bar at bottom
    const delta=isUp?Math.floor(Math.random()*500+100):-Math.floor(Math.random()*500+100);
    ctx.font=`7px 'IBM Plex Mono',monospace`; ctx.textAlign='left';
    ctx.fillStyle=delta>=0?acc:bl;
    ctx.fillText(`Δ ${delta>=0?'+':''}${delta}`, ox+8, oy+PH-4);
  });

  // Top label
  ctx.font=`bold 10px 'IBM Plex Mono',monospace`; ctx.textAlign='left'; ctx.fillStyle=acc;
  // (panel headers carry the label)
}

