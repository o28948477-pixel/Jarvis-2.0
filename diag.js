"use strict";
// diag.js - diagnostics checks
function runDiag(){
 const rec=window.SpeechRecognition||window.webkitSpeechRecognition;
 const c=[
  ["Browser storage",storeOK,"Saving works.","Storage is blocked. Memory and settings won't persist."],
  ["Script errors",errCount===0,"No errors since page load.",errCount+" error(s) since page load."],
  ["Internet connection",navigator.onLine,"Online.","Offline. Model calls will fail."],
  ["Voice input",!!rec,"Supported in this browser.","Not supported. Try Chrome on Android."],
  ["Secure connection (https)",isSecureContext,"Mic and recording can work.","Not secure. Voice and recording are blocked. Use your GitHub Pages link."],["Voice recording",!!window.MediaRecorder,"Supported.","Not supported in this browser."],["Gemini Worker URL",!!S.worker,"URL saved.","Not set. Add it in Models."],
  ["Gemini connection",S.connected,"Last test succeeded.","Not verified."],
  ["Screen width",true,innerWidth+" px ("+(innerWidth<761?"mobile":"desktop")+" layout).",""]
 ];
 $("#dres").innerHTML=c.map(([n,ok,a,b])=>`<div class="card row"><span>${n}<br><span class="note">${ok?a:b}</span></span><span class="tag ${ok?"ok":"warn"}">${ok?"Pass":"Check"}</span></div>`).join("");
 act("Diagnostics run");
}
