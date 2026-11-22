"use strict";
// main.js - startup: buttons, first chat, lock, first draw
/* ---------- boot ---------- */
applyTheme();
$("#burger").onclick=()=>{$("#nav").classList.add("open");$("#scrim").classList.add("on")};
$("#scrim").onclick=()=>{$("#nav").classList.remove("open");$("#scrim").classList.remove("on")};
$("#hist").onclick=()=>{cur="history";render()};$("#newc").onclick=()=>newChat(true);
$("#bell").onclick=()=>{cur="updates";location.hash="updates";render()};
if(location.hash)history.replaceState(null,"",location.pathname+location.search);
startChat();
addEventListener("hashchange",()=>{const x=location.hash.slice(1);if(VIEWS.some(v=>v[0]===x)&&x!==cur){cur=x;render()}});
if(S.lock)showLock();
render();
$("#boot")&&$("#boot").remove();
setTimeout(()=>{const x=$("#splash");x&&x.remove()},matchMedia("(prefers-reduced-motion:reduce)").matches?0:1700);
