"use strict";
// fx.js - background particle animation
(function(){
 const cv=$("#fx"),x=cv.getContext("2d");if(!x||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
 let w,h,P=[];const N=innerWidth<761?26:48;
 const size=()=>{w=cv.width=innerWidth;h=cv.height=innerHeight};size();addEventListener("resize",size);
 for(let i=0;i<N;i++)P.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35});
 let col="79,107,237",f=0;
 (function loop(){
  if(!document.hidden&&S.fx){
   if(f++%90===0){const m=/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(getComputedStyle(document.documentElement).getPropertyValue("--acc").trim());if(m)col=parseInt(m[1],16)+","+parseInt(m[2],16)+","+parseInt(m[3],16)}
   x.clearRect(0,0,w,h);
   for(const p of P){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;x.fillStyle="rgba("+col+",.55)";x.fillRect(p.x,p.y,2,2)}
   for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const dx=P[i].x-P[j].x,dy=P[i].y-P[j].y,d=dx*dx+dy*dy;if(d<14000){x.strokeStyle="rgba("+col+","+(.2*(1-d/14000))+")";x.beginPath();x.moveTo(P[i].x,P[i].y);x.lineTo(P[j].x,P[j].y);x.stroke()}}
  }
  requestAnimationFrame(loop)
 })()
})();
