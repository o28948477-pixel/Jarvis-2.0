"use strict";
// reply.js - reply display (markdown, copy, retry) and sending messages
function renderMd(el,t){
 el.textContent="";
 t.split("```").forEach((seg,i)=>{
  if(i%2){const code=seg.replace(/^[\w+-]*\n/,"").replace(/\n$/,""),w=document.createElement("div"),p=document.createElement("pre"),b=document.createElement("button");
   p.textContent=code;b.className="cp";b.textContent="Copy";b.onclick=()=>navigator.clipboard.writeText(code).then(()=>toast("Copied"),()=>toast("Copy isn't allowed here"));w.append(p,b);el.appendChild(w)}
  else{const x=document.createElement("span");
   x.innerHTML=esc(seg).replace(/`([^`\n]+)`/g,"<code>$1</code>").replace(/\*\*([^*\n]+)\*\*/g,"<b>$1</b>").replace(/(^|\s)\*([^*\n]+)\*(?=\s|$|[.,!?])/g,"$1<i>$2</i>").replace(/\[([^\]\n]+)\]\((https:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>').replace(/^#{1,3} (.+)$/gm,"<b>$1</b>");
   el.appendChild(x)}
 });
}
function fill(d,r,meta){
 d.classList.remove("typing");d.textContent="";
 const sp=document.createElement("span");d.appendChild(sp);
 const extra=()=>{
  if(r.chips){const q=document.createElement("div");q.className="qc";r.chips.forEach(c=>{const b=document.createElement("button");b.textContent=c;b.onclick=()=>{const i=$("#inp");if(i){i.value=c;send()}};q.appendChild(b)});d.appendChild(q)}
  if(!r.nofb){const f=document.createElement("div");f.className="fb";[["up","\uD83D\uDC4D"],["down","\uD83D\uDC4E"]].forEach(([k,e])=>{const b=document.createElement("button");b.textContent=e;b.setAttribute("aria-label","Rate "+k);b.onclick=()=>{S.fb[k]++;save();f.querySelectorAll("button").forEach(x=>x.disabled=true);b.classList.add("on");toast("Thanks for the feedback")};f.appendChild(b)});
   const cb=document.createElement("button");cb.textContent="Copy";cb.onclick=()=>navigator.clipboard.writeText(r.t).then(()=>toast("Copied"),()=>toast("Copy isn't allowed here"));
   const rb=document.createElement("button");rb.textContent="Retry";rb.onclick=()=>{const u=[...S.chat].reverse().find(x=>x.r==="u"),i=$("#inp");if(u&&i){i.value=u.t.replace(/ \[\d+ file\(s\)\]$/,"");send()}};
   f.append(cb,rb);d.appendChild(f)}};
 const fin=()=>{renderMd(sp,r.t);
  if(r.img&&/^image\/(png|jpeg|webp)$/.test(r.img.mime)&&/^[A-Za-z0-9+\/=]+$/.test(r.img.data||"")&&r.img.data.length<9e6){const im=new Image();im.src="data:"+r.img.mime+";base64,"+r.img.data;im.alt="Generated image";im.className="gen";d.appendChild(im)}
  if(r.src&&r.src.length){const u=document.createElement("div");u.className="srcs";r.src.slice(0,6).forEach((x,k)=>{if(!x||typeof x.uri!=="string"||!/^https:\/\//.test(x.uri))return;const a=document.createElement("a");a.href=x.uri;a.target="_blank";a.rel="noopener noreferrer";a.textContent=(k+1)+". "+String(x.title||x.uri).slice(0,60);u.appendChild(a)});if(u.children.length)d.appendChild(u)}
  if(meta){const x=document.createElement("div");x.className="route";x.textContent=meta;d.appendChild(x)}
  if(r.code){const p=document.createElement("pre");p.textContent=r.code;d.appendChild(p);const b=document.createElement("button");b.className="cp";b.textContent="Copy";b.onclick=()=>{navigator.clipboard.writeText(r.code).then(()=>toast("Copied"),()=>toast("Copy isn't allowed here"))};d.appendChild(b)}
  extra();d.scrollIntoView({block:"end",behavior:"smooth"})};
 if(r.t.length>600||S.typing===false||matchMedia("(prefers-reduced-motion:reduce)").matches){fin();return}
 let n=0;const iv=setInterval(()=>{n+=3;sp.textContent=r.t.slice(0,n);d.scrollIntoView({block:"end"});if(n>=r.t.length){clearInterval(iv);fin()}},18);
}
async function send(){
 if(busy){stopped=true;ctl&&ctl.abort();return}
 const i=$("#inp"),t=i.value.trim();
 if(!t&&!pend.length)return;
 if(t.length>MAXLEN){toast("Message is too long (max "+MAXLEN+" characters)");return}
 if(looksSecret(t)){toast("That looks like an API key or secret. I won't send or store it. Keys belong in the Worker.");return}
 const now=Date.now();sent=sent.filter(x=>now-x<60000);
 if(sent.length>=15){toast("Slow down a little and try again in a few seconds");return}
 sent.push(now);busy=true;stopped=false;{const sb=$("#send");if(sb)sb.innerHTML="&#9632;"}window.speechSynthesis&&speechSynthesis.cancel();i.value="";autosize();
 const files=pend.splice(0);renderTray();
 let ex=null;if(files.length){ex=document.createElement("div");ex.className="att";files.forEach(x=>ex.appendChild(mediaEl(x)))}
 addMsg("u",t||"(attachment)",null,ex);S.chat.push({r:"u",t:(t||"(attachment)")+(files.length?" ["+files.length+" file(s)]":"")});
 {const cv=S.convs.find(x=>x.id===S.cid);if(cv){if(cv.title==="New chat")cv.title=(t||"Attachment").slice(0,42);cv.at=Date.now();S.convs=[cv,...S.convs.filter(x=>x!==cv)]}}
 const rt=route(t),md=mode;resetMode();
 const meta="Task: "+rt.cat+(rt.skill&&S.skills[rt.skill]?" \u00B7 Skill: "+rt.skill:"")+" \u00B7 Engine: "+(S.connected?"Gemini"+(md!=="chat"?" ("+md+")":""):"offline");
 const d=addMsg("j","");d.classList.add("typing");d.innerHTML="<i></i><i></i><i></i>";
 const orb=$("#orb");orb&&orb.classList.add("think");
 await new Promise(r=>setTimeout(r,400));
 let r=(t&&md==="chat")?local(t,rt):null;
 if(!r){
  if(S.connected&&(t||files.length)){
   try{
    const P={prompt:t||"Describe the attached file(s).",mode:md};
    if(rt.skill&&S.skills[rt.skill]&&SKMAP[rt.skill])P.skill=SKMAP[rt.skill];
    P.history=S.chat.slice(0,-1).slice(-8).map(x=>({r:x.r,t:x.t.slice(0,1500)}));
    if(S.skills.Memory&&S.mem.length)P.memory=S.mem.slice(0,10).map(x=>x.t).join("\n").slice(0,1500);
    if(S.sendFiles&&files.length)P.files=await encodeFiles(files);
    const d=await post(P);r={t:d.reply,img:d.image,src:d.sources};
   }catch(e){r={t:stopped?"Stopped.":"Gemini request failed: "+e.message+". Check the Worker in Settings > API."}}
  }
  else r={t:t?"I don't know that offline yet. Type help to see what I can do, or connect Gemini in Settings > API for full answers.":""};
 }
 if(files.length&&!(S.connected&&S.sendFiles))r.t=(r.t?r.t+"\n\n":"")+"Attached: "+files.map(x=>x.f.name+" ("+fmt(x.f.size)+")").join(", ")+". Files stay on this device. To let Gemini read them, connect Gemini and turn on Send attachments in Settings > API.";
 const o2=$("#orb");o2&&o2.classList.remove("think");if(r.mood)setMood(r.mood);
 fill(d,r,meta);if(S.skills["Voice Assistant"]&&r.t&&window.speechSynthesis){const u=new SpeechSynthesisUtterance(r.t.slice(0,600));u.lang=S.lang;speechSynthesis.speak(u)}S.chat.push({r:"j",t:r.t||(r.img?"[generated image]":""),m:meta});if(S.chat.length>200)S.chat.splice(0,S.chat.length-200);if(r.go)setTimeout(()=>{cur=r.go;render()},900);act("Command: "+(t||"attachment").slice(0,40));save();busy=false;{const sb=$("#send");if(sb)sb.innerHTML="&#10148;"}
}
