"use client";
import {useLocale} from "./Locale";
import {useId} from "react";
import {PhoneCall} from "lucide-react";

export function Telephone({mode="idle",onDial}:{mode?:"idle"|"dialing"|"incoming"|"quiet";onDial?:()=>void}){
 const {t}=useLocale();
 const id=useId().replace(/:/g,"");
 const handset="M108 103 Q111 66 142 56 Q189 32 253 42 Q331 47 376 76 Q403 87 409 123 L412 140 L405 162 Q391 175 340 153 L321 137 L327 106 L317 92 Q309 72 288 73 L207 68 L201 86 L184 88 L170 111 Q157 130 116 130 Z";
 const drawing=<svg className="phone-illustration" viewBox="0 0 480 320" aria-hidden="true">
 <defs><clipPath id={id+"hand"}><path d={handset}/></clipPath><clipPath id={id+"dial"}><circle r="1"/></clipPath><mask id={id+"base"}><rect width="480" height="320" fill="white"/><path d={handset} fill="black"/></mask></defs>
 <rect width="480" height="320" fill="#f5ecdc"/><image href="/telephone.webp" width="480" height="320" mask={'url(#'+id+'base)'}/>
 <g className="receiver-piece"><g clipPath={'url(#'+id+'hand)'}><image href="/telephone.webp" width="480" height="320"/></g></g>
 <g transform="matrix(46 -34 28 39 213 151)"><g clipPath={'url(#'+id+'dial)'}><g className="rotary-wheel"><g transform="matrix(0.01420247632920612 0.012381646030589947 -0.010196649672250544 0.016751638747268753 -1.485433357611071 -5.166788055353241)"><image href="/telephone.webp" width="480" height="320"/></g></g></g></g>
 <g className="ring-marks" fill="none" stroke="#b58341" strokeWidth="3" strokeLinecap="round"><path d="M105 63q-12 8-13 21m5-32q-17 10-20 28M404 68q11 6 14 17m-8-28q15 6 20 24"/></g>
 </svg>;
 return <div className={'telephone-stage '+mode}>
 {onDial?<button type="button" className="dial-toy" onClick={onDial} aria-label="Dial the North Pole sample call" aria-disabled={mode==="dialing"}>{drawing}<span className="dial-prompt"><PhoneCall size={13}/>{t(mode==="dialing"?"Connecting…":"Tap to dial")}<span>↗</span></span></button>:drawing}
 <div className="snowfield" aria-hidden="true">{Array.from({length:9},(_,i)=><i key={i} style={{left:(5+i*10.8)+"%",animationDelay:(-i*.87)+"s",animationDuration:(4+i%4)+"s"}}/>)}</div>
 </div>
}
