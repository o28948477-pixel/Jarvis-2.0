"use strict";
// brain.js - offline brain: math, tasks, emotions, teaching, text tools
/* offline brain: no network, no eval */
function calc(s){
 const t=s.replace(/\s+/g,"").replace(/\u00D7/g,"*").replace(/\u00F7/g,"/");
 if(!/^[\d.+\-*\/%^()]+$/.test(t)||t.length>60)return null;
 let i=0;
 const num=()=>{if(t[i]==="("){i++;const v=ex();if(t[i]!==")")throw 0;i++;return v}
  if(t[i]==="-"){i++;return -num()}
  const m=/^\d*\.?\d+/.exec(t.slice(i));if(!m)throw 0;i+=m[0].length;return parseFloat(m[0])};
 const pw=()=>{let v=num();while(t[i]==="^"){i++;v=Math.pow(v,num())}return v};
 const tm=()=>{let v=pw();while(t[i]==="*"||t[i]==="/"||t[i]==="%"){const o=t[i++],r=pw();v=o==="*"?v*r:o==="/"?v/r:v%r}return v};
 const ex=()=>{let v=tm();while(t[i]==="+"||t[i]==="-"){const o=t[i++],r=tm();v=o==="+"?v+r:v-r}return v};
 try{const v=ex();return i===t.length&&isFinite(v)?v:null}catch(e){return null}
}
const STARTER='<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>My Website</title>\n<style>\nbody{font-family:system-ui,sans-serif;margin:0;padding:2rem;max-width:720px;margin-inline:auto;line-height:1.6}\nh1{color:#4f6bed}\n</style>\n</head>\n<body>\n<h1>Hello!</h1>\n<p>Edit this page to make it yours.</p>\n</body>\n</html>';
const TODO='<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>To-do</title>\n<style>body{font-family:system-ui;max-width:420px;margin:2rem auto;padding:0 1rem}li{padding:.4rem 0;cursor:pointer}</style></head>\n<body><h1>To-do</h1><input id="i" placeholder="New task"> <button id="b">Add</button><ul id="l"></ul>\n<script>\nconst l=document.getElementById("l"),i=document.getElementById("i");\ndocument.getElementById("b").onclick=()=>{const v=i.value.trim();if(!v)return;const li=document.createElement("li");li.textContent=v;li.onclick=()=>li.remove();l.appendChild(li);i.value=""}\n<\/script></body></html>';
const LAND='<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Landing</title>\n<style>body{margin:0;font-family:system-ui;text-align:center}header{padding:6rem 1rem;background:linear-gradient(135deg,#cfe3ff,#e7dcff)}h1{font-size:2.4rem;margin:0 0 .5rem}a{display:inline-block;margin-top:1rem;padding:.7rem 1.4rem;border-radius:99px;background:#4f6bed;color:#fff;text-decoration:none}section{padding:3rem 1rem}</style></head>\n<body><header><h1>Your big idea</h1><p>One clear sentence about what you do.</p><a href="#more">Get started</a></header><section id="more"><h2>Features</h2><p>Add your features here.</p></section></body></html>';
const UNITS={km:[1000,"l"],m:[1,"l"],cm:[.01,"l"],mi:[1609.344,"l"],ft:[.3048,"l"],in:[.0254,"l"],kg:[1,"m"],g:[.001,"m"],lb:[.45359237,"m"],oz:[.0283495,"m"],l:[1,"v"],ml:[.001,"v"],gal:[3.78541,"v"]};
const UAL={mile:"mi",miles:"mi",kilometer:"km",kilometers:"km",kilometre:"km",kilometres:"km",meter:"m",meters:"m",feet:"ft",foot:"ft",inch:"in",inches:"in",pound:"lb",pounds:"lb",lbs:"lb",kilo:"kg",kilos:"kg",gram:"g",grams:"g",liter:"l",litre:"l",liters:"l",gallon:"gal",gallons:"gal"};
const TK={c:"c",celsius:"c",f:"f",fahrenheit:"f",k:"k",kelvin:"k"};
function conv(v,a,b){
 if(TK[a]&&TK[b]){const x=TK[a],y=TK[b],c=x==="c"?v:x==="f"?(v-32)*5/9:v-273.15;return y==="c"?c:y==="f"?c*9/5+32:c+273.15}
 a=UAL[a]||a;b=UAL[b]||b;const A=UNITS[a],B=UNITS[b];return A&&B&&A[1]===B[1]?v*A[0]/B[0]:null;
}
function summ(x){
 const ss=(x.match(/[^.!?\u0964]+[.!?\u0964]*/g)||[x]).map(y=>y.trim()).filter(Boolean);if(ss.length<3)return x.trim();
 const sp=y=>y.toLowerCase().split(/[\s,;:()"'\-]+/),f={};sp(x).forEach(w=>{if(w.length>3)f[w]=(f[w]||0)+1});
 const sc=ss.map((y,i)=>({i,y,v:sp(y).reduce((a,w)=>a+(f[w]||0),0)/Math.sqrt(y.split(/\s+/).length)}));
 return sc.sort((a,b)=>b.v-a.v).slice(0,Math.min(3,Math.ceil(ss.length/3))).sort((a,b)=>a.i-b.i).map(z=>z.y).join(" ");
}
const choose=a=>a[rnd(a.length)];
const rnd=n=>crypto.getRandomValues(new Uint32Array(1))[0]%n;
const PH={"hello":"\u09B9\u09CD\u09AF\u09BE\u09B2\u09CB","thank you":"\u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6","good morning":"\u09B6\u09C1\u09AD \u09B8\u0995\u09BE\u09B2","good night":"\u09B6\u09C1\u09AD \u09B0\u09BE\u09A4\u09CD\u09B0\u09BF","how are you":"\u0986\u09AA\u09A8\u09BF \u0995\u09C7\u09AE\u09A8 \u0986\u099B\u09C7\u09A8","i love you":"\u0986\u09AE\u09BF \u09A4\u09CB\u09AE\u09BE\u0995\u09C7 \u09AD\u09BE\u09B2\u09CB\u09AC\u09BE\u09B8\u09BF","yes":"\u09B9\u09CD\u09AF\u09BE\u0981","no":"\u09A8\u09BE","please":"\u09A6\u09AF\u09BC\u09BE \u0995\u09B0\u09C7","sorry":"\u09A6\u09C1\u0983\u0996\u09BF\u09A4","welcome":"\u09B8\u09CD\u09AC\u09BE\u0997\u09A4\u09AE","water":"\u09AA\u09BE\u09A8\u09BF","food":"\u0996\u09BE\u09AC\u09BE\u09B0","friend":"\u09AC\u09A8\u09CD\u09A7\u09C1"};
const PHR=Object.fromEntries(Object.entries(PH).map(([k,v])=>[v,k]));
const NAVS={api:"models",models:"models",skills:"skills",updates:"updates",memory:"memory",history:"history",dashboard:"home",settings:"set",diagnostics:"diag"};
const HELP="I work offline. Try:\n\u2022 Feelings: tell me how you feel (I listen and respond)\n\u2022 Math: 2+3*4, 20% of 450\n\u2022 Convert: 5 km to mi, 30 c to f\n\u2022 Tasks: add task buy milk, show tasks, done 1\n\u2022 Notes: remember ..., forget 1, what is my ...\n\u2022 Teach me: learn: your question => my answer (show learned, unlearn 1)\n\u2022 Timer: timer 5 minutes\n\u2022 Dates: days until 2026-12-25\n\u2022 Fun: joke, motivate me, breathing, flip a coin, password 16\n\u2022 Text: summarize: ..., uppercase: ..., word count: ...\n\u2022 Translate: translate good morning to bangla\n\u2022 Code: build a website, todo app, landing page\n\u2022 Other: again, my mood, call me <name>, open settings";
function findMem(l){
 const q=l.split(/[\s?.,]+/).filter(w=>w.length>2);let best=null,bs=0;
 S.mem.forEach(m=>{const t=m.t.toLowerCase(),sc=q.filter(w=>t.includes(w)).length;if(sc>bs){bs=sc;best=m}});
 return bs?best:null;
}
function local0(t,rt){
 const l=t.toLowerCase().trim();let m;
 if(/^(hi|hello|hey|salam|assalamu|\u09B9\u09CD\u09AF\u09BE\u09B2\u09CB|\u09B9\u09BE\u0987|\u09B8\u09BE\u09B2\u09BE\u09AE|\u0986\u09B8\u09B8\u09BE\u09B2\u09BE\u09AE\u09C1)/.test(l)&&l.length<30)return{t:"Hello "+S.name+"! I'm running offline. Type help to see what I can do."};
 if(/^(thanks|thank you|\u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6)/.test(l))return{t:"You're welcome, "+S.name+"!"};
 if(/^(help|commands|what can you do|\?)$|\u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF/.test(l))return{t:HELP};
 if(m=l.match(/^(?:open|go to|show)\s+(\w+)$/)){if(NAVS[m[1]])return{t:"Opening "+m[1]+"...",go:NAVS[m[1]]}}
 if(/\b(time|date)\b|\u09B8\u09AE\u09AF\u09BC|\u09A4\u09BE\u09B0\u09BF\u0996/.test(l)&&l.length<40)return{t:new Date().toLocaleString("en-GB",{dateStyle:"full",timeStyle:"short"})};
 if(m=l.match(/days?\s+(?:until|to|left)\s+(\d{4}-\d{2}-\d{2})/)){const d=new Date(m[1]+"T00:00:00");if(!isNaN(d)){const n=Math.ceil((d-Date.now())/864e5);return{t:n>=0?n+" day(s) until "+m[1]+".":Math.abs(n)+" day(s) since "+m[1]+"."}}}
 if(m=l.match(/^(?:what is\s+)?(\d+(?:\.\d+)?)\s*(?:%|percent)\s*of\s*(\d+(?:\.\d+)?)\??$/))return{t:"= "+(+(m[1]*m[2]/100).toFixed(8))};
 if(m=l.match(/^(?:convert\s+)?(-?\d+(?:\.\d+)?)\s*([a-z]+)\s+(?:to|in|into)\s+([a-z]+)\??$/)){const v=conv(+m[1],m[2],m[3]);if(v!==null)return{t:m[1]+" "+m[2]+" = "+(+v.toFixed(6))+" "+m[3]}}
 const c=calc(t.replace(/^(calc(ulate)?|what is|\u0995\u09A4)\s*/i,"").replace(/[=?]+$/,""));
 if(c!==null&&/\d\s*[+\-*\/%^\u00D7\u00F7]\s*[\d(]/.test(t))return{t:"= "+(+c.toFixed(10))};
 if(m=t.match(/^(?:add task|todo|task)[:\s]+(?!app\b|website\b|page\b)(.+)/i)){S.tasks.push({t:m[1].slice(0,200)});save();return{t:"Task added. You have "+S.tasks.length+"."}}
 if(/^(?:show |my )?(?:tasks|to-?do list)\??$/.test(l))return{t:S.tasks.length?S.tasks.map((x,i)=>(i+1)+". \u2610 "+x.t).join("\n"):"No tasks. Say: add task <something>."};
 if(m=l.match(/^(?:done|finish|complete|delete task)\s+(\d+)$/)){const i=+m[1]-1;if(S.tasks[i]){const x=S.tasks.splice(i,1)[0];save();return{t:"Done: "+x.t}}return{t:"No task with that number."}}
 if(l==="clear tasks"){S.tasks=[];save();return{t:"All tasks cleared."}}
 if(m=t.match(/^(?:remember|save|\u09AE\u09A8\u09C7 \u09B0\u09BE\u0996\u09CB|\u09B8\u09C7\u09AD \u0995\u09B0)[:\s]+(.+)/i)){S.mem.unshift({id:Date.now(),t:m[1].slice(0,500)});act("Memory saved");save();return{t:"Saved to Memory."}}
 if(m=l.match(/^forget\s+(\d+)$/)){const i=+m[1]-1;if(S.mem[i]){const x=S.mem.splice(i,1)[0];save();return{t:"Forgot: "+x.t}}return{t:"No memory with that number."}}
 if(/^(show |what do you )?(remember|memory|\u09AE\u09C7\u09AE\u09B0\u09BF)\??$/.test(l))return{t:S.mem.length?S.mem.slice(0,8).map((x,i)=>(i+1)+". "+x.t).join("\n"):"Memory is empty. Say: remember <something>."};
 if(m=l.match(/^(?:set\s+)?(?:a\s+)?timer(?:\s+for)?\s+(\d+)\s*(s|sec\w*|m|min\w*|h|hours?)/)){
  const u=m[2][0],ms=Math.min(+m[1]*(u==="h"?3600:u==="m"?60:1),86400)*1000,lab=m[1]+" "+m[2];
  setTimeout(()=>{toast("Timer done: "+lab);navigator.vibrate&&navigator.vibrate(300);if($("#msgs"))addMsg("j","\u23F0 Timer done: "+lab)},ms);
  return{t:"Timer set for "+lab+". Keep this page open."};
 }
 if(/flip.*coin|coin flip/.test(l))return{t:rnd(2)?"Heads":"Tails"};
 if(/roll.*(dice|die)|^dice$/.test(l))return{t:"\uD83C\uDFB2 "+(rnd(6)+1)};
 if(m=l.match(/random number(?: between)?\s*(\d+)\s*(?:to|and|-)\s*(\d+)/)){const a=Math.min(+m[1],+m[2]),b=Math.max(+m[1],+m[2]);return{t:String(a+rnd(b-a+1))}}
 if(m=l.match(/^(?:generate\s+)?password(?:\s+(\d+))?$/)){const n=Math.max(8,Math.min(+m[1]||16,64)),cs="abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*?";let o="";for(let i=0;i<n;i++)o+=cs[rnd(cs.length)];return{t:"Generated on this device. I don't save it.",code:o}}
 if(m=t.match(/^(uppercase|lowercase|reverse|word count|count words|summari[sz]e)[:\s]+([\s\S]+)/i)){const k=m[1].toLowerCase(),x=m[2].trim();
  return{t:k==="uppercase"?x.toUpperCase():k==="lowercase"?x.toLowerCase():k==="reverse"?[...x].reverse().join(""):k.startsWith("summ")?summ(x):x.split(/\s+/).length+" words, "+x.length+" characters"}}
 if(m=t.match(/^translate\s+(.+?)\s+(?:to|in|into)\s+(bangla|bengali|english)\??$/i)||(()=>{const z=t.match(/^translate to (english|bangla|bengali)[:\s]+(.+)/i);return z&&[0,z[2],z[1]]})()){
  const k=m[1].trim().toLowerCase().replace(/[.!?]+$/,""),toEn=/english/i.test(m[2]),r=toEn?PHR[m[1].trim().replace(/[.!?\u0964]+$/,"")]:PH[k];
  return{t:r||"I only know common phrases offline (hello, thank you, good morning...). Connect Gemini in Models for full translation."};
 }
 if(!S.connected&&/website|html|\u0993\u09AF\u09BC\u09C7\u09AC\u09B8\u09BE\u0987\u099F|landing|to-?do app/.test(l)&&(rt.cat==="Coding"||/to-?do app|landing/.test(l))){
  const todo=/to-?do/.test(l),land=/landing/.test(l);
  return{t:"Here's a "+(todo?"working to-do app":land?"landing page":"clean starter page")+". Save it as index.html, then tell me what to add.",code:todo?TODO:land?LAND:STARTER};
 }
 if(/^(what|when|where|who|which|my|remind)\b|\u0986\u09AE\u09BE\u09B0|\u0995\u09AC\u09C7|\u0995\u09CB\u09A5\u09BE\u09AF\u09BC/.test(l)){const f=findMem(l);if(f)return{t:"From your Memory: "+f.t}}
 return null;
}
const JOKES=["Why do programmers prefer dark mode? Because light attracts bugs.","I told my computer I needed a break. It said: no problem, I'll go to sleep.","A SQL query walks into a bar, sees two tables and asks: can I join you?","There are 10 kinds of people: those who understand binary and those who don't.","Why did the developer go broke? He used up all his cache."];
const PEP=["Small steps still move you forward, {n}.","You don't have to do it all today. Pick one thing and start.","Progress, not perfection. You're doing better than you think.","Rest if you must, but don't quit.","Every expert was once a beginner. Keep going, {n}."];
const BREATH="Let's breathe together:\n1. Inhale through your nose for 4 seconds\n2. Hold for 4 seconds\n3. Exhale slowly for 6 seconds\nRepeat 5 times and relax your shoulders.";
const EM=[
["angry",/\b(angry|furious|annoyed|irritated|frustrated|hate)\b|\u09B0\u09BE\u0997|\u09AC\u09BF\u09B0\u0995\u09CD\u09A4/,["I hear you, {n}. That sounds really frustrating. Want to vent for a minute? I'm listening.","Anger makes sense when things feel unfair. Take one slow breath with me, then tell me what happened."],"\u09AC\u09C1\u099D\u09A4\u09C7 \u09AA\u09BE\u09B0\u099B\u09BF, \u09AC\u09CD\u09AF\u09BE\u09AA\u09BE\u09B0\u099F\u09BE \u0996\u09C1\u09AC\u0987 \u09AC\u09BF\u09B0\u0995\u09CD\u09A4\u09BF\u09B0\u0964 \u098F\u0995\u099F\u09C1 \u09A7\u09C0\u09B0\u09C7 \u09B6\u09CD\u09AC\u09BE\u09B8 \u09A8\u09BE\u0993, \u09A4\u09BE\u09B0\u09AA\u09B0 \u09AC\u09B2\u09CB \u0995\u09C0 \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964",["Breathing exercise","Motivate me"]],
["stress",/\b(stress(ed)?|anxious|anxiety|worried|nervous|overwhelmed|panic|tension)\b|\u099F\u09C7\u09A8\u09B6\u09A8|\u099A\u09BF\u09A8\u09CD\u09A4\u09BE|\u09A6\u09C1\u09B6\u09CD\u099A\u09BF\u09A8\u09CD\u09A4\u09BE/,["That sounds like a lot, {n}. You don't have to solve everything at once. Want to try a quick breathing exercise?","Feeling overwhelmed is tough. Let's shrink it: tell me the one thing worrying you most."],"\u0985\u09A8\u09C7\u0995 \u099A\u09BE\u09AA \u0985\u09A8\u09C1\u09AD\u09AC \u0995\u09B0\u099B\u09CB, \u09AC\u09C1\u099D\u09A4\u09C7 \u09AA\u09BE\u09B0\u099B\u09BF\u0964 \u098F\u0995\u09B8\u09BE\u09A5\u09C7 \u09B8\u09AC \u09B8\u09AE\u09BE\u09A7\u09BE\u09A8 \u0995\u09B0\u09A4\u09C7 \u09B9\u09AC\u09C7 \u09A8\u09BE\u0964 \u098F\u0995\u099F\u09BE \u09B6\u09CD\u09AC\u09BE\u09B8\u09C7\u09B0 \u09AC\u09CD\u09AF\u09BE\u09AF\u09BC\u09BE\u09AE \u0995\u09B0\u09AC\u09C7?",["Breathing exercise","add task plan my day"]],
["sad",/\b(sad|down|depressed|unhappy|crying|heartbroken)\b|\u09AE\u09A8 \u0996\u09BE\u09B0\u09BE\u09AA|\u0995\u09B7\u09CD\u099F|\u09A6\u09C1\u0983\u0996|\u0995\u09BE\u09A8\u09CD\u09A8\u09BE/,["I'm sorry you're feeling this way, {n}. I'm here. Do you want to talk about it?","That sounds heavy. It's okay to feel it. I'm listening whenever you're ready."],"\u09A4\u09CB\u09AE\u09BE\u09B0 \u09AE\u09A8 \u0996\u09BE\u09B0\u09BE\u09AA \u09B6\u09C1\u09A8\u09C7 \u0996\u09BE\u09B0\u09BE\u09AA \u09B2\u09BE\u0997\u099B\u09C7\u0964 \u0986\u09AE\u09BF \u098F\u0996\u09BE\u09A8\u09C7 \u0986\u099B\u09BF, \u099A\u09BE\u0987\u09B2\u09C7 \u09AC\u09B2\u09CB\u0964",["Tell me a joke","Motivate me"]],
["lonely",/\b(lonely|alone|isolated)\b|\u098F\u0995\u09BE/,["Feeling alone is hard, {n}. I'm here with you right now. Reaching out to a friend or family member can help too.","You matter, and I'm glad you told me. Want to chat for a while?"],"\u098F\u0995\u09BE \u09B2\u09BE\u0997\u09BE \u0996\u09C1\u09AC \u0995\u09B7\u09CD\u099F\u09C7\u09B0\u0964 \u0986\u09AE\u09BF \u098F\u0996\u09BE\u09A8\u09C7 \u0986\u099B\u09BF\u0964 \u0995\u09CB\u09A8\u09CB \u09AC\u09A8\u09CD\u09A7\u09C1 \u09AC\u09BE \u09AA\u09B0\u09BF\u09AC\u09BE\u09B0\u09C7\u09B0 \u0995\u09BE\u0989\u0995\u09C7 \u09AC\u09B2\u09A4\u09C7\u0993 \u09AA\u09BE\u09B0\u09CB\u0964",["Tell me a joke","Motivate me"]],
["tired",/\b(tired|exhausted|sleepy|burn(ed|t) out|drained)\b|\u0995\u09CD\u09B2\u09BE\u09A8\u09CD\u09A4|\u0998\u09C1\u09AE/,["You sound worn out, {n}. A short break or some water might help. Want a 20 minute timer?","Rest is productive too. Be kind to yourself today."],"\u0995\u09CD\u09B2\u09BE\u09A8\u09CD\u09A4 \u09B2\u09BE\u0997\u099B\u09C7 \u09AC\u09C1\u099D\u09A4\u09C7 \u09AA\u09BE\u09B0\u099B\u09BF\u0964 \u098F\u0995\u099F\u09C1 \u09AC\u09BF\u09B6\u09CD\u09B0\u09BE\u09AE \u09A8\u09BE\u0993\u0964",["timer 20 minutes","Motivate me"]],
["happy",/\b(happy|great|awesome|amazing|excited|yay|glad|wonderful|good news|proud)\b|\u0996\u09C1\u09B6\u09BF|\u0986\u09A8\u09A8\u09CD\u09A6|\u09A6\u09BE\u09B0\u09C1\u09A3|\u09AE\u099C\u09BE/,["That's wonderful, {n}! I'm happy for you. What made your day?","Love that energy! Let's make the most of it."],"\u09B6\u09C1\u09A8\u09C7 \u0996\u09C1\u09AC \u09AD\u09BE\u09B2\u09CB \u09B2\u09BE\u0997\u09B2\u09CB! \u0995\u09C0 \u09B9\u09AF\u09BC\u09C7\u099B\u09C7 \u09AC\u09B2\u09CB \u09A4\u09CB\u0964",["Tell me a joke","my mood"]]];
const norm=x=>x.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim();
function sim(a,b){const A=new Set(norm(a).split(" ")),B=new Set(norm(b).split(" "));let i=0;A.forEach(w=>B.has(w)&&i++);return i/(A.size+B.size-i||1)}
function setMood(m){S.moods.unshift({m,at:Date.now()});S.moods=S.moods.slice(0,60);save();const o=$("#orb");if(o&&S.moodfx)o.dataset.m=m}
function local(t,rt){
 const l=t.toLowerCase().trim(),bn=/[\u0980-\u09FF]/.test(t),n=S.name;let m;
 if(/kill myself|suicide|end my life|want to die|self.?harm|\u0986\u09A4\u09CD\u09AE\u09B9\u09A4\u09CD\u09AF\u09BE|\u09AE\u09B0\u09C7 \u09AF\u09C7\u09A4\u09C7 \u099A\u09BE\u0987|\u09AC\u09BE\u0981\u099A\u09A4\u09C7 \u099A\u09BE\u0987 \u09A8\u09BE/.test(l))return{nofb:true,t:bn?"\u0986\u09AE\u09BF \u0996\u09C1\u09AC \u09A6\u09C1\u0983\u0996\u09BF\u09A4, \u09A4\u09C1\u09AE\u09BF \u0995\u09B7\u09CD\u099F\u09C7 \u0986\u099B\u09CB\u0964 \u09A4\u09C1\u09AE\u09BF \u098F\u0996\u09A8\u0987 \u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF \u09AA\u09BE\u0993\u09AF\u09BC\u09BE\u09B0 \u09AF\u09CB\u0997\u09CD\u09AF\u0964 \u09AC\u09BF\u09B6\u09CD\u09AC\u09BE\u09B8\u09C0 \u0995\u09BE\u0989\u0995\u09C7 \u0986\u099C\u0987 \u09AC\u09B2\u09CB, \u09AC\u09BE \u09AE\u09BE\u09A8\u09B8\u09BF\u0995 \u09B8\u09B9\u09BE\u09AF\u09BC\u09A4\u09BE \u09B2\u09BE\u0987\u09A8 \u0993 \u099C\u09B0\u09C1\u09B0\u09BF \u09B8\u09C7\u09AC\u09BE\u09AF\u09BC \u09AF\u09CB\u0997\u09BE\u09AF\u09CB\u0997 \u0995\u09B0\u09CB\u0964 \u098F\u0996\u09A8\u0987 \u09AC\u09BF\u09AA\u09A6\u09C7 \u09A5\u09BE\u0995\u09B2\u09C7 \u099C\u09B0\u09C1\u09B0\u09BF \u09A8\u09AE\u09CD\u09AC\u09B0\u09C7 \u09AB\u09CB\u09A8 \u0995\u09B0\u09CB\u0964 \u0986\u09AE\u09BF \u098F\u0996\u09BE\u09A8\u09C7 \u0986\u099B\u09BF, \u099A\u09BE\u0987\u09B2\u09C7 \u0995\u09A5\u09BE \u09AC\u09B2\u09CB\u0964":"I'm really sorry you're hurting, "+n+". You deserve support right now. Please tell someone you trust today, or contact a local crisis line or emergency services. If you're in immediate danger, call your local emergency number. I'm here to talk too."};
 if(/^(hi|hello|hey|salam|assalamu|\u09B9\u09CD\u09AF\u09BE\u09B2\u09CB|\u09B9\u09BE\u0987|\u09B8\u09BE\u09B2\u09BE\u09AE|\u0986\u09B8\u09B8\u09BE\u09B2\u09BE\u09AE\u09C1)/.test(l)&&l.length<30){const h=new Date().getHours();return{t:(h<12?"Good morning":h<17?"Good afternoon":"Good evening")+", "+n+"! How are you feeling today?",chips:["I feel great","I feel stressed","help"]}}
 if(m=t.match(/^(?:my name is|call me|\u0986\u09AE\u09BE\u09B0 \u09A8\u09BE\u09AE)\s+(.{1,30})$/i)){if(!looksSecret(m[1])){S.name=m[1].trim();save();return{t:"Nice to meet you, "+S.name+"!"}}}
 if(/^(again|repeat|\u0986\u09AC\u09BE\u09B0)$/.test(l)){const pv=[...S.chat].reverse().filter(x=>x.r==="u").slice(1).find(x=>!/^(again|repeat)$/i.test(x.t));return pv?(local(pv.t,route(pv.t))||{t:"I have nothing new to say about that."}):{t:"Nothing to repeat yet."}}
 if(m=t.match(/^(?:learn|teach)[:\s]+(.+?)\s*(?:=>|->|=)\s*([\s\S]+)$/i)){if(looksSecret(t))return{t:"That looks like a secret. I won't learn it."};S.learned=S.learned.filter(x=>norm(x.q)!==norm(m[1]));S.learned.unshift({q:m[1].trim().slice(0,120),a:m[2].trim().slice(0,500)});S.learned=S.learned.slice(0,100);save();return{t:"Learned! Ask me \""+m[1].trim()+"\" any time."}}
 if(/^(show learned|what have you learned)$/.test(l))return{t:S.learned.length?S.learned.map((x,i)=>(i+1)+". "+x.q+" => "+x.a).join("\n"):"Nothing yet. Teach me: learn: your question => my answer"};
 if(m=l.match(/^unlearn\s+(\d+)$/)){const i=+m[1]-1;if(S.learned[i]){const x=S.learned.splice(i,1)[0];save();return{t:"Forgot: "+x.q}}return{t:"No taught answer with that number."}}
 if(/joke|\u099C\u09CB\u0995/.test(l)&&l.length<30)return{t:choose(JOKES),chips:["Another joke","Motivate me"]};
 if(/motivate|inspire me|\u0989\u09CE\u09B8\u09BE\u09B9/.test(l)&&l.length<30)return{t:choose(PEP).replace("{n}",n),chips:["Motivate me again","Tell me a joke"]};
 if(/breath(e|ing)/.test(l)&&l.length<30)return{t:BREATH,mood:"stress"};
 if(/^(my mood|mood|how have i been)\??$/.test(l)){const c={};S.moods.slice(0,30).forEach(x=>c[x.m]=(c[x.m]||0)+1);const k=Object.keys(c);return{t:k.length?"Your last check-ins: "+k.map(x=>x+" "+c[x]).join(", ")+". Latest: "+S.moods[0].m+".":"No mood check-ins yet. Tell me how you feel, like: I feel happy."}}
 if(!/^learn/.test(l)){let best=null,bs=0;S.learned.forEach(x=>{const v=sim(t,x.q);if(v>bs){bs=v;best=x}});if(best&&bs>=.75)return{t:best.a}}
 if(t.length<220&&(/\b(i|i'm|im|feel|feeling|so|very|really)\b|\u0986\u09AE\u09BF|\u09B2\u09BE\u0997\u099B\u09C7|\u09AE\u09A8/.test(l)||l.split(/\s+/).length<=4)){
  for(const e of EM)if(e[1].test(l))return{t:(bn?e[3]:choose(e[2])).replace("{n}",n),mood:e[0],chips:e[4]};
 }
 return local0(t,rt);
}
