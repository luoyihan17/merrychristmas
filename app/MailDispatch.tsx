"use client";
import {useEffect,useRef,useState} from "react";
import {RotateCcw,Send,X} from "lucide-react";
import {useLocale} from "./Locale";
import type {Gift} from "../lib/gift";
import "./dispatch.css";

type Result="copied"|"shared";

function PostOffice({to}:{to:string}){
 return <svg className="dispatch-print" viewBox="0 0 360 280" aria-hidden="true">
 <defs>
 <linearGradient id="stationery" x2=".85" y2="1"><stop stopColor="#fff7dd"/><stop offset=".55" stopColor="#f7e4be"/><stop offset="1" stopColor="#d4b083"/></linearGradient>
 <image id="open-stationery" href="/letter-open.webp" x="-86" y="-89" width="172" height="135" preserveAspectRatio="none"/>
 <image id="closed-stationery" href="/letter-sealed.webp" x="-77.5" y="-33" width="155" height="78" preserveAspectRatio="none"/>
 {/* Follow the painted flap edge, including the sprig below the wax seal. */}
 <clipPath id="sealed-lid"><path d="M-76-32 H76 Q76-27 68-20 L15 9 Q15 12 12 13 L30 16 L22 18 L29 24 L21 23 L26 36 L18 27 L16 33 L10 23 L-2 32 L-3 19 Q-14 19 -16 8 L-68-20 Q-74-23 -76-32Z"/></clipPath>
 <clipPath id="open-body"><rect x="-80" y="-31" width="160" height="78"/></clipPath>
 <clipPath id="open-lid"><rect x="-80" y="-90" width="160" height="59.2"/></clipPath>
 <clipPath id="pocket-front"><path d="M-75-31 Q-31-13 0 4 Q32-13 75-31 V45 H-75Z"/></clipPath>
 <clipPath id="postal-slot-lip" clipPathUnits="userSpaceOnUse"><rect className="slot-mask" width="360" height="168"/></clipPath>
 <clipPath id="paper-pocket" clipPathUnits="userSpaceOnUse"><rect x="-74" y="-150" width="148" height="193"/></clipPath>
 </defs>
 <image href="/christmas-writing-desk.jpg" width="360" height="280" preserveAspectRatio="none"/>
 <g className="office-building">
 <image href="/christmas-post-office.jpg" width="360" height="280" preserveAspectRatio="none"/>
 </g>
 <g clipPath="url(#postal-slot-lip)"><g className="flying-letter"><g className="letter-attitude"><g className="letter-shadow">
 <g className="inner-flap"><use href="#open-stationery" clipPath="url(#open-lid)"/></g>
 <use href="#open-stationery" clipPath="url(#open-body)"/>
 <g clipPath="url(#paper-pocket)"><g className="written-note">
 <rect x="-60" y="-56" width="120" height="54" fill="url(#stationery)" stroke="#95876b"/>
 <text x="0" y="-41" textAnchor="middle" fontSize="11" fill="#35483d" fontStyle="italic" fontFamily="Georgia,serif">{Array.from(to).slice(0,15).join("")}</text>
 <path d="M-46-32h86m-86 8h76m-76 8h62" stroke="#a3a18a" fill="none"/>
 <g className="note-fold"><rect x="-60" y="-110" width="120" height="54" fill="url(#stationery)" stroke="#95876b"/>
 <g className="note-ink" textAnchor="middle" fill="#885240">
 <path d="M-52-104H52V-63H-52Z" fill="none" stroke="#b19264" strokeWidth=".55"/>
 <text y="-90" fontFamily="Georgia,serif" fontSize="9" letterSpacing="1">POLAR POST</text>
 <path d="M-34-82h27m14 0h27" stroke="#b19264" strokeWidth=".6"/>
 <text y="-79" fontSize="8">✳</text><text y="-69" fontFamily="Georgia,serif" fontSize="5.4" letterSpacing="1.4">CHRISTMAS EVE</text></g></g>
 </g></g>
 <use href="#open-stationery" clipPath="url(#pocket-front)"/>
 <g className="outer-flap"><use href="#closed-stationery" clipPath="url(#sealed-lid)"/></g>
 <use href="#closed-stationery" className="sealed-stationery"/>
 </g></g></g></g>
 <g transform="translate(315 247) rotate(-11)" fill="none" stroke="#955846" opacity=".84">
 <g className="dispatch-mark">
 <path d="M-67-5q8-4 17 0t19 0m-36 5q8-4 17 0t19 0m-36 5q8-4 17 0t19 0" strokeWidth=".85"/>
 <circle r="22" strokeWidth="1.4"/><circle r="19.4" strokeWidth=".65"/>
 <g fill="#834535" stroke="none" textAnchor="middle"><text y="-5" fontFamily="monospace" fontSize="5.1" letterSpacing=".6">POLAR POST</text><text y="5" fontFamily="Georgia,serif" fontSize="9">DEC 24</text><text y="14" fontSize="7">✳</text></g>
 </g></g>
 </svg>
}

function PostingFilm({gift,to,close}:{gift?:Gift;to:string;close:()=>void}){
 const {t}=useLocale(),dialog=useRef<HTMLDialogElement>(null);
 const [take,replay]=useState(0);
 useEffect(()=>{const node=dialog.current!;node.showModal();const prev=document.documentElement.style.overflow;document.documentElement.style.overflow="hidden";return()=>{node.close();document.documentElement.style.overflow=prev}},[]);
 const [result,setResult]=useState<Result|null>(null),[manual,setManual]=useState(""),[pending,setPending]=useState(false);
 const lock=useRef(false);
 async function share(){
  if(lock.current||!gift)return;
  lock.current=true;setPending(true);setManual("");
  const url=new URL(location.pathname,location.origin);url.searchParams.set("gift",gift.id);
  try{
   if(navigator.share){try{await navigator.share({title:"A North Pole call for "+gift.to,text:gift.from+" left you a Christmas call.",url:url.href});setResult("shared");return}catch(err){if(err instanceof Error&&err.name==="AbortError")return}}
   try{await navigator.clipboard.writeText(url.href);setResult("copied")}catch{setManual(url.href)}
  }finally{lock.current=false;setPending(false)}
 }
 return <dialog ref={dialog} className="posting-dialog" onCancel={e=>{e.preventDefault();close()}} aria-labelledby="dispatch-heading">
 <div className="dispatch-mast"><span>✳ &nbsp; POLAR EXCHANGE</span><button type="button" onClick={close} autoFocus aria-label={t("Close")}><X size={18}/></button></div>
 <div className="dispatch-stage" key={take}><PostOffice to={to}/></div>
 <div className="dispatch-copy"><small>NORTH POLE &nbsp; / &nbsp; 24 DEC.</small><h2 id="dispatch-heading">{t("A letter for {to}.",{to})}</h2>
 <p role="status">{result?t(result==="copied"?"Link copied. Paste it into a message to send your call.":"Your call is ready to share again whenever you like."):gift?t(manual?"Select and copy the link below.":"Share the link so they can answer your call."):null}</p>
 {manual&&!result&&<input aria-label={t("Shareable call link")} readOnly value={manual} onFocus={e=>e.target.select()} onCopy={e=>{
   const el=e.currentTarget;
   if(el.selectionStart===0&&el.selectionEnd===manual.length&&e.clipboardData){
     e.clipboardData.setData("text/plain",manual);e.preventDefault();setResult("copied");
   }
 }}/>}
 <div><button type="button" className="dispatch-replay" onClick={()=>replay(n=>n+1)}><RotateCcw size={15}/>{t("Replay the folding")}</button>
 {gift&&!result?<button className="primary" type="button" disabled={pending} onClick={share}><Send size={16}/>{t("Share link")}</button>:<button className="primary" type="button" onClick={close}>{t("Done")}</button>}</div></div>
 </dialog>
}

export function MailDispatch({gift,disabled}:{gift:Gift;disabled:boolean}){
 const {t}=useLocale();
 const [open,setOpen]=useState(false);
 return <><button className="primary" disabled={disabled} onClick={()=>setOpen(true)}><Send/>{t("Share this call")}</button>
 {open&&<PostingFilm gift={gift} to={gift.to} close={()=>setOpen(false)}/>}</>;
}

export function PostPreview(){
 return <PostingFilm to="Riley" close={()=>location.assign(location.pathname)}/>;
}
