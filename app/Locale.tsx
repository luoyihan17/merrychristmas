"use client";
import {createContext,useContext,useEffect,useState} from "react";
import labels from "../lib/interface.json";
import {languages,uiLanguages} from "../lib/languages";
import {Globe} from "lucide-react";
const Locale=createContext({locale:"en",setLocale:(_s:string)=>{}});
export function LanguageProvider({children}:{children:React.ReactNode}){
 const [locale,set]=useState("en");
 useEffect(()=>{try{const saved=localStorage.getItem("polar.interface");if(saved&&uiLanguages.includes(saved))set(saved)}catch{}},[]);
 useEffect(()=>{document.documentElement.lang=locale},[locale]);
 function setLocale(s:string){if(!uiLanguages.includes(s))return;set(s);try{localStorage.setItem("polar.interface",s)}catch{}}
 return <Locale.Provider value={{locale,setLocale}}>{children}</Locale.Provider>
}
export function useLocale(){
 const {locale,setLocale}=useContext(Locale);
 function t(key:string,fields?:Record<string,string>){
  const row=(labels as Record<string,string[]>)[key];
  const value=row?.[uiLanguages.indexOf(locale)-1]??key;
  return fields?value.replace(/\{(\w+)\}/g,(match,name)=>fields[name]??match):value;
 }
 return {locale,setLocale,t};
}
export function LanguageMenu(){const {locale,setLocale,t}=useLocale();return <label className="language-menu"><Globe size={16}/><select aria-label={t("Language")} value={locale} onChange={e=>setLocale(e.target.value)}>{uiLanguages.map(s=><option key={s} value={s} lang={s}>{languages[s]}</option>)}</select></label>}
