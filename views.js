"use strict";
// views.js - screens (dashboard, settings, API, skills, memory, history ...)
/* ---------- views ---------- */
let cur="chat",lastV="",mode="chat";
const WORKS=["Coding","Web Development","Research","Writing","Translation","Data Analysis","Document Creation","Image Generation","Voice Assistant","Memory"];
const SKMAP={Coding:"coding","Web Development":"webdev",Research:"research",Writing:"writing",Translation:"translation","Data Analysis":"data","Document Creation":"docs"};
const SKD={Coding:"Expert coding help. Needs Gemini.","Web Development":"Responsive websites and UI. Needs Gemini.",Research:"Fact-focused answers. Needs Gemini.",Writing:"Polished writing in your tone. Needs Gemini.",Translation:"Bangla and English translation. Needs Gemini.","Data Analysis":"Analyze numbers and tables. Needs Gemini.","Document Creation":"Reports and letters. Needs Gemini.","Image Generation":"Unlocks the Create image button. Needs Gemini.","Voice Assistant":"Reads replies aloud. Works offline.",Memory:"Shares your Memory notes with Gemini for better answers.",GitHub:"Planned: needs GitHub sign-in.",Browser:"Planned: needs a browser extension.","File Management":"Planned: needs file access.",Automation:"Planned: needs a backend."};
const TG=(id,l,d,v)=>`<label class="tog" style="margin-top:10px"><span>${l}<br><span class="note">${d}</span></span><input type="checkbox" id="${id}" ${v?"checked":""}></label>`;
function buildNav(){
 const n=$("#nav");n.querySelectorAll("button").forEach(b=>b.remove());
 VIEWS.forEach(([id,t,hid])=>{if(hid)return;const b=document.createElement("button");b.textContent=t;b.dataset.id=id;b.className=(id===cur||(id==="set"&&ST.includes(cur)))?"on":"";b.onclick=()=>{cur=id;location.hash=id;$("#nav").classList.remove("open");$("#scrim").classList.remove("on");render()};n.appendChild(b)});
}
const pending=()=>S.updates.filter(u=>u.status==="Waiting for approval").length;
function head(t,s){return`<h1>${t}</h1><p class="sub">${s}</p>`}
const V={
home(){
 const sk=Object.keys(S.skills).length;
 return head("Dashboard","Your system at a glance. Nothing changes without your approval.")+`<div class="grid">
 <div class="card"><h3>Gemini</h3><div class="big">${S.connected?"Connected":"Not connected"}</div><p class="note">${S.connected?"Last test succeeded.":"Add your Worker URL in Settings > API, then run the test."}</p></div>
 <div class="card"><h3>Skills enabled</h3><div class="big">${sk} / ${SKILLS.length}</div><p class="note">Enabled skills shape how JARVIS answers.</p></div>
 <div class="card"><h3>Waiting for approval</h3><div class="big">${pending()}</div><p class="note"><a href="#updates" style="color:var(--acc)">Open the approval center</a></p></div>
 <div class="card"><h3>Brain</h3><div class="big">${S.learned.length} taught</div><p class="note">Replies rated: ${S.fb.up} up, ${S.fb.down} down.${S.moods[0]?" Latest mood: "+esc(S.moods[0].m)+".":""}</p></div>
 <div class="card"><h3>Memory items</h3><div class="big">${S.mem.length}</div><p class="note">Stored in this browser only.</p></div></div>
 <div class="card" style="margin-top:14px"><h3>Recent activity</h3><div class="list">${S.log.slice(0,6).map(l=>`<div class="row"><span>${esc(l.t)}</span><span class="note">${esc(l.at)}</span></div>`).join("")||'<p class="note">No activity yet. Ask JARVIS something in Assistant.</p>'}</div></div>`;
},
chat(){
 const has=S.chat.length>0;
 const SUGS=[["Build a website for me","Build a website for ","g"],["Research a topic","Research ","b"],["Translate text","Translate to English: ","p"],["Write an email","Write an email about ","o"]];
 return`<div class="chat"><div class="orbw ${has?"sm":""}"><div class="orb" id="orb"></div></div>
 ${has?"":`<div class="welcome" id="welcome"><div class="hi">Hi ${esc(S.name)}</div><h1 class="grad">Welcome to JARVIS</h1><p class="q">How can I assist you today?</p><div class="sugs">${SUGS.map(x=>`<button class="sg ${x[2]}" data-s="${esc(x[1])}">${x[0]}<b>+</b></button>`).join("")}</div>${recent()}</div>`}
 <div class="msgs" id="msgs"></div>
 <div class="dock"><div class="tray" id="tray"></div><div class="pill"><button id="att" aria-label="Attach">+</button><textarea id="inp" rows="1" maxlength="4000" placeholder="Message JARVIS..." aria-label="Command"></textarea><button id="mic" aria-label="Voice typing">&#127908;</button><button class="p" id="send" aria-label="Send">&#10148;</button></div>
 <div class="chips"><button data-o="1">Attach file</button>${[["reason","Reasoning"],["image","Create image"],["research","Deep research"]].map(c=>`<button data-md="${c[0]}" class="${mode===c[0]?"on":""}">${c[1]}</button>`).join("")}</div></div>
 <div class="sheet" id="sheet" hidden></div></div>`;
},
history(){
 return head("History","Your saved chats stay on this device.")+`<input id="hs" placeholder="Search chats" style="margin-bottom:14px" aria-label="Search chats"><div class="list" id="hl"></div><div style="margin-top:14px"><button class="g" id="hclr">Delete all chats</button></div>`;
},
models(){
 const ok=S.connected,row=(n,d,t,c)=>`<div class="row"><span>${n}${d?`<br><span class="note">${d}</span>`:""}</span><span class="tag ${c}">${t}</span></div>`;
 const cap=[["Chat with the last messages as context",ok],["Reasoning mode",ok],["Deep research with sources",ok],["Create image (needs Image Generation skill)",ok&&!!S.skills["Image Generation"]],["Read attachments (needs the toggle below)",ok&&S.sendFiles]];
 return head("API","Everything that connects JARVIS to outside AI lives here.")+`
 <div class="card list"><div class="row"><h3>Gemini (Google)</h3><span class="tag ${ok?"ok":""}">${ok?"Connected":"Not connected"}</span></div>
 <input id="wurl" placeholder="https://your-worker.workers.dev" value="${esc(S.worker)}" aria-label="Worker URL">
 <input id="wtok" type="password" autocomplete="off" placeholder="Access passcode" value="${esc(S.token)}" aria-label="Access passcode">
 ${TG("sf","Send attachments to Gemini","Off keeps files on this device",S.sendFiles)}
 <div class="row"><button class="p" id="test">Test connection</button><button id="disc">Disconnect</button></div></div>
 <div class="card list" style="margin-top:14px"><h3>What works right now</h3>${cap.map(c=>row(c[0],"",c[1]?"Ready":"Off",c[1]?"ok":"")).join("")}</div>
 <div class="card list" style="margin-top:14px"><h3>Other providers</h3>${["ChatGPT","Claude","DeepSeek"].map(n=>row(n,"Needs its own Worker route","Not available","")).join("")}</div>
 <details class="card" style="margin-top:14px"><summary>Setup guide</summary><ol class="note" style="padding-left:18px;margin-top:8px"><li>Get a key at aistudio.google.com.</li><li>Cloudflare: Workers and Pages, Create, Worker, paste worker.js, Deploy.</li><li>Worker Settings, Variables and Secrets: GEMINI_API_KEY (secret), APP_TOKEN (secret passcode), ALLOWED_ORIGIN (your GitHub Pages address).</li><li>Paste the Worker URL and passcode above, then Test connection.</li></ol></details>`;
},
skills(){
 return head("Skills","Installing a skill creates a proposal. It takes effect after you approve it.")+`<div class="grid">${SKILLS.map(s=>{
  const on=!!S.skills[s],wait=S.updates.some(u=>u.target===s&&u.status==="Waiting for approval"),ok=WORKS.includes(s);
  return`<div class="card"><div class="row"><h3>${s}</h3><span class="tag ${on?"ok":wait?"warn":""}">${on?"Enabled":wait?"Awaiting approval":ok?"Not installed":"Planned"}</span></div><p class="note">${SKD[s]}</p><div class="row" style="margin-top:10px">${on?`<button data-sk="${s}" data-a="off">Disable</button>`:`<button class="p" data-sk="${s}" data-a="on" ${wait||!ok?"disabled":""}>Install</button>`}</div></div>`}).join("")}</div>`;
},
updates(){
 return head("Update approval center","Review every change before it is applied.")+`<div class="row" style="margin-bottom:14px"><button class="p" id="analyze">Analyze JARVIS</button><span class="note">Prepares improvement proposals. It never applies them.</span></div>
 <div class="list">${S.updates.map(u=>{
  const w=u.status==="Waiting for approval",done=u.status==="Completed";
  return`<div class="card"><div class="row"><h3>${esc(u.title)}</h3><span class="tag ${done?"ok":w?"warn":u.status==="Rejected"||u.status==="Rolled back"?"bad":""}">${u.status}</span></div><p class="note">${esc(u.at)}</p><pre>${esc(u.diff).split("\n").map(l=>l[0]==="+"?`<span class="ins">${l}</span>`:l[0]==="-"?`<span class="del">${l}</span>`:l).join("\n")}</pre>
  <div class="row" style="margin-top:10px;justify-content:flex-start">${w?`<button class="p" data-u="${u.id}" data-a="ok">Approve</button><button class="g" data-u="${u.id}" data-a="no">Reject</button>`:""}${done?`<button data-u="${u.id}" data-a="rb">Roll back</button>`:""}</div></div>`}).join("")||'<div class="card"><p class="note">No updates yet. Run Analyze JARVIS or install a skill.</p></div>'}</div>`;
},
memory(){
 return head("Memory","Saved in this browser only. Delete anything at any time.")+`<div class="row" style="margin-bottom:14px;flex-wrap:nowrap"><input id="mi" placeholder="Save a note or project detail" aria-label="New memory"><button class="p" id="madd">Save</button></div><input id="ms" placeholder="Search memory" style="margin-bottom:14px" aria-label="Search memory"><div class="list" id="mlist"></div>`;
},
diag(){
 return head("Diagnostics","Real checks of this page and your browser.")+`<button class="p" id="run" style="margin-bottom:14px">Run checks</button><div class="list" id="dres"></div>`;
},
set(){
 const T=(id,l,d,v)=>`<label class="tog"><span>${l}<br><span class="note">${d}</span></span><input type="checkbox" id="${id}" ${v?"checked":""}></label>`;
 return head("General","Look, voice and behavior.")+`<div class="card list"><label>Your name<input id="nm" value="${esc(S.name)}" maxlength="30"></label><label>Theme<select id="th"><option value="auto">Adaptive</option><option value="light">Premium Light</option><option value="dark">Premium Dark</option></select></label><label>Voice language<select id="lg"><option value="bn-BD">Bangla</option><option value="en-US">English</option></select></label>${T("tfx","Background animation","Aurora and particle network",S.fx)}${T("tty","Typing effect","Replies appear letter by letter",S.typing)}${T("tmf","Mood colors","The orb changes color with your mood",S.moodfx)}</div>
 <div class="card list" style="margin-top:14px"><h3>App lock</h3><input id="pin" type="password" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="${S.lock?"New PIN (4-8 digits)":"Choose a PIN (4-8 digits)"}" aria-label="PIN"><div class="row" style="justify-content:flex-start"><button id="pinset">${S.lock?"Change PIN":"Turn on lock"}</button>${S.lock?'<button class="g" id="pinoff">Turn off</button>':""}</div><p class="note">Locks after 1 minute away. It stops casual access, not someone using developer tools on your browser.</p></div>
 <div class="card list" style="margin-top:14px"><h3>Security and data</h3><p class="note">Strict content policy, no API keys stored, files stay on this device, rate limits and request timeouts are on.</p><div class="row" style="justify-content:flex-start"><button id="exp">Export data</button><button id="imp">Import data</button><button class="g" id="rst">Reset all data</button></div></div>`;
}};
