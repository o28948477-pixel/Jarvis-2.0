"use strict";
// api.js - API: Worker connection, test and requests
const SECRET=/AIza[\w-]{20,}|sk-[\w-]{20,}|ghp_\w{20,}|(?:api[_-]?key|secret|token|password)\s*[:=]\s*\S{12,}/i;
const looksSecret=t=>SECRET.test(t);
function okUrl(u){try{const x=new URL(u);return x.protocol==="https:"&&!x.username&&!x.password&&x.hostname.endsWith(".workers.dev")&&u.length<300}catch(e){return false}}
async function post(P){
 const c=ctl=new AbortController(),to=setTimeout(()=>c.abort(),60000);
 try{
  const r=await fetch(S.worker,{method:"POST",headers:{"Content-Type":"application/json","X-Jarvis-Token":S.token},body:JSON.stringify(P),signal:c.signal,credentials:"omit",referrerPolicy:"no-referrer",cache:"no-store",redirect:"error"});
  let d={};try{d=JSON.parse((await r.text()).slice(0,12000000))}catch(e){}
  if(!r.ok)throw new Error(typeof d.error==="string"?d.error.slice(0,120):"HTTP "+r.status);
  if(typeof d.reply!=="string"&&!d.image)throw new Error("Unexpected response from Worker");
  return{reply:typeof d.reply==="string"?d.reply.slice(0,12000):"",image:d.image,sources:Array.isArray(d.sources)?d.sources:[]};
 }catch(e){throw new Error(e.name==="AbortError"?(stopped?"Stopped":"Timed out after 60s"):e.message)}finally{clearTimeout(to)}
}
async function testConn(){
 const u=$("#wurl").value.trim();
 if(looksSecret(u)){toast("That looks like a secret. Paste only the Worker URL.");return}
 if(!okUrl(u)){toast("Enter a valid https://...workers.dev Worker URL (other domains are blocked by the security policy)");return}
 const tk=($("#wtok").value||"").trim();if(!/^[\x21-\x7E]{1,200}$/.test(tk)){toast("Enter your access passcode (letters, numbers, symbols; no spaces)");return}
 S.worker=u;S.token=tk;toast("Testing...");
 try{await post({prompt:"Reply with the word OK",mode:"chat"});S.connected=true;act("Gemini connected");toast("Connected")}
 catch(e){S.connected=false;act("Gemini test failed");toast("Test failed: "+e.message)}
 save();render();
}
