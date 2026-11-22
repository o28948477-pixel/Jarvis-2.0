"use strict";
// state.js - state, storage, helpers and task routing
/* ---------- state ---------- */
const K="jarvis_v1";
const DEF={lock:null,token:"",sendFiles:false,fx:true,typing:true,moodfx:true,moods:[],learned:[],fb:{up:0,down:0},convs:[],tasks:[],cid:0,lang:"bn-BD",name:"Imran",theme:"auto",worker:"",connected:false,skills:{},mem:[],updates:[],log:[],chat:[]};
let S=Object.assign({},DEF);
let storeOK=true;
try{const r=localStorage.getItem(K);if(r)S=Object.assign({},DEF,JSON.parse(r))}catch(e){storeOK=false}
(function(){if(!S||typeof S!=="object"||Array.isArray(S))S=Object.assign({},DEF);if(typeof S.skills!=="object"||!S.skills||Array.isArray(S.skills))S.skills={};["mem","updates","log","chat"].forEach(k=>{if(!Array.isArray(S[k]))S[k]=[]});S.chat=S.chat.filter(x=>x&&typeof x.t==="string");if(!["auto","light","dark"].includes(S.theme))S.theme="auto";S.name=String(S.name||"Imran").slice(0,30);if(!["bn-BD","en-US"].includes(S.lang))S.lang="bn-BD";S.worker=typeof S.worker==="string"&&/^https:\/\//.test(S.worker)?S.worker:"";S.connected=!!S.connected&&!!S.worker;
if(!Array.isArray(S.tasks))S.tasks=[];S.tasks=S.tasks.filter(x=>x&&typeof x.t==="string").slice(0,100);
if(!Array.isArray(S.convs))S.convs=[];
S.convs=S.convs.filter(c=>c&&Array.isArray(c.msgs)).slice(0,100).map(c=>({id:+c.id||Date.now(),title:String(c.title||"Chat").slice(0,60),at:+c.at||Date.now(),msgs:c.msgs.filter(x=>x&&typeof x.t==="string"&&(x.r==="u"||x.r==="j")).slice(-200)}));
if(!S.convs.length&&S.chat.length)S.convs=[{id:Date.now(),title:String(S.chat[0].t).slice(0,42),at:Date.now(),msgs:S.chat.slice(-200)}];
S.lock=S.lock&&typeof S.lock.s==="string"&&typeof S.lock.h==="string"?{s:S.lock.s.slice(0,40),h:S.lock.h.slice(0,80)}:null;S.token=typeof S.token==="string"&&/^[\x21-\x7E]{0,200}$/.test(S.token)?S.token:"";S.sendFiles=!!S.sendFiles;S.fx=S.fx!==false;S.typing=S.typing!==false;S.moodfx=S.moodfx!==false;
S.fb=S.fb&&typeof S.fb==="object"?{up:+S.fb.up||0,down:+S.fb.down||0}:{up:0,down:0};
if(!Array.isArray(S.moods))S.moods=[];S.moods=S.moods.filter(x=>x&&typeof x.m==="string").slice(0,60);
if(!Array.isArray(S.learned))S.learned=[];S.learned=S.learned.filter(x=>x&&typeof x.q==="string"&&typeof x.a==="string").slice(0,100);
S.chat=[]})();
function save(){try{localStorage.setItem(K,JSON.stringify(S,(k,v)=>k==="chat"?undefined:v))}catch(e){storeOK=false}}
let errCount=0;window.addEventListener("error",()=>{errCount++});
const $=(s,r=document)=>r.querySelector(s);
const esc=t=>String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("on"),2200)}
function act(t){S.log.unshift({t,at:new Date().toLocaleString()});S.log=S.log.slice(0,30);save()}
function applyTheme(){document.documentElement.dataset.t=S.theme;document.documentElement.dataset.fx=S.fx?"on":"off"}

/* ---------- catalog ---------- */
const VIEWS=[["chat","Assistant"],["history","History"],["home","Dashboard"],["updates","Updates"],["set","Settings"],["models","API",1],["skills","Skills",1],["memory","Memory",1],["diag","Diagnostics",1]];
const ST=["set","models","skills","memory","diag"],TABN={set:"General",models:"API",skills:"Skills",memory:"Memory",diag:"Diagnostics"};
const tabs=()=>`<div class="tabs">${ST.map(k=>`<button data-tab="${k}" class="${k===cur?"on":""}">${TABN[k]}</button>`).join("")}</div>`;
const MODELS=[["Gemini","Google","via Cloudflare Worker"],["ChatGPT","OpenAI","API not set up"],["Claude","Anthropic","API not set up"],["DeepSeek","DeepSeek","API not set up"]];
const SKILLS=["Coding","Web Development","Research","Writing","GitHub","Browser","File Management","Automation","Image Generation","Voice Assistant","Memory","Data Analysis","Translation","Document Creation"];
const CATS=[
 {k:"Coding",re:/code|website|html|css|js|javascript|bug|ওয়েবসাইট|কোড|ওয়েব/i,skill:"Coding",pref:"Gemini"},
 {k:"Research",re:/research|find|compare|খুঁজ|গবেষণা|তুলনা/i,skill:"Research",pref:"Gemini"},
 {k:"Writing",re:/write|email|letter|essay|লিখ|চিঠি|ইমেইল/i,skill:"Writing",pref:"Gemini"},
 {k:"Translation",re:/translate|অনুবাদ/i,skill:"Translation",pref:"Gemini"}
];
function route(t){
 const c=CATS.find(c=>c.re.test(t))||{k:"General",skill:null,pref:"Gemini"};
 const live=S.connected?"Gemini":null;
 return{cat:c.k,skill:c.skill,pref:c.pref,model:live};
}
