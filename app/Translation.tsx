"use client";
import {useEffect,useRef,useState} from "react";
import {Languages} from "lucide-react";
import {languages,guessLanguage} from "../lib/languages";
import {sampleTranslations} from "../lib/sample-translations";
import {useLocale} from "./Locale";

type LocalTranslator={translate:(text:string)=>Promise<string>;destroy:()=>void};
type LocalAPI={availability:(pair:{sourceLanguage:string;targetLanguage:string})=>Promise<string>;create:(pair:{sourceLanguage:string;targetLanguage:string;signal:AbortSignal})=>Promise<LocalTranslator>};
function localAPI(){return (window as Window & {Translator?:LocalAPI}).Translator}
export function Translation({text,language,sample=false,apply}:{text:string;language?:string;sample?:boolean;apply?:(value:string,lang:string)=>void}){
 const {locale,t}=useLocale();
 const original=language||guessLanguage(text);
 const [from,F]=useState(original),[to,T]=useState(locale!==original?locale:original==="en"?"zh-CN":"en"),[busy,B]=useState(false),[value,V]=useState(""),[error,E]=useState("");
 const [local,setLocal]=useState(false),[preferDevice,prefer]=useState(true);
 useEffect(()=>setLocal(Boolean(localAPI())),[]);
 const active=useRef<AbortController|null>(null);
 function reset(){active.current?.abort();active.current=null;B(false);V("");E("")}
 useEffect(()=>{reset();F(original);T(locale!==original?locale:original==="en"?"zh-CN":"en");return()=>active.current?.abort()},[text,original,locale]);
 const prepared=sample&&from==="en"?sampleTranslations[to]:undefined;
 async function translate(){
   if(active.current||from===to||!text.trim())return;
   if(prepared){V(prepared);E("");return}
   const c=new AbortController();active.current=c;B(true);E("");V("");
   const device=local&&preferDevice;
   const timer=setTimeout(()=>c.abort(),device?90000:22000);
   try{
    if(device){
     const api=localAPI()!,pair={sourceLanguage:from,targetLanguage:to};
     if(await api.availability(pair)==="unavailable")throw new Error("Translation unavailable. Try again later.");
     const model=await api.create({...pair,signal:c.signal});
     try{const result=await model.translate(text);if(active.current===c&&!c.signal.aborted)V(result)}
     finally{model.destroy()}
     return;
    }
    const res=await fetch("/api/translate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text,from,to}),signal:c.signal});
    if(!res.ok)throw new Error(res.status===429?"Translation limit reached. Try again later.":"Translation unavailable. Try again later.");
    const result=await res.json() as {text:string};if(active.current===c)V(result.text);
   }catch(e){if(active.current===c)E(e instanceof Error&&e.message.startsWith("Translation")?e.message:"Translation unavailable. Try again later.")}
   finally{clearTimeout(timer);if(active.current===c){B(false);active.current=null}}
 }
 const options=Object.entries(languages).map(([id,name])=><option key={id} value={id} lang={id}>{name}</option>);
 return <details className="translation"><summary><Languages size={17}/>{t("Translate message")}</summary><div className="translation-body">
 <div className="language-pair"><label>{t("From language")}<select value={from} onChange={e=>{reset();F(e.target.value)}}>{options}</select></label><label>{t("To language")}<select value={to} onChange={e=>{reset();T(e.target.value)}}>{options}</select></label></div>
 {!prepared&&local&&<label className="device-translation"><input type="checkbox" checked={preferDevice} onChange={e=>{reset();prefer(e.target.checked)}}/>{t("Translate on this device")}</label>}
 {!prepared&&local&&preferDevice&&<p>{t("If this language pair is unavailable on your device, you can choose online translation.")}</p>}
 {!prepared&&!(local&&preferDevice)&&<p>{t("Only tap Translate if you want to send this text to MyMemory for translation.")}</p>}
 <button type="button" className="secondary" disabled={busy||from===to||!text.trim()} onClick={translate}>{t(busy?"Translating…":"Translate")}</button>
 {from===to&&<p>{t("Choose two different languages.")}</p>}{error&&<p role="alert">{t(error)} <a target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" href={"https://translate.google.com/?"+new URLSearchParams({sl:from,tl:to,text,op:"translate"})}>{t("Open in Google Translate")} ↗</a></p>}
 {(value||(apply&&error))&&<div className="translation-result" role="status"><b>{t("Translation")} · {languages[to]}</b>{apply?<><textarea placeholder={t("Paste your translation here")} aria-label={t("Translation")} lang={to} dir="auto" value={value} onChange={e=>V(e.target.value)}/>{value.length>200&&<p>{t("Shorten to 200 characters to use this translation.")}</p>}<button type="button" className="primary" disabled={value.length>200||!value.trim()} onClick={()=>apply(value.trim(),to)}>{t("Use this translation")}</button></>:<><p dir="auto" lang={to}>{value}</p><small>{t("Read translation. The recording stays in its original language.")}</small></>}</div>}
 </div></details>
}
