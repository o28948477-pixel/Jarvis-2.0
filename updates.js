"use strict";
// updates.js - approval workflow (updates, approve, reject, roll back)
/* ---------- updates (approval workflow) ---------- */
const FLOW=["Detected","Preparing","Waiting for approval","Approved","Applying","Testing","Completed"];
function propose(title,kind,diff){
 const u={id:Date.now()+Math.random(),title,kind,diff,status:"Waiting for approval",at:new Date().toLocaleString()};
 S.updates.unshift(u);act("Proposal created: "+title);save();return u;
}
function setStatus(u,s){u.status=s;save();if(cur==="updates")render()}
function approve(id){
 const u=S.updates.find(x=>x.id==id);if(!u)return;
 act("Approved: "+u.title);setStatus(u,"Approved");
 setTimeout(()=>setStatus(u,"Applying"),600);
 setTimeout(()=>{
  setStatus(u,"Testing");
  setTimeout(()=>{
   if(u.kind==="skill"){S.skills[u.target]=true}
   if(u.kind==="theme"){S.theme=u.target;applyTheme()}
   setStatus(u,"Completed");act("Completed: "+u.title);toast("Update completed")
  },700)
 },1300);
}
function reject(id){const u=S.updates.find(x=>x.id==id);setStatus(u,"Rejected");act("Rejected: "+u.title)}
function rollback(id){
 const u=S.updates.find(x=>x.id==id);
 if(u.kind==="skill")delete S.skills[u.target];
 if(u.kind==="theme"){S.theme=u.prev||"auto";applyTheme()}
 setStatus(u,"Rolled back");act("Rolled back: "+u.title)
}
function selfAnalyze(){
 const ideas=[];
 if(!S.worker)ideas.push(["Set up the Gemini connection","config","+ Worker URL saved in Settings\n+ Connection test runs before status changes"]);
 if(S.theme==="auto")ideas.push(["Switch to Premium Light theme","theme","- theme: auto\n+ theme: light"]);
 if(!S.mem.length)ideas.push(["Save a first project memory","memory","+ Memory: JARVIS blueprint v1.0 summary"]);
 if(!ideas.length)ideas.push(["Review security checklist","config","+ Quarterly review reminder"]);
 ideas.forEach(i=>{const u=propose(i[0],i[1],i[2]);if(i[1]==="theme"){u.target="light";u.prev=S.theme}});
 save();toast(ideas.length+" proposal(s) waiting for your approval");render();
}
