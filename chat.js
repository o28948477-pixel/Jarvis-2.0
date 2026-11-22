"use strict";
// chat.js - chats, history, attachments, voice input
/* ---------- conversations ---------- */
function newChat(go){
 let c=S.convs[0];
 if(!c||c.msgs.length){c={id:Date.now(),title:"New chat",at:Date.now(),msgs:[]};S.convs.unshift(c);S.convs=S.convs.slice(0,100)}
 S.cid=c.id;S.chat=c.msgs;save();if(go){cur="chat";render()}
}
function startChat(){S.chat=[];newChat(false)}
function openConv(id){const c=S.convs.find(x=>x.id===id);if(!c)return;S.cid=id;S.chat=c.msgs;cur="chat";render()}
function recent(){
 const R=S.convs.filter(c=>c.msgs.length&&c.id!==S.cid).slice(0,3);
 return R.length?`<div class="recent"><div class="note">Recent chats</div>${R.map(c=>`<button class="rc" data-r="${c.id}">${esc(c.title)}<span class="note">${esc(new Date(c.at).toLocaleDateString())}</span></button>`).join("")}<button class="rc" data-h="1">See all history</button></div>`:"";
}
/* ---------- assistant ---------- */
const MAXF=10485760,MAXLEN=4000;
const OKMIME=/^(image\/(png|jpe?g|webp|gif)|audio\/[\w.+-]+|video\/(mp4|webm|quicktime|ogg)|application\/pdf|text\/(plain|csv|markdown)|application\/json)$/;
let ctl=null,busy=false,stopped=false,pend=[],sent=[],rec=null,listening=false,mr=null,chunks=[];
const fmt=n=>n<1024?n+" B":n<1048576?(n/1024).toFixed(1)+" KB":(n/1048576).toFixed(1)+" MB";
const MICERR={"not-allowed":"Mic permission is blocked. Allow the microphone for this site in browser settings.","service-not-allowed":"Voice typing is blocked here (in-app browsers often block it). Open in Chrome.","no-speech":"I didn't hear anything. Tap the mic and speak again.","audio-capture":"No microphone found.","network":"Voice typing needs internet (Chrome sends audio to Google).","language-not-supported":"This language isn't supported. Change it in Settings."};
function addMsg(role,text,meta,extra){
 const d=document.createElement("div");d.className="m "+(role==="u"?"u":"");
 {const sp=document.createElement("span");d.appendChild(sp);if(role==="u")sp.textContent=text;else renderMd(sp,text);
  if(meta){const x=document.createElement("div");x.className="route";x.textContent=meta;d.appendChild(x)}}
 if(extra)d.appendChild(extra);
 const w=$("#welcome");if(w)w.remove();const ow=$(".orbw");if(ow)ow.classList.add("sm");
 $("#msgs").appendChild(d);d.scrollIntoView({block:"end",behavior:"smooth"});return d;
}
function mediaEl(x){
 let e;
 if(x.kind==="image"){e=new Image();e.src=x.url;e.alt=x.f.name}
 else if(x.kind==="audio"||x.kind==="video"){e=document.createElement(x.kind);e.src=x.url;e.controls=true;if(x.kind==="video")e.playsInline=true}
 else{e=document.createElement("div");e.className="fchip";e.textContent="\uD83D\uDCC4 "+x.f.name}
 return e;
}
function renderTray(){
 const t=$("#tray");if(!t)return;t.textContent="";
 pend.forEach((x,i)=>{const c=document.createElement("div");c.className="tc";
  if(x.kind==="image"){const im=new Image();im.src=x.url;im.alt="";c.appendChild(im)}
  const sp=document.createElement("span");sp.textContent=x.f.name+" \u00B7 "+fmt(x.f.size);c.appendChild(sp);
  const b=document.createElement("button");b.textContent="\u2715";b.setAttribute("aria-label","Remove");b.onclick=()=>{URL.revokeObjectURL(x.url);pend.splice(i,1);renderTray()};c.appendChild(b);t.appendChild(c)});
}
function addFiles(fs){
 for(const f of fs){
  if(pend.length>=5){toast("Up to 5 files per message");break}
  if(f.size>MAXF){toast(f.name+" is over 10 MB");continue}
  const ext=/\.(pdf|txt|md|csv|json)$/i.test(f.name);
  if(!(OKMIME.test(f.type)||(!f.type&&ext))){toast(f.name+": this file type isn't allowed");continue}
  const kind=f.type.startsWith("image/")?"image":f.type.startsWith("audio/")?"audio":f.type.startsWith("video/")?"video":"file";
  pend.push({f,kind,url:URL.createObjectURL(f)});
 }
 renderTray();
}
function pick(kind){
 const i=document.createElement("input");i.type="file";i.multiple=true;
 i.accept={image:"image/png,image/jpeg,image/webp,image/gif",audio:"audio/*",video:"video/mp4,video/webm,video/quicktime",file:".pdf,.txt,.md,.csv,.json"}[kind];
 i.onchange=()=>addFiles([...i.files]);i.click();
}
function openSheet(){
 const sh=$("#sheet"),on=mr&&mr.state==="recording";
 sh.innerHTML='<div><button data-k="image">\uD83D\uDDBC Photo</button><button data-k="file">\uD83D\uDCC4 File</button><button data-k="audio">\uD83C\uDFB5 Audio</button><button data-k="video">\uD83C\uDFAC Video</button><button data-k="rec" style="grid-column:1/-1">'+(on?"\u23F9 Stop recording":"\uD83C\uDF99 Record voice note")+'</button></div>';
 sh.hidden=false;sh.onclick=e=>{if(e.target===sh)sh.hidden=true};
 sh.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>{sh.hidden=true;b.dataset.k==="rec"?recordNote():pick(b.dataset.k)});
}
async function recordNote(){
 if(mr&&mr.state==="recording"){mr.stop();return}
 if(!isSecureContext||!navigator.mediaDevices||!window.MediaRecorder){toast("Recording needs https and a supported browser. Use your GitHub Pages link in Chrome.");return}
 try{
  const st=await navigator.mediaDevices.getUserMedia({audio:true});
  chunks=[];mr=new MediaRecorder(st);
  mr.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  mr.onstop=()=>{st.getTracks().forEach(t=>t.stop());const ty=(mr.mimeType||"audio/webm").split(";")[0];addFiles([new File([new Blob(chunks,{type:ty})],"voice-note-"+Date.now()+".webm",{type:ty})]);toast("Voice note attached")};
  mr.start();toast("Recording... open + and tap Stop recording");
 }catch(e){toast(MICERR[e.name==="NotAllowedError"?"not-allowed":"audio-capture"])}
}
function toggleMic(){
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){toast("Voice typing isn't supported here. Use Chrome, or record a voice note from +.");return}
 if(!isSecureContext){toast("Mic needs https. Open JARVIS from your GitHub Pages link, not a local file.");return}
 if(listening){rec&&rec.stop();return}
 const r=rec=new SR(),i=$("#inp"),base=i.value;
 r.lang=S.lang;r.interimResults=true;r.continuous=false;
 r.onstart=()=>{listening=true;$("#mic").classList.add("live");$("#orb").classList.add("listen")};
 r.onresult=e=>{let t="";for(const x of e.results)t+=x[0].transcript;i.value=(base?base+" ":"")+t;autosize()};
 r.onerror=e=>toast(MICERR[e.error]||"Mic error: "+e.error);
 r.onend=()=>{listening=false;const m=$("#mic"),o=$("#orb");m&&m.classList.remove("live");o&&o.classList.remove("listen")};
 try{r.start()}catch(e){toast("Mic couldn't start. Try again.")}
}
const MPH={chat:"Message JARVIS...",reason:"Ask a hard question...",image:"Describe the image...",research:"What should I look up?"};
function resetMode(){mode="chat";document.querySelectorAll("[data-md]").forEach(x=>x.classList.remove("on"));const i=$("#inp");if(i)i.placeholder=MPH.chat}
async function encodeFiles(fs){
 const x=fs.slice(0,3);if(x.reduce((a,f)=>a+f.f.size,0)>5242880)throw new Error("Attachments over 5 MB in total can't be sent");
 return Promise.all(x.map(f=>new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok({mime:f.f.type||"text/plain",data:String(r.result).split(",")[1]});r.onerror=()=>no(new Error("Couldn't read "+f.f.name));r.readAsDataURL(f.f)})));
}
function autosize(){const i=$("#inp");if(!i)return;i.style.height="auto";i.style.height=Math.min(i.scrollHeight,120)+"px"}
function initChat(){
 S.chat.slice(-30).forEach(m=>addMsg(m.r,m.t,m.m));renderTray();
 $("#send").onclick=send;$("#mic").onclick=toggleMic;$("#att").onclick=openSheet;
 const i=$("#inp");i.oninput=autosize;
 i.onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}};
 document.querySelectorAll("[data-o]").forEach(b=>b.onclick=openSheet);
 document.querySelectorAll("[data-md]").forEach(b=>b.onclick=()=>{
  if(!S.connected){toast("Connect Gemini first: Settings > API");return}
  if(b.dataset.md==="image"&&!S.skills["Image Generation"]){toast("Install the Image Generation skill first (Settings > Skills)");return}
  mode=mode===b.dataset.md?"chat":b.dataset.md;
  document.querySelectorAll("[data-md]").forEach(x=>x.classList.toggle("on",x.dataset.md===mode));
  i.placeholder=MPH[mode];
 });
 document.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>openConv(+b.dataset.r));document.querySelectorAll("[data-h]").forEach(b=>b.onclick=()=>{cur="history";render()});
 document.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>{i.value=b.dataset.s;i.focus()});
 const m=$("#main");m.ondragover=e=>e.preventDefault();m.ondrop=e=>{e.preventDefault();addFiles([...e.dataTransfer.files])};
}
