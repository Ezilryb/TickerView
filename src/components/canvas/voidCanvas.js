/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Void Canvas (Particle Flow Field)
   src/components/canvas/voidCanvas.js
══════════════════════════════════════════════════════════════ */

export function initVoidCanvas(canvasId){
  const cvs = document.getElementById(canvasId);
  if(!cvs) return;
  const ctx = cvs.getContext('2d');
  let W, H, mouseX = -999, mouseY = -999;
  let particles = [], t = 0;

  function resize(){
    W = cvs.width = window.innerWidth;
    H = cvs.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', e => { mouseX=e.clientX; mouseY=e.clientY; });

  function noise(x,y,t){
    return Math.sin(x*0.004+t*0.25)*Math.cos(y*0.006+t*0.18)
         + Math.sin((x+y)*0.003+t*0.4)*0.6
         + Math.cos(x*0.009-y*0.005+t*0.15)*0.3;
  }

  function initParticles(){
    particles = [];
    for(let i=0;i<240;i++){
      const isAccent = Math.random()<0.1;
      particles.push({
        x:Math.random()*W, y:Math.random()*H,
        vx:0, vy:0,
        life:Math.random(),
        maxLife:0.4+Math.random()*0.6,
        isAccent, size:isAccent?1:0.55
      });
    }
  }
  initParticles();
  window.addEventListener('resize', initParticles);

  // Read accent color from CSS var
  function getAccentRGB(){
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return isDark ? '232,68,10' : '214,59,6';
  }
  function getBaseRGB(){
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return isDark ? '232,230,224' : '26,26,30';
  }

  function frame(){
    t += 0.004;
    // Use theme-aware clear color
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    ctx.fillStyle = isDark ? 'rgba(6,6,8,0.06)' : 'rgba(242,239,232,0.07)';
    ctx.fillRect(0,0,W,H);

    const ar = getAccentRGB();
    const br = getBaseRGB();

    for(const p of particles){
      const n = noise(p.x,p.y,t);
      const angle = n*Math.PI*2.5;
      const dx = p.x-mouseX, dy = p.y-mouseY;
      const dist = Math.sqrt(dx*dx+dy*dy);
      const repel = dist<180 ? (180-dist)/180 : 0;
      p.vx += Math.cos(angle)*0.07+(dist>0?(dx/dist)*repel*0.5:0);
      p.vy += Math.sin(angle)*0.07+(dist>0?(dy/dist)*repel*0.5:0);
      p.vx *= 0.94; p.vy *= 0.94;
      p.x += p.vx; p.y += p.vy;
      p.life -= 0.0022;
      if(p.life<=0||p.x<-10||p.x>W+10||p.y<-10||p.y>H+10){
        p.x=Math.random()*W; p.y=Math.random()*H;
        p.vx=0; p.vy=0; p.life=p.maxLife;
      }
      const alpha = Math.max(0, p.life*(p.isAccent?0.42:0.18));
      const speed = Math.sqrt(p.vx*p.vx+p.vy*p.vy);
      const len = Math.max(2,speed*8);
      ctx.beginPath();
      ctx.moveTo(p.x-p.vx*len*0.3, p.y-p.vy*len*0.3);
      ctx.lineTo(p.x,p.y);
      ctx.strokeStyle = p.isAccent ? `rgba(${ar},${alpha})` : `rgba(${br},${alpha})`;
      ctx.lineWidth = p.size;
      ctx.stroke();
    }
    requestAnimationFrame(frame);
  }
  frame();
}
