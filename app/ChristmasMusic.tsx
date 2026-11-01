"use client";
import {useEffect,useRef,useState} from "react";
import {Volume2,VolumeX} from "lucide-react";
import {useLocale} from "./Locale";

export function ChristmasMusic({allowed}:{allowed:boolean}){
 const {t}=useLocale(), ref=useRef<HTMLAudioElement>(null);
 const [muted,setMuted]=useState<boolean|null>(null);
 useEffect(()=>{try{setMuted(localStorage.getItem("polar.muted")==="1")}catch{setMuted(false)}},[]);
 useEffect(()=>{
   const a=ref.current;
   if(!a||muted!==false||!allowed){a?.pause();return}
   a.volume=.54;
   let active=true;
   function play(){if(active&&!document.hidden&&a?.paused)void a.play().catch(()=>{})}
   function visibility(){if(document.hidden)a?.pause();else play()}
   play();
   document.addEventListener("click",play,true);
   document.addEventListener("keydown",play,true);
   document.addEventListener("visibilitychange",visibility);
   return ()=>{active=false;a.pause();document.removeEventListener("click",play,true);document.removeEventListener("keydown",play,true);document.removeEventListener("visibilitychange",visibility)};
 },[allowed,muted]);
 function toggle(){const next=!muted;setMuted(next);if(next)ref.current?.pause();else if(allowed)void ref.current?.play().catch(()=>{});try{localStorage.setItem("polar.muted",next?"1":"0")}catch{}}
 return <><audio ref={ref} src="/december-at-the-post-office.wav" loop preload="none"/>{allowed&&<button className="mute-pref" onClick={toggle} aria-label={t(muted?"Unmute background music":"Mute background music")} title={t(muted?"Unmute background music":"Mute background music")}>{muted?<VolumeX size={18}/>:<Volume2 size={18}/>}</button>}</>;
}
