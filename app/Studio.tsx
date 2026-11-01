"use client";
import {LanguageMenu,useLocale} from "./Locale";
import {Translation} from "./Translation";
import {useState,useEffect,useRef} from "react";
import {ArrowDown,ArrowRight,ArrowLeft,Phone,Headphones,PencilLine,Radio,Snowflake,Mail,Check,RefreshCw,Send,BookOpen,Star,ChevronRight,PhoneCall,Feather} from "lucide-react";
import {blank,message,script,wishes,wishText,roles,tones,valid,type Draft,type Gift} from "../lib/gift";
import {sample,sourceLabel} from "../lib/sample";
import {Portrait,Brand} from "./Art";
import {restoreDraft} from "../lib/restore-draft";
import {PostalSnow} from "./PostalSnow";
import {ChristmasMusic} from "./ChristmasMusic";


import {MailDispatch} from "./MailDispatch";
import {Player} from "./Player";
type Screen="home"|"incoming"|"ready"|"fetching"|"missing";
const key="polar.draft.1";
function requestId(){
 const b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;
 const h=Array.from(b,v=>v.toString(16).padStart(2,"0")).join("");
 return [h.slice(0,8),h.slice(8,12),h.slice(12,16),h.slice(16,20),h.slice(20)].join("-");
}
function goTop(){window.scrollTo(0,0)}
function editScroll(atStep:number){requestAnimationFrame(()=>{document.getElementById("editor")?.scrollIntoView({block:"start"});document.getElementById("step-heading-"+atStep)?.focus({preventScroll:true})})}
function Step({num,title,english}:{num:string;title:string;english:string}){return <div className="step"><span>{num}</span><h3 tabIndex={-1} id={"step-heading-"+(Number(num)-1)}>{title}</h3><small>{english}</small></div>}
export default function Studio({initial,missing}:{initial?:Gift;missing?:boolean}){
 const {t}=useLocale();
 
 const [d,set]=useState<Draft>(blank),[screen,S]=useState<Screen>(initial?"incoming":missing?"missing":"home"),[ready,R]=useState<Gift|null>(null),[incoming,G]=useState<Gift>(initial||sample),[loaded,L]=useState(false),[busy,B]=useState(false),[err,E]=useState(""),[storageOK,storage]=useState(true);
 const [writing,setWriting]=useState(false),[impression,printAgain]=useState(0),[step,setStep]=useState(0),[dialing,dial]=useState(false);
 const [sampleFromEditor,setSampleFromEditor]=useState(false);
 const pullStart=useRef<{x:number;y:number}|null>(null);
 const dialTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(dialTimer.current)clearTimeout(dialTimer.current)},[]);
 const id=useRef(""),pending=useRef(false),gen=useRef(0);
 useEffect(()=>{try{const v=JSON.parse(localStorage.getItem(key)||"null");if(v?.draft){const b=blank(),a=v.draft;if(Object.keys(b).every(k=>typeof a[k]===typeof b[k as keyof Draft])&&Object.hasOwn(roles,a.role)&&Object.hasOwn(tones,a.tone)){set(restoreDraft(a));if(v.ready&&valid(v.ready)&&typeof v.ready.id==="string")R(v.ready);id.current=typeof v.key==="string"?v.key:""}}}catch{storage(false)}L(true);
 let controller:AbortController|undefined;
 function restoreEditorStep(){
   const saved=history.state?.editorStep;
   setStep(saved===1||saved===2?saved:0);
 }
 async function route(){controller?.abort();controller=new AbortController();const signal=controller.signal;let q=new URLSearchParams(location.search).get("gift");E("");if(!q){restoreEditorStep();setWriting(location.hash==="#write");S("home");return}goTop();if(q==="sample"){setSampleFromEditor(history.state?.fromEditor===true);G(sample);S("incoming");return}S("fetching");try{const r=await fetch("/api/gifts/"+encodeURIComponent(q),{signal});if(!r.ok)throw 0;const g=await r.json();if(!valid(g))throw 0;G(g as Gift);S("incoming")}catch{if(!signal.aborted)S("missing")}}
 if(location.hash==="#write"&&!location.search){restoreEditorStep();setWriting(true)}
 setSampleFromEditor(history.state?.fromEditor===true);
 window.addEventListener("popstate",route);return()=>{controller?.abort();window.removeEventListener("popstate",route)}},[]);
 useEffect(()=>{if(!loaded)return;try{localStorage.setItem(key,JSON.stringify({draft:d,ready,key:id.current}));storage(true)}catch{storage(false)}},[loaded,d,ready]);
 const m=message(d),full=d.custom?d.text:script(d);
 const stale=!!ready&&(["to","from","role","tone","text","language"] as const).some(k=>m[k]!==ready[k]);
 function change(p:Partial<Draft>){id.current="";set(old=>({...old,...p}));E("")}
 function home(){setWriting(false);if(dialTimer.current)clearTimeout(dialTimer.current);dialTimer.current=null;dial(false);gen.current++;history.pushState(null,"",location.pathname);S("home");E("");goTop()}
 function dialSample(){if(dialTimer.current)return;dial(true);dialTimer.current=setTimeout(()=>{dialTimer.current=null;dial(false);example()},window.matchMedia("(prefers-reduced-motion: reduce)").matches?0:750)}
 function example(){setSampleFromEditor(writing);history.pushState({fromEditor:writing},"","?gift=sample");G(sample);S("incoming");goTop()}
 function reply(back:boolean){setStep(0);const n=blank();n.from=incoming.to;n.to=back?incoming.from:"";n.reply=back;n.wish=back?"Sending that Christmas cheer right back to you.":n.wish;id.current="";set(n);R(null);home();makeCall()}
 function inspire(){if(d.custom&&!confirm(t("Replace your edited message with a new idea? Cancel to keep your words.")))return;change({custom:false,variant:(d.variant+1)%3})}
 async function generate(force=false){if(pending.current)return;if(!valid(m)){E("Add both names and keep the message between 1 and 200 characters.");return}
 if(!force&&ready&&!stale){S("ready");goTop();return}
 pending.current=true;B(true);E("");const request=++gen.current;
 if(!id.current || (force && ready?.id===id.current))id.current=requestId();
 try{localStorage.setItem(key,JSON.stringify({draft:d,ready,key:id.current}))}catch{}
 try{const res=await fetch("/api/gifts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:id.current,message:m}),signal:AbortSignal.timeout(70000)});const g=await res.json() as Gift & {error?:string};if(!res.ok)throw Error(g.error||"The call could not be created. Please try again.");if(request===gen.current){R(g);S("ready");goTop()}}
 catch(e){E(e instanceof Error&&!/fetch|timeout|abort/i.test(e.message)?e.message:"The connection timed out. Your draft is saved. Try again.")}
 finally{pending.current=false;B(false)}}
 function edit(){S("home");E("");makeCall(2)}
 function advance(next:number){
   if(next>step && (!d.to.trim()||!d.from.trim())){
     setStep(0);const input=document.getElementById(!d.to.trim()?"to":"from") as HTMLInputElement;
     input.focus();input.reportValidity();E("Please add both names before continuing.");return;
   }
   E("");history.replaceState({...history.state,editorStep:next},"");setStep(next);requestAnimationFrame(()=>document.getElementById("step-heading-"+next)?.focus({preventScroll:true}));
   document.getElementById("editor")?.scrollIntoView({block:"start"});
 }
 function makeCall(atStep=0){
   setStep(atStep);setWriting(true);
   if(location.hash!=="#write")history.pushState({editorStep:atStep},"",location.pathname+"#write");
   else history.replaceState({editorStep:atStep},"");
   editScroll(atStep);
 }
 return <><PostalSnow/><header className="sitehead"><div className="wrap headinner"><button className="brandbtn" onClick={home} aria-label="Polar Exchange home"><Brand/></button><div className="header-tools"><ChristmasMusic allowed={screen==="home"}/><LanguageMenu/></div></div></header>
 <main className="wrap">
 {screen==="home"&&!writing&&<section className="letterpress" key={impression}>
 <div className="folio"><span>POLAR EXCHANGE <b>✳</b> HOLIDAY EDITION</span><span>No. 1225</span></div>
 <div className="cover-spread"><div className="cover-story"><div className="issue-date"><span/> CHRISTMAS EVE · DEC 24</div>
 <h1>{t("A call from")}<br/><em>{t("the North Pole.")}</em></h1>
 <p>{t("Give Santa a name and an inside story. He has a Christmas call to make.")}</p>
 <div className="cover-actions"><button className="ink-action" onClick={()=>makeCall()}>{t("Write a Christmas call")} <ArrowRight size={19}/></button><button className="sample-link" disabled={dialing} onClick={dialSample}><Headphones size={17}/>{t(dialing?"Connecting…":"Try a sample")}</button></div></div>
 <button className="art-board" onClick={()=>makeCall()}
 onPointerDown={e=>{if(!e.isPrimary||e.button!==0)return;pullStart.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}}
 onPointerMove={e=>{const start=pullStart.current;if(!start)return;const x=Math.max(-65,Math.min(65,e.clientX-start.x));e.currentTarget.style.setProperty("--pull",x+"px")}}
 onPointerCancel={e=>{pullStart.current=null;e.currentTarget.style.removeProperty("--pull")}}
 onPointerUp={e=>{const start=pullStart.current;pullStart.current=null;e.currentTarget.style.removeProperty("--pull");if(start&&Math.abs(e.clientX-start.x)>36)makeCall()}} aria-label={t("Write a Christmas call")}><img className="door-illustration" src="/christmas-post-office.jpg" alt="" fetchPriority="high"/><span className="open-caption">{t("Open the stationery")} ↗</span></button></div>
 <div className="desk-notes"><div className="notes-heading"><span>THE POSTAL ROUTE</span><button onClick={()=>printAgain(i=>i+1)}>{t("Replay the opening")} ↺</button></div>
 <div className="route-line">{([{Mark:Mail,label:"Address"},{Mark:PhoneCall,label:"Choose a voice"},{Mark:Feather,label:"Write a note"}]).map(({Mark,label},i)=>{return <div key={i}><Mark aria-hidden="true"/><span><small>0{i+1}</small>{t(String(label))}</span></div>})}</div></div>
 </section>}
 {screen==="home"&&writing&&<><button className="back desk-back" onClick={home}><ArrowLeft size={15}/>{t("Back to the cover")}</button>
 <div className="sectionhead" id="editor"><div className="workshop-divider" aria-hidden="true"><span/>✴<span/></div><div className="sectionline"><h2>{t("Make it personal")}</h2><div className="autosave"><i/>{storageOK?t("Draft saved"):t("Device storage unavailable")}</div></div></div>
 <nav className="mobile-station" aria-label="Call setup steps">{["Address","Caller","Message"].map((name,i)=><button key={name} aria-current={step===i?"step":undefined} disabled={busy} onClick={()=>advance(i)}><b>{i<step?"✓":"0"+(i+1)}</b>{t(name)}</button>)}</nav>
 <div className="workgrid"><form onSubmit={e=>{e.preventDefault();if(step<2){advance(step+1);return}generate()}} className="formpaper"><fieldset disabled={busy}>
 <section className={"form-stage "+(step===0?"current":"")}><Step num="01" title={t("Who’s the call for?")} english="CALL DETAILS"/>
 <div className="names"><label htmlFor="to">{t("Their name")} <em>*</em><input id="to" aria-invalid={!!err&&!d.to.trim()||undefined} aria-describedby={err&&!d.to.trim()?"address-error":undefined} required maxLength={20} value={d.to} placeholder="e.g. Riley" onChange={e=>change({to:e.target.value})}/></label><label htmlFor="from">{t("Your name")} <em>*</em><input id="from" aria-invalid={!!err&&!d.from.trim()||undefined} aria-describedby={err&&!d.from.trim()?"address-error":undefined} required maxLength={20} value={d.from} placeholder="e.g. Sakura" onChange={e=>change({from:e.target.value})}/></label></div>
 <label htmlFor="detail">{t("A little inside story")} <small>{t("optional")}</small><textarea id="detail" maxLength={80} value={d.detail} placeholder={t("Our last-train sprint")} onChange={e=>change({detail:e.target.value})}/></label>
 <div className="hints">{["Our last-train sprint","Five tries for concert tickets","Our midnight voice notes"].map(v=><button type="button" key={v} aria-pressed={d.detail===v} onClick={()=>change({detail:v})}>{t(v)}</button>)}</div>
 <label htmlFor="wish">{t("Your Christmas wish")}<input id="wish" maxLength={60} value={d.wish} onChange={e=>change({wish:e.target.value})}/></label>
 <div className="hints">{wishes.map((v,i)=><button type="button" key={v} aria-pressed={d.wish===wishText[i]} onClick={()=>change({wish:wishText[i]})}>{t(v)}</button>)}</div>
 {err&&step===0&&<p id="address-error" className="mobile-err warn" role="alert">{t(err)}</p>}<div className="step-nav"><button type="button" className="primary" onClick={()=>advance(1)}>{t("Pick a caller")} <ArrowRight/></button></div></section>
 <section className={"form-stage "+(step===1?"current":"")}><hr/><Step num="02" title={t("Pick your caller")} english="VOICE & TONE"/>
 <div className="roles">{(Object.keys(roles) as (keyof typeof roles)[]).map(r=><button type="button" key={r} aria-pressed={d.role===r} onClick={()=>change({role:r})}><Portrait elf={r==="elf"}/><b>{t(roles[r])}</b><small>{r==="elf"?t("Mischief on duty"):t("Warm & jolly")}</small></button>)}</div>
 <div className="label">{t("Set the mood")}</div><div className="tones">{(Object.keys(tones) as (keyof typeof tones)[]).map(tone=><button key={tone} type="button" aria-pressed={d.tone===tone} onClick={()=>change({tone})}>{t(tones[tone])}</button>)}</div>
 <div className="step-nav"><button type="button" className="secondary" onClick={()=>advance(0)}>{t("Back")}</button><button type="button" className="primary" onClick={()=>advance(2)}>{t("Write the note")} <ArrowRight/></button></div></section>
 <section className={"form-stage "+(step===2?"current":"")}><hr/><Step num="03" title={t("Write your message")} english="YOUR MESSAGE"/>
 <div className="drafthead"><label htmlFor="script">{t("What they’ll hear")}</label><button type="button" className="linkbtn" onClick={inspire}><RefreshCw size={14}/>{t("New idea")}</button></div>
 <textarea id="script" aria-describedby="script-help" className="script" required maxLength={200} value={full} onChange={e=>change({text:e.target.value,custom:true})}/>
 <div className="scriptnote" id="script-help"><span>{d.custom?t("Your edits are saved."):t("A little inspiration. Make it yours.")}</span><span>{full.length} / 200</span></div>
 <Translation text={full} language={d.custom?d.language:"en"} apply={(text,language)=>change({text,language,custom:true})}/>
 {stale&&<p className="warn">{t("Your last recording is out of date. Generate a new call to share these changes.")}</p>}
 {err&&<p role="alert" className="warn">{t(err)}</p>}
 <p className="generation-note">{t("Calls use your device’s demo voice when a Fish Audio voice isn’t configured.")}</p>
 <button className="primary generate" disabled={busy}>{busy?<Radio/>:<PhoneCall/>}{busy?t("Connecting your call…"):stale?t("Update my call"):t("Create my call")}<ArrowRight/></button></section></fieldset></form>
 <aside className="aside"><div className="postcard"><div className="airmail"/><div className="cardtop"><span className="eyebrow"><Radio size={15}/> {t("Call preview")}</span></div><div className="preview-print"><Portrait elf={d.role==="elf"}/></div><div className="eyebrow carden">NORTH POLE EXCHANGE</div><h3>{t(roles[d.role])}</h3><p>{t("A Christmas call for")} <b>{d.to.trim()||t("your friend")}</b></p><div className="postfoot"><span>FROM</span> {d.from.trim()||t("your name")} <Mail size={16}/></div></div>
 <button type="button" className="postlisten" onClick={example}><Headphones size={16}/>{t("Try a sample")} <ArrowRight size={14}/></button><div className="asidenote"><Headphones size={18}/><span>{t("Your friend opens a link and taps to answer. No phone number or microphone needed.")}</span></div></aside></div>
 </>}
 {(screen==="incoming"||screen==="ready"&&ready)&&<section className="giftstage"><button className="back" disabled={busy} onClick={screen==="ready"?edit:sampleFromEditor?()=>history.back():home}><ArrowLeft size={16}/>{screen==="ready"||sampleFromEditor?t("Back to the workshop"):"Polar Exchange"}</button>
 <div className={"giftgrid "+(screen==="ready"?"sealed":"")}><div className="giftart"><div className="eyebrow">NORTH POLE POST &nbsp; ✦ &nbsp; 12 / 25</div><div className="english">{(screen==="ready"?ready!:incoming).to}</div></div>
 <div className="giftpaper"><div className="airmail"/>{screen==="ready"&&<span className="seal-imprint" aria-hidden="true">POLAR POST ✓</span>}<div className="kicker"><span/>{screen==="ready"?"READY TO SHARE":"SPECIAL DELIVERY"}</div>
 <h1>{screen==="ready"?t("Your call for {to} is ready.",{to:ready!.to}):t("North Pole calling…")}</h1>
 <Player key={(screen==="ready"?ready!:incoming).id} g={screen==="ready"?ready!:incoming} receiver={screen==="incoming"} onReply={reply}/>
 {screen==="ready"&&<div className="sharetools"><MailDispatch key={ready!.id} gift={ready!} disabled={busy||stale}/><div className="subactions"><button disabled={busy} onClick={edit}><PencilLine/>{t("Edit message")}</button><button disabled={busy} onClick={()=>generate(true)}><RefreshCw/>{busy?t("Connecting…"):t("Regenerate")}</button></div>{err&&<p role="alert" className="warn">{t(err)}</p>}</div>}</div></div></section>}
 {(screen==="fetching"||screen==="missing")&&<section className="missing"><Mail/><h1>{screen==="fetching"?t("Connecting to the North Pole…"):t("We couldn’t find this call")}</h1>{screen==="missing"&&<><p>{t("Check the link or try again in a moment.")}</p><button className="secondary" onClick={()=>location.reload()}>{t("Try again")}</button> <button className="primary" onClick={home}>{t("Make a call")}</button></>}</section>}
 </main><footer className="wrap"><Snowflake size={16}/><span>Polar Exchange</span><span className="footen">NORTH POLE POSTAL SERVICE</span><span className="footright">✦ &nbsp; Sealed with a little snow</span></footer><div className="wrap music-credit">♫ &nbsp; December at the Post Office · Polar Exchange</div></>
}
