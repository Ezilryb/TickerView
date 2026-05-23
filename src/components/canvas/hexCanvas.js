/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Hex Geometry Canvas
   src/components/canvas/hexCanvas.js
══════════════════════════════════════════════════════════════ */

export function initHexCanvas(canvasId){
  const cvs = document.getElementById(canvasId);
  if(!cvs) return;
  const ctx = cvs.getContext('2d');
  const W=500, H=500;
  cvs.width=W; cvs.height=H;

  const hexes=[];
  const SIZE=26, COLS=9, ROWS=9;

  function corner(cx,cy,sz,i){
    const r=Math.PI/180*(60*i-30);
    return [cx+sz*Math.cos(r),cy+sz*Math.sin(r)];
  }
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const x=SIZE*1.732*c+(r%2)*SIZE*0.866+W/2-(COLS-1)*SIZE*0.866;
      const y=SIZE*1.5*r+H/2-(ROWS-1)*SIZE*0.75;
      const dist=Math.sqrt((x-W/2)**2+(y-H/2)**2);
      const maxD=W/2*0.85;
      if(dist<maxD){
        hexes.push({x,y,phase:Math.random()*Math.PI*2,speed:0.008+Math.random()*0.005,baseOp:Math.max(0.03,0.3-dist/maxD*0.28),dr:1-dist/maxD});
      }
    }
  }

  function getAccentRaw(){
    return document.documentElement.getAttribute('data-theme')==='light'?'214,59,6':'232,68,10';
  }
  function getBaseRaw(){
    return document.documentElement.getAttribute('data-theme')==='light'?'26,26,30':'232,230,224';
  }

  let ht=0;
  function draw(){
    ctx.clearRect(0,0,W,H);
    ht+=0.018;
    const ar=getAccentRaw(), br=getBaseRaw();
    for(const h of hexes){
      const wave=Math.sin(ht*h.speed*40+h.phase);
      const op=h.baseOp+wave*0.035;
      const sz=SIZE*(0.88+wave*0.03);
      ctx.beginPath();
      for(let i=0;i<6;i++){
        const [px,py]=corner(h.x,h.y,sz,i);
        i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
      }
      ctx.closePath();
      const accent=wave>0.7&&h.dr>0.7;
      ctx.strokeStyle=accent?`rgba(${ar},${op*2.2})`:`rgba(${br},${op})`;
      ctx.lineWidth=accent?0.8:0.35;
      ctx.stroke();
      if(h.dr>0.5&&wave>0.85){
        ctx.fillStyle=`rgba(${ar},${op*0.07})`;
        ctx.fill();
      }
    }
    for(let r=1;r<=4;r++){
      const rt=ht*0.5+r*0.6;
      const ro=(Math.sin(rt)*0.5+0.5)*0.14+0.03;
      ctx.beginPath();
      ctx.arc(W/2,H/2,r*24,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${getAccentRaw()},${ro})`;
      ctx.lineWidth=0.5;
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  draw();
}
