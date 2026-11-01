"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import {RotateCcw,X} from "lucide-react";
import {useLocale} from "./Locale";
import {WinterScene} from "./WinterScene";

const seenKey="polar.postcard-opening.1";
export function ChristmasOpening({autoPlay}:{autoPlay:boolean}){
 const {t}=useLocale();
 const dialog=useRef<HTMLDialogElement>(null);
 const [open,setOpen]=useState(false);
 const previousFocus=useRef<HTMLElement|null>(null);
 const start=useCallback(()=>{
   previousFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null;
   setOpen(true);
 },[]);
 useEffect(()=>{
   if(!autoPlay||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
   try{if(sessionStorage.getItem(seenKey))return;sessionStorage.setItem(seenKey,"1")}catch{}
   start();
 },[start,autoPlay]);
 useEffect(()=>{
  if(!open||!dialog.current)return;
  const node=dialog.current;
  node.showModal();
  const oldOverflow=document.documentElement.style.overflow;
  document.documentElement.style.overflow="hidden";
  const timer=setTimeout(()=>setOpen(false),4400);
  return ()=>{clearTimeout(timer);node.close();document.documentElement.style.overflow=oldOverflow;
    if(previousFocus.current?.isConnected)previousFocus.current.focus({preventScroll:true})};
 },[open]);
 return <><button type="button" className="replay-postcard" onClick={start}><RotateCcw size={14}/>{t("Replay the opening")}</button>
 {open&&<dialog className="christmas-opening" ref={dialog} onCancel={e=>{e.preventDefault();setOpen(false)}} aria-labelledby="opening-title">
 <button className="skip-film" type="button" onClick={()=>setOpen(false)} autoFocus>{t("Skip intro")}<X size={15}/></button>
 <div className="film-stock"><article className="night-postcard"><div className="postcard-heading"><span>★ &nbsp; NORTH POLE POST</span><span>24 &nbsp; DEC.</span></div>
 <div className="opening-plate"><WinterScene/><div className="postal-cancel"><span>POLAR EXPRESS</span><b>DEC 24</b><span>NORTH POLE</span></div></div>
 <div className="card-caption"><h2 id="opening-title">{t("Christmas Eve, North Pole.")}</h2><span aria-hidden="true">✴</span></div></article></div>
 </dialog>}</>
}
