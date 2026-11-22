"use strict";
// lock.js - PIN app lock
/* ---------- app lock ---------- */
const b64=a=>btoa(String.fromCharCode(...new Uint8Array(a))),unb=x=>Uint8Array.from(atob(x),c=>c.charCodeAt(0));
async function hashPin(pin,salt){const k=await crypto.subtle.importKey("raw",new TextEncoder().encode(pin),"PBKDF2",false,["deriveBits"]);return b64(await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations:150000,hash:"SHA-256"},k,256))}
async function setPin(pin){const salt=crypto.getRandomValues(new Uint8Array(16));S.lock={s:b64(salt),h:await hashPin(pin,salt)};save()}
function showLock(){
 if(!S.lock||$("#lock"))return;
 const d=document.createElement("div");d.id="lock";
 d.innerHTML='<div class="card"><h3>JARVIS is locked</h3><input id="lpin" type="password" inputmode="numeric" autocomplete="off" placeholder="PIN" aria-label="PIN"><p class="note" id="lmsg"></p><button class="p" id="lgo">Unlock</button></div>';
 document.body.appendChild(d);
 const go=async()=>{
  try{
   const lu=+localStorage.getItem("jarvis_lu")||0;
   if(Date.now()<lu){$("#lmsg").textContent="Too many tries. Wait "+Math.ceil((lu-Date.now())/1000)+" seconds.";return}
   if((await hashPin($("#lpin").value,unb(S.lock.s)))===S.lock.h){localStorage.removeItem("jarvis_f");d.remove()}
   else{const f=(+localStorage.getItem("jarvis_f")||0)+1;localStorage.setItem("jarvis_f",f);if(f%5===0)localStorage.setItem("jarvis_lu",Date.now()+30000*(f/5));$("#lmsg").textContent="Wrong PIN";$("#lpin").value=""}
  }catch(e){$("#lmsg").textContent="Couldn't check the PIN here. Use https."}
 };
 $("#lgo").onclick=go;$("#lpin").onkeydown=e=>{if(e.key==="Enter")go()};$("#lpin").focus();
}
let hid=0;document.addEventListener("visibilitychange",()=>{if(document.hidden)hid=Date.now();else if(S.lock&&hid&&Date.now()-hid>60000)showLock()});
