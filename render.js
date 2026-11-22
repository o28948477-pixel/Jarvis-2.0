"use strict";
// render.js - drawing the screens and button events
/* ---------- render + events ---------- */
function render(){
 buildNav();$("#main").innerHTML=(ST.includes(cur)?tabs():"")+V[cur]();if(cur!==lastV){const mm=$("#main");mm.classList.remove("vin");void mm.offsetWidth;mm.classList.add("vin");lastV=cur}$("#ttl").textContent=ST.includes(cur)?"Settings":VIEWS.find(v=>v[0]===cur)[1];const n=pending();$("#bdg").hidden=!n;$("#bdg").textContent=n;
 const m=$("#main");
 m.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{cur=b.dataset.tab;render()});
 if(cur==="chat")initChat();
 if(cur==="models"){
  $("#test").onclick=testConn;$("#sf").onchange=e=>{S.sendFiles=e.target.checked;save()};
  $("#disc").onclick=()=>{S.connected=false;save();act("Gemini disconnected");render()};
 }
 if(cur==="skills")m.querySelectorAll("[data-sk]").forEach(b=>b.onclick=()=>{
  const s=b.dataset.sk;
  if(b.dataset.a==="on"){const u=propose("Install skill: "+s,"skill","+ Enable "+s+" skill (demo)\n+ Permissions: none granted");u.target=s;save();toast("Proposal sent to Updates");render()}
  else{delete S.skills[s];act("Skill disabled: "+s);save();render()}
 });
 if(cur==="updates"){
  $("#analyze").onclick=selfAnalyze;
  m.querySelectorAll("[data-u]").forEach(b=>b.onclick=()=>({ok:approve,no:reject,rb:rollback})[b.dataset.a](b.dataset.u));
 }
 if(cur==="memory"){
  const draw=()=>{const q=$("#ms").value.toLowerCase();$("#mlist").innerHTML=S.mem.filter(x=>x.t.toLowerCase().includes(q)).map(x=>`<div class="card row"><span>${esc(x.t)}</span><button class="g" data-d="${x.id}">Delete</button></div>`).join("")||'<p class="note">Nothing saved yet.</p>';
   $("#mlist").querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{S.mem=S.mem.filter(x=>x.id!=b.dataset.d);save();draw()})};
  $("#ms").oninput=draw;draw();
  $("#madd").onclick=()=>{const v=$("#mi").value.trim();if(!v)return;S.mem.unshift({id:Date.now(),t:v});act("Memory saved");save();$("#mi").value="";draw()};
 }
 if(cur==="history"){
 const draw=()=>{const q=$("#hs").value.toLowerCase();
  const L=S.convs.filter(c=>c.msgs.length&&(c.title+" "+c.msgs.map(x=>x.t).join(" ")).toLowerCase().includes(q));
  $("#hl").innerHTML=L.map(c=>`<div class="card row hc"><button class="op" data-oc="${c.id}"><b>${esc(c.title)}</b><br><span class="note">${esc(new Date(c.at).toLocaleString())} \u00B7 ${c.msgs.length} messages</span></button><button class="g" data-x="${c.id}">Delete</button></div>`).join("")||'<p class="note">No saved chats yet.</p>';
  $("#hl").querySelectorAll("[data-oc]").forEach(b=>b.onclick=()=>openConv(+b.dataset.oc));
  $("#hl").querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>{const id=+b.dataset.x;S.convs=S.convs.filter(c=>c.id!==id);if(S.cid===id)newChat(false);save();draw()});
 };
 $("#hs").oninput=draw;draw();
 $("#hclr").onclick=()=>{if(confirm("Delete all saved chats?")){S.convs=[];startChat();draw()}};
}
if(cur==="diag")$("#run").onclick=runDiag;
 if(cur==="set"){
  $("#lg").value=S.lang;$("#lg").onchange=e=>{S.lang=e.target.value;save()};$("#th").value=S.theme;$("#nm").onchange=e=>{S.name=e.target.value.trim()||"Imran";save()};
  $("#th").onchange=e=>{S.theme=e.target.value;applyTheme();save()};
  $("#pinset").onclick=async()=>{const v=$("#pin").value.trim();if(!/^\d{4,8}$/.test(v)){toast("PIN must be 4 to 8 digits");return}if(!window.crypto||!crypto.subtle){toast("PIN lock needs https");return}await setPin(v);toast("PIN lock is on");render()};
  const po=$("#pinoff");if(po)po.onclick=()=>{S.lock=null;save();toast("PIN lock is off");render()};
  $("#imp").onclick=()=>{const i=document.createElement("input");i.type="file";i.accept="application/json,.json";i.onchange=async()=>{const f=i.files[0];if(!f||f.size>2e6){toast("Choose a JSON file under 2 MB");return}try{const d=JSON.parse(await f.text());if(!d||typeof d!=="object"||Array.isArray(d))throw 0;["name","theme","lang","fx","typing","moodfx","mem","tasks","learned","convs","skills"].forEach(k=>{if(k in d)S[k]=d[k]});save();toast("Imported");setTimeout(()=>location.reload(),600)}catch(e){toast("That file isn't a valid JARVIS backup")}};i.click()};
  $("#tfx").onchange=e=>{S.fx=e.target.checked;applyTheme();save()};$("#tty").onchange=e=>{S.typing=e.target.checked;save()};$("#tmf").onchange=e=>{S.moodfx=e.target.checked;save()};
  $("#exp").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S,(k,v)=>["token","lock","chat"].includes(k)?undefined:v,2)],{type:"application/json"}));a.download="jarvis-data.json";a.click()};
  $("#rst").onclick=()=>{if(confirm("Delete all JARVIS data in this browser?")){S=Object.assign({},DEF,{skills:{},mem:[],updates:[],log:[],chat:[],convs:[],tasks:[]});startChat();save();applyTheme();render()}};
 }
}
