"use client";
import {useEffect,useRef,useState} from "react";
import {Phone,Pause,Play,RotateCcw,PhoneOff,BookOpen,Gift as GiftIcon} from "lucide-react";
import {roles,type Gift} from "../lib/gift";
import {sourceLabel} from "../lib/sample";
import {Translation} from "./Translation";
import {useLocale} from "./Locale";
import {Portrait} from "./Art";
type State="idle"|"loading"|"playing"|"paused"|"ended"|"error";
const clock=(s:number)=>Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0");
export function Player({g,receiver=false,onReply}:{g:Gift;receiver?:boolean;onReply?:(reply:boolean)=>void}){
 const {t}=useLocale();
 const [state,S]=useState<State>("idle"),[seen,show]=useState(!receiver),[pos,P]=useState(0),[duration,D]=useState(0),[index,I]=useState(0),[error,E]=useState("");
 const audio=useRef<HTMLAudioElement>(null),utter=useRef<SpeechSynthesisUtterance|null>(null),serial=useRef(0);
 const device=g.source==="device",src=g.source==="sample"?"/sample.mp3":"/api/gifts/"+g.id+"/audio";
 useEffect(()=>{const a=audio.current;if(device && "speechSynthesis" in window)window.speechSynthesis.getVoices();return()=>{serial.current++;a?.pause();if(utter.current)window.speechSynthesis?.cancel()}},[g.id,device]);
 useEffect(()=>{if(!device||state!=="loading")return;const timer=setTimeout(()=>{serial.current++;window.speechSynthesis?.cancel();S("error");E("Your device voice didn’t respond. Try again or read the note below.")},12000);return()=>clearTimeout(timer)},[device,state]);
 function finish(){serial.current++;if(audio.current)audio.current.pause();if(device)window.speechSynthesis?.cancel();S("ended");show(true)}
 function start(restart=false){
   show(true);E("");const token=++serial.current;
   if(!device){const a=audio.current!;if(a.error)a.load();if(restart||state==="ended")a.currentTime=0;S("loading");a.play().catch(()=>{if(token===serial.current){S("error");E("Playback was interrupted. Tap to try again.")}});return}
   if(!("speechSynthesis" in window)){S("error");E("This browser has no device voice. Read the note below or open it in your phone’s browser.");return}
   const synth=window.speechSynthesis;
   if(state==="paused"&&!restart){serial.current--;synth.resume();S("playing");return}
   synth.cancel();I(0);P(0);const u=new SpeechSynthesisUtterance(g.text);utter.current=u;const legacyChinese = /[\u3400-\u9fff]/.test(g.text) && !/[a-z]{3} [a-z]{3}/i.test(g.text);
   u.lang=g.language||(legacyChinese?"zh-CN":"en-US");const voices=synth.getVoices();const voice=voices.find(v=>v.lang.toLowerCase()===u.lang.toLowerCase())||voices.find(v=>v.lang.toLowerCase().split("-")[0]===u.lang.toLowerCase().split("-")[0]);if(voice)u.voice=voice;
   u.rate={gentle:0.91,cheer:1.08,playful:1.02}[g.tone];u.pitch=g.role==="elf"?1.22:0.85;
   u.onstart=()=>{if(token===serial.current)S("playing")};u.onboundary=e=>{if(token===serial.current){I(e.charIndex);P(e.elapsedTime)}};
   u.onend=e=>{if(token===serial.current){I(g.text.length);P(e.elapsedTime);S("ended")}};
   u.onerror=()=>{if(token===serial.current){S("error");E("Your device voice is unavailable. Retry or read the note below.")}};
   S("loading");synth.speak(u)
 }
 function pause(){if(device){window.speechSynthesis.pause();S("paused")}else audio.current?.pause()}
 const ended=state==="ended",active=state==="playing"||state==="paused"||state==="loading";
 const btn=state==="playing"?"Pause":state==="paused"?"Resume":state==="error"?"Retry playback":ended?"Replay":state==="loading"?"Connecting…":receiver?"Answer call":"Play call";
 return <section className={'player '+(state==="playing"?"onair":receiver&&state==="idle"?"ringing":"")}>
 {!device&&<audio ref={audio} src={src} preload="metadata" onTimeUpdate={e=>P(e.currentTarget.currentTime)} onDurationChange={e=>D(Number.isFinite(e.currentTarget.duration)?e.currentTarget.duration:0)} onPlaying={()=>S("playing")} onWaiting={()=>S("loading")} onPause={()=>S(s=>s==="ended"?s:"paused")} onEnded={()=>S("ended")} onError={()=>{E("The audio couldn’t load. Try again or read the note.");S("error")}}/>}
 <div className="caller"><Portrait elf={g.role==="elf"}/><div><small className="eyebrow">{state==="playing"?"ON THE LINE":state==="paused"?"ON HOLD":ended?"CALL COMPLETE":receiver?"INCOMING CALL":"VOICE PREVIEW"}</small><h2>{t(roles[g.role])}</h2></div><div className="signal-bars" aria-hidden="true">{[0,1,2,3,4,5,6].map(i=><i key={i} style={{animationDelay:(-.16*i)+"s",height:(6+(i*7)%17)+"px"}}/>)}</div><span className="lamp"/></div>
 <p className="giftcaption">{t("{from} asked {role} to leave a Christmas message for {to}.",{from:g.from,role:t(roles[g.role]),to:g.to})}</p>
 <div className="source"><GiftIcon size={14}/> {t("AI voice gift")} <span>·</span> {t(sourceLabel(g))}</div>
 {error&&<p className="warn" role="alert">{t(error)}</p>}
 <div className="bar"><button className="primary" disabled={state==="loading"} onClick={()=>state==="playing"?pause():start(ended)}>{state==="playing"?<Pause/>:state==="paused"?<Play/>:ended?<RotateCcw/>:<Phone/>}{t(btn)}</button>
 {active&&<button className="secondary" onClick={finish}><PhoneOff/>{t("End call")}</button>}
 {active&&<button className="iconbtn" aria-label="Replay from the start" onClick={()=>start(true)}><RotateCcw/></button>}
 {!seen&&<button className="secondary" onClick={()=>show(true)}><BookOpen/>{t("Read first")}</button>}</div>
 {(active||ended)&&<div className="progress">{!device?<><progress value={pos} max={duration||1}/><small>{clock(pos)} / {duration?clock(duration):"–:––"}</small></>:<><progress {...(index||ended?{value:index,max:g.text.length}:{})}/><small>{index?index+" / "+g.text.length+" characters":state==="paused"?"Paused":ended?"Ended":"Speaking"}{pos>0?" · "+clock(pos):""}</small></>}</div>}
 {seen&&<div className="transcript"><span className="eyebrow">{t(g.source==="sample"?"Sample transcript":"Your message")}</span><p dir="auto">{g.text}</p><Translation text={g.text} language={g.language} sample={g.source==="sample"}/></div>}
 {receiver&&seen&&(!active||state==="paused")&&<div className="reply"><h3>{t(ended?"This one was just for you.":"Want to send a little joy back?")}</h3><button className="primary" onClick={()=>onReply?.(true)}>{t("Call {name} back",{name:g.from})}</button><button className="secondary" onClick={()=>onReply?.(false)}>{t("Make one for a friend")}</button></div>}
 </section>
}
